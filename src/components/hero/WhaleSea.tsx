"use client";

import { useEffect, useRef } from "react";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

// Sea strip centred in the pinned hero. Scrolling swims the whale right → left and
// the name's letters rise out of the water behind it. Partway across it breaches
// once; the breach runs on real time (gravity, not scroll position) so it always
// looks physical however fast the visitor scrolls. When the whale has crossed,
// .is-done on .hero-pin lifts the sea and reveals the hero copy.

const NAME = PROFILE.name.toUpperCase();
const SWIM_END = 0.88; // fraction of the pinned scroll spent crossing
const BREACH_AT = 0.42; // where along the crossing the whale breaches
const BREACH_MS = 3400;

// One wave period every 150 units over 2400, so the two halves match and a
// -50% translate loops seamlessly.
const wave = (amp: number, y: number) => {
  let d = `M0 ${y}`;
  for (let x = 0; x < 2400; x += 150) d += ` Q${x + 37.5} ${y - amp} ${x + 75} ${y} T${x + 150} ${y}`;
  return `${d} V80 H0 Z`;
};
const BACK = wave(5, 8);
const FRONT = wave(4, 8);

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (u: number) => u * u * (3 - 2 * u);

/**
 * Whale pose during the breach at time t ∈ [0,1].
 * y is the downward offset from the swimming position, rot is in degrees (positive =
 * nose up).
 */
function breachPose(t: number, wh: number, peak: number) {
  const depth = wh * 0.8;
  if (t < 0.16) {
    // sounds: tips forward and dives to build speed
    const e = smooth(t / 0.16);
    return { y: depth * e, rot: -14 * e };
  }
  if (t < 0.26) {
    // drives up from below, accelerating, pitching to ~65°
    const u = (t - 0.16) / 0.1;
    return { y: depth * (1 - u * u), rot: -14 + 79 * smooth(u) };
  }
  if (t < 0.68) {
    // ballistic flight: constant gravity gives a parabola. It keeps rotating back
    // past vertical, so it falls onto its back.
    const s = (t - 0.26) / 0.42;
    return { y: -peak * 4 * s * (1 - s), rot: 65 + 60 * s };
  }
  if (t < 0.78) {
    // crashes through the surface and sinks under the foam
    const u = (t - 0.68) / 0.1;
    return { y: depth * 1.9 * u, rot: 125 };
  }
  if (t < 0.86) return { y: depth * 1.9, rot: -6 }; // rights itself out of sight
  const e = smooth((t - 0.86) / 0.14); // glides back up and swims on
  return { y: depth * 1.9 * (1 - e), rot: -6 * (1 - e) };
}

