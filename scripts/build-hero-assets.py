#!/usr/bin/env python3
"""Turn a raw intro video into the seamless looping hero clip + stills.

Usage:
  python3 scripts/build-hero-assets.py path/to/intro.mp4 [--crop W:H:X:Y] [--photo face.jpg]
         [--seconds 10] [--fade 0.5]

Writes:
  public/hero/hero.mp4     H.264 yuv420p CRF 24 (slow) + AAC 96k, +faststart
  public/hero/hero.webm    VP9 CRF 36 + Opus 80k
  public/portrait-bust.webp  480x600 head-to-shirt crop (sharpest frame, or --photo)
  public/og.jpg            1200x630

Needs ffmpeg/ffprobe on PATH and numpy. The clip is never stretched or retimed,
so lips stay in sync: the last `fade` seconds are cross-faded into the first
`fade` seconds (video via xfade, audio sample-accurately in numpy).
"""

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np  # pip install numpy

ROOT = Path(__file__).resolve().parent.parent
OUT_HERO = ROOT / "public" / "hero"
WIDTH = 768
SR = 48000
WHITEN = "colorlevels=rimax=0.98:gimax=0.98:bimax=0.98"


def run(cmd, **kw):
    print("  $", " ".join(str(c) for c in cmd))
    return subprocess.run(cmd, check=True, **kw)


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)],
        check=True, capture_output=True, text=True,
    ).stdout
    info = json.loads(out)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    has_audio = any(s["codec_type"] == "audio" for s in info["streams"])
    num, den = (int(x) for x in v["r_frame_rate"].split("/"))
    return int(v["width"]), int(v["height"]), num / den, float(info["format"]["duration"]), has_audio


def gray_frames(path, w, h, n=12, duration=10.0):
    """Sample n downscaled grayscale frames as float arrays (sw x sh)."""
    sw, sh = 320, max(2, round(320 * h / w / 2) * 2)
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-t", str(duration),
         "-vf", f"fps={n / duration},scale={sw}:{sh},format=gray", "-f", "rawvideo", "-"],
        check=True, capture_output=True,
    ).stdout
    frames = np.frombuffer(raw, np.uint8).reshape(-1, sh, sw).astype(np.float32)
    return frames, sw / w


def detect_crop(path, w, h, duration):
    """Bounding box of everything darker than the bright backdrop, padded,
    widened to a 4:5 box and centred on the person horizontally."""
    frames, s = gray_frames(path, w, h, duration=duration)
    bg = np.percentile(frames, 90)
    mask = (frames < bg - 28).any(axis=0)
    # drop thin noise: keep columns/rows with a meaningful amount of foreground
    cols = np.where(mask.sum(axis=0) > mask.shape[0] * 0.02)[0]
    rows = np.where(mask.sum(axis=1) > mask.shape[1] * 0.01)[0]
    if len(cols) == 0 or len(rows) == 0:
        sys.exit("Could not find the person. Pass --crop W:H:X:Y.")
    x0, x1 = cols[0] / s, cols[-1] / s
    y0, y1 = rows[0] / s, rows[-1] / s
    ch = min(h, (y1 - y0) * 1.08)
    cw = min(w, ch * 0.8)  # 768/960 aspect
    cx = (x0 + x1) / 2
    x = int(np.clip(cx - cw / 2, 0, w - cw))
    y = int(np.clip(y0 - (ch - (y1 - y0)) / 2, 0, h - ch))
    cw, ch = int(cw) // 2 * 2, int(ch) // 2 * 2
    return f"{cw}:{ch}:{x}:{y}"


def extract_audio(src, start, length, dst):
    run(["ffmpeg", "-v", "error", "-y", "-ss", f"{start}", "-t", f"{length}", "-i", str(src),
         "-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", str(dst)])
    return np.fromfile(dst, np.float32).reshape(-1, 2)


def loop_audio(src, total, fade, tmp):
    """Return float32 stereo of length (total - fade) whose end flows into its start.

    Output = body[fade : total-fade] followed by an equal-power blend of
    tail[total-fade : total] fading out with head[0 : fade] fading in. On repeat
    the next pass starts at `fade`, exactly where the blended head left off."""
    a = extract_audio(src, 0, total, tmp / "a.f32")
    n_total = int(round(total * SR))
    n_fade = int(round(fade * SR))
    a = np.pad(a, ((0, max(0, n_total - len(a))), (0, 0)))[:n_total]
    head, tail = a[:n_fade], a[n_total - n_fade:]
    t = np.linspace(0, np.pi / 2, n_fade, dtype=np.float32)[:, None]
    blend = tail * np.cos(t) + head * np.sin(t)
    out = np.concatenate([a[n_fade:n_total - n_fade], blend])
    return np.clip(out, -1, 1)