export default function WhaleSea() {
  const band = useRef<HTMLDivElement>(null);
  const whale = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const splashes = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = band.current;
    const w = whale.current;
    const lay = layer.current;
    const pin = el?.closest<HTMLElement>(".hero-pin");
    if (!el || !w || !lay || !pin) return;

    if (prefersReducedMotion()) {
      letters.current.forEach((l) => l?.classList.add("is-up"));
      pin.classList.add("is-done");
      return;
    }

    let W = 0, H = 0, ww = 0, wh = 0, water = 0, bandTop = 0;
    let centers: number[] = [];
    const measure = () => {
      const r = el.getBoundingClientRect();
      W = r.width;
      H = r.height;
      bandTop = el.offsetTop - H / 2; // .sea is centred with translateY(-50%)
      ww = w.offsetWidth;
      wh = w.offsetHeight;
      water = H * 0.64; // crest line of the back wave
      // The whale layer spans hero top → sea bottom and is masked below the waterline,
      // so whatever is under water fades out with depth.
      lay.style.top = `${-bandTop}px`;
      lay.style.height = `${bandTop + H}px`;
      lay.style.setProperty("--wl", `${bandTop + water}px`);
      lay.style.setProperty("--deep", `${wh * 0.75}px`);
      centers = letters.current.map((l) => {
        if (!l) return Infinity;
        const lr = l.getBoundingClientRect();
        return lr.left - r.left + lr.width / 2;
      });
    };

    let p = 0;
    let x: number | null = null;
    let raf = 0;
    let splashIdx = 0;
    let breachStart = -1;
    let launchX = 0;
    let played = false;
    let prevT = 0;

    const splash = (cx: number, big: boolean) => {
      const sp = splashes.current[splashIdx++ % splashes.current.length];
      if (!sp) return;
      sp.style.left = `${cx}px`;
      sp.style.setProperty("--s", String(ww / 240));
      sp.classList.remove("go", "big");
      void sp.offsetWidth; // restart the CSS animation
      sp.classList.toggle("big", big);
      sp.classList.add("go");
    };

    const frame = (now: number) => {
      const r = pin.getBoundingClientRect();
      const travel = pin.offsetHeight - window.innerHeight;
      const target = travel > 0 ? clamp(-r.top / travel) : 0;
      p += (target - p) * 0.14;
      if (p > 0.9) pin.classList.add("is-done");
      else if (p < 0.82) pin.classList.remove("is-done");

      const q = clamp(p / SWIM_END);
      const gutter = Math.min(64, Math.max(18, W * 0.04));
      const startX = W - gutter - ww;
      const endX = -ww * 1.15;
      const scrollX = startX + (endX - startX) * q;
      x ??= scrollX;

      // Breach once per forward pass.
      if (breachStart < 0 && !played && q >= BREACH_AT) {
        breachStart = now;
        launchX = x;
        prevT = 0;
      }
      if (breachStart < 0 && q < BREACH_AT - 0.12) played = false;

      let y: number;
      let rot: number;
      if (breachStart >= 0) {
        const t = (now - breachStart) / BREACH_MS;
        // ~90% of the body clears the water, but the nose stays inside the hero.
        const peak = Math.min(ww * 0.45, bandTop + water + wh * 0.05 - ww * 0.5 - 12);
        ({ y, rot } = breachPose(Math.min(t, 1), wh, peak));
        if (prevT < 0.25 && t >= 0.25) splash(x + ww * 0.5, false);
        if (prevT < 0.68 && t >= 0.68) splash(x + ww * 0.5, true);
        prevT = t;
        if (t >= 1) {
          breachStart = -1;
          played = true;
        }
      } else {
        y = Math.sin(now / 700) * 3;
        rot = Math.sin(now / 950) * 1.8;
      }
      x += ((breachStart >= 0 ? launchX : scrollX) - x) * 0.1;

      w.style.transform = `translate3d(${x.toFixed(1)}px,${(bandTop + water - wh * 0.45 + y).toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg)`;
      w.classList.toggle("is-surface", breachStart < 0 && Math.abs(target - p) < 0.002);

      // Letters right of the whale's tail have been "written" by its wake.
      const tail = x + ww * 0.85;
      letters.current.forEach((l, i) => l?.classList.toggle("is-up", centers[i] > tail));

      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(frame);
    });
    measure();
    io.observe(el);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const drops = Array.from({ length: 16 }, (_, i) => (
    <i
      key={i}
      style={
        {
          "--a": `${-150 + i * 8}deg`,
          "--r": 0.55 + ((i * 37) % 10) / 12,
          "--z": `${4 + ((i * 53) % 5)}px`,
        } as React.CSSProperties
      }
    />
  ));

  return (
    <div ref={band} className="sea" aria-hidden="true">
      <style>{css}</style>
      <svg className="sea-back" viewBox="0 0 2400 80" preserveAspectRatio="none">
        <path d={BACK} />
      </svg>
      <p className="sea-name">
        {Array.from(NAME).map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              letters.current[i] = el;
            }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </p>
      <div ref={layer} className="whale-layer">
      <div ref={whale} className="whale">
        <svg viewBox="0 0 240 100">
          <path className="w-fluke" d="M204 53C213 44 222 33 238 29C232 39 228 47 230 53C228 59 232 67 238 77C222 73 213 62 204 53Z" />
          <path className="w-body" d="M12 54C12 38 38 28 76 27C118 26 156 34 186 46C196 50 204 52 210 53C204 56 196 58 186 61C156 72 116 80 76 79C38 78 12 70 12 54Z" />
          <path className="w-belly" d="M18 60C40 72 70 77 100 76C130 75 150 70 168 65C142 74 110 80 76 79C46 78 24 72 18 60Z" />
          <path className="w-grooves" d="M26 66C44 72 62 74 84 74M30 69C46 74 62 76 80 76.5M24 63C42 69 60 71 86 71" />
          <path className="w-dorsal" d="M148 37C153 31 159 28 165 29C160 32 158 36 158 41Z" />
          <path className="w-fin" d="M68 66C77 78 90 89 104 94C100 85 92 74 84 64Z" />
          <path className="w-mouth" d="M14 57C30 61 46 61 60 57" />
          <circle cx="32" cy="52" r="1.8" fill="#f4f2ee" />
        </svg>
        <span className="spout">
          <i />
          <i />
          <i />
        </span>
      </div>
      </div>
      <svg className="sea-front" viewBox="0 0 2400 80" preserveAspectRatio="none">
        <path d={FRONT} />
      </svg>
      {[0, 1].map((k) => (
        <span
          key={k}
          ref={(el) => {
            splashes.current[k] = el;
          }}
          className="splash"
        >
          <b className="column" />
          <b className="foam" />
          {drops}
        </span>
      ))}
    </div>
  );
}

const css = `
.sea{position:absolute;left:0;right:0;top:50%;height:30svh;min-height:180px;z-index:0;pointer-events:none;transform:translateY(-50%);transition:transform 1.2s var(--ease)}
.hero-pin.is-done .sea{transform:translateY(calc(-50% - 22svh))}
.sea-back,.sea-front{position:absolute;left:0;width:200%;animation:swell 18s linear infinite}
.sea-back{top:60%;height:40%;fill:#d6e7f3;-webkit-mask-image:linear-gradient(#000 40%,transparent);mask-image:linear-gradient(#000 40%,transparent)}
.sea-front{top:67%;height:33%;fill:rgba(186,214,235,.88);animation-duration:11s;-webkit-mask-image:linear-gradient(#000 30%,transparent);mask-image:linear-gradient(#000 30%,transparent)}
@keyframes swell{to{transform:translateX(-50%)}}
.sea-name{position:absolute;left:0;right:0;top:0;height:calc(64% + 4px);margin:0;display:flex;align-items:flex-end;justify-content:center;overflow:hidden;font-weight:800;letter-spacing:-.05em;line-height:.78;font-size:min(calc((100vw - 2*var(--gutter))/9.6),20svh);color:var(--ink);white-space:nowrap}
.sea-name span{display:inline-block;transform:translateY(110%);transition:transform .9s cubic-bezier(.34,1.45,.64,1)}
.sea-name span.is-up{transform:none}
.whale-layer{position:absolute;left:0;right:0;top:0;height:100%;-webkit-mask-image:linear-gradient(#000 calc(var(--wl,64%) + 4px),rgba(0,0,0,.55) calc(var(--wl,64%) + 14px),transparent calc(var(--wl,64%) + var(--deep,60px)));mask-image:linear-gradient(#000 calc(var(--wl,64%) + 4px),rgba(0,0,0,.55) calc(var(--wl,64%) + 14px),transparent calc(var(--wl,64%) + var(--deep,60px)))}
.whale{position:absolute;left:0;top:0;width:clamp(220px,30vw,460px);aspect-ratio:240/100;will-change:transform;transform:translate3d(-200%,0,0)}
.whale svg{display:block;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 10px 14px rgba(13,13,13,.14))}
.w-body{fill:#2c2c2b}.w-fluke,.w-dorsal,.w-fin{fill:#1f1f1e}.w-belly{fill:#9a9893}
.w-grooves,.w-mouth{fill:none;stroke:#6b6964;stroke-width:.9;stroke-linecap:round}
.w-mouth{stroke:#151515}
.spout{position:absolute;left:19%;top:22%;width:0;height:0}
.spout i{position:absolute;bottom:0;left:-3px;width:6px;height:70px;border-radius:6px;background:linear-gradient(transparent,rgba(150,190,220,.8));transform-origin:50% 100%;opacity:0}
.spout i:nth-child(1){transform:rotate(-14deg)}.spout i:nth-child(3){transform:rotate(14deg)}
.whale.is-surface .spout i{animation:blow 4.5s var(--ease) infinite}
.whale.is-surface .spout i:nth-child(2){animation-delay:.08s}
@keyframes blow{0%{opacity:0;scale:1 0}8%{opacity:.9;scale:1 1}30%{opacity:0;scale:1.4 1.2}100%{opacity:0}}
.splash{--s:1;--k:1;position:absolute;top:64%;width:0;height:0;z-index:3}
.splash.big{--k:2.3}
.splash i{position:absolute;left:calc(var(--z)/-2);top:calc(var(--z)/-2);width:var(--z);height:var(--z);border-radius:50%;background:#b4d3e8;opacity:0}
.splash.go i{animation:drop calc(.8s + .5s*var(--k)) cubic-bezier(.15,.75,.35,1) forwards}
@keyframes drop{0%{opacity:.95;transform:rotate(var(--a)) translateX(0)}50%{opacity:.9;transform:rotate(var(--a)) translateX(calc(var(--r)*var(--k)*var(--s)*55px))}100%{opacity:0;transform:rotate(var(--a)) translateX(calc(var(--r)*var(--k)*var(--s)*70px)) scale(.3)}}
.splash .column{position:absolute;left:calc(var(--s)*-38px);bottom:0;width:calc(var(--s)*76px);height:calc(var(--s)*var(--k)*60px);border-radius:50% 50% 10% 10%/80% 80% 10% 10%;background:linear-gradient(rgba(214,232,245,0),rgba(190,218,238,.9));transform-origin:50% 100%;opacity:0}
.splash.go .column{animation:column calc(.9s + .4s*var(--k)) cubic-bezier(.2,.8,.3,1) forwards}
@keyframes column{0%{opacity:0;transform:scale(.4,0)}25%{opacity:.95;transform:scale(1,1)}100%{opacity:0;transform:scale(1.35,.35)}}
.splash .foam{position:absolute;left:calc(var(--s)*-80px);top:-6px;width:calc(var(--s)*160px);height:14px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.95),rgba(214,232,245,0));opacity:0}
.splash.go .foam{animation:foam 2.6s ease-out forwards}
@keyframes foam{0%{opacity:0;transform:scaleX(.3)}15%{opacity:1}100%{opacity:0;transform:scaleX(calc(1.1 + .5*var(--k)))}}
@media (max-width:1024px){.sea{height:20svh;min-height:130px}.hero-pin.is-done .sea{transform:translateY(calc(-50% - 24svh))}}
@media (prefers-reduced-motion:reduce){.whale-layer{display:none}}
`;