def sharpest_time(path, w, h, duration):
    frames, _ = gray_frames(path, w, h, n=30, duration=duration)
    lap = [np.var(np.diff(f, 2, axis=0)) + np.var(np.diff(f, 2, axis=1)) for f in frames]
    return (int(np.argmax(lap)) + 0.5) * duration / len(frames)


def to_webp(src, dst, quality=86):
    """Many ffmpeg builds lack libwebp, so encode the still with Pillow or cwebp."""
    try:
        from PIL import Image
        Image.open(src).save(dst, "WEBP", quality=quality)
    except ImportError:
        if not shutil.which("cwebp"):
            sys.exit("Need Pillow (pip install pillow) or cwebp to write the .webp portrait")
        run(["cwebp", "-quiet", "-q", str(quality), str(src), "-o", str(dst)])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--crop", help="W:H:X:Y in source pixels (skips detection)")
    ap.add_argument("--photo", help="optional still for the ID-card portrait")
    ap.add_argument("--seconds", type=float, default=10.0)
    ap.add_argument("--fade", type=float, default=0.5)
    args = ap.parse_args()

    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg not found on PATH")
    src = Path(args.video).resolve()
    w, h, fps, dur, has_audio = probe(src)
    total = min(args.seconds, dur)
    fade = args.fade
    if total <= fade * 3:
        sys.exit("Clip too short for the cross-fade.")
    crop = args.crop or detect_crop(src, w, h, total)
    print(f"source {w}x{h} @ {fps:.3f}fps, {dur:.2f}s  ->  using {total:.2f}s, crop={crop}")

    OUT_HERO.mkdir(parents=True, exist_ok=True)
    vf = f"crop={crop},scale={WIDTH}:-2,{WHITEN},fps={fps:.6f},format=yuv420p,settb=AVTB"
    # body = [fade, total-fade); blend = xfade(tail, head). Output length = total - fade.
    graph = (
        f"[0:v]trim=0:{total},setpts=PTS-STARTPTS,{vf},split=3[a][b][c];"
        f"[a]trim={fade}:{total - fade},setpts=PTS-STARTPTS[body];"
        f"[b]trim={total - fade}:{total},setpts=PTS-STARTPTS[tail];"
        f"[c]trim=0:{fade},setpts=PTS-STARTPTS[head];"
        f"[tail][head]xfade=transition=fade:duration={fade}:offset=0[blend];"
        f"[body][blend]concat=n=2:v=1:a=0[v]"
    )

    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        inputs = ["-i", str(src)]
        amap = []
        if has_audio:
            audio = loop_audio(src, total, fade, tmp)
            wav = tmp / "loop.f32"
            audio.astype(np.float32).tofile(wav)
            inputs += ["-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(wav)]
            amap = ["-map", "1:a"]
        base = ["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", graph, "-map", "[v]", *amap,
                "-t", f"{total - fade}"]
        run([*base, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p",
             *(["-c:a", "aac", "-b:a", "96k"] if has_audio else []),
             "-movflags", "+faststart", str(OUT_HERO / "hero.mp4")])
        run([*base, "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1",
             *(["-c:a", "libopus", "-b:a", "80k"] if has_audio else []),
             str(OUT_HERO / "hero.webm")])

    # Stills
    still_in = ["-i", str(Path(args.photo).resolve())] if args.photo else \
        ["-ss", f"{sharpest_time(src, w, h, total):.2f}", "-i", str(src), "-frames:v", "1"]
    if args.photo:
        bust = "scale=480:600:force_original_aspect_ratio=increase,crop=480:600"
    else:
        cw, ch, cx, cy = (int(v) for v in crop.split(":"))
        bw = int(cw * 0.62) // 2 * 2  # head to shirt: top ~45% of a head-to-toe crop
        bh = int(bw * 1.25) // 2 * 2
        bust = f"crop={bw}:{bh}:{cx + (cw - bw) // 2}:{cy},scale=480:600,{WHITEN}"
    png = OUT_HERO / ".bust.png"
    run(["ffmpeg", "-v", "error", "-y", *still_in, "-vf", bust, "-frames:v", "1", str(png)])
    to_webp(png, ROOT / "public" / "portrait-bust.webp")
    png.unlink()
    run(["ffmpeg", "-v", "error", "-y", *still_in, "-vf",
         f"{bust},scale=-2:630,pad=1200:630:ow-iw-80:0:color=0xf4f2ee",
         "-frames:v", "1", "-q:v", "3", str(ROOT / "public" / "og.jpg")])
    print("done:", *(p.relative_to(ROOT) for p in [OUT_HERO / "hero.mp4", OUT_HERO / "hero.webm"]))


if __name__ == "__main__":
    main()
