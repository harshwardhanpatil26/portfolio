"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";
import WhaleSea from "./WhaleSea";

export default function Hero({ hasVideo }: { hasVideo: boolean }) {
  const section = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const userMuted = useRef(false);
  const visible = useRef(true);

  useEffect(() => {
    const v = video.current;
    const el = section.current;
    if (!v || !el) return;

    const play = async () => {
      if (!visible.current) return;
      try {
        v.muted = userMuted.current;
        await v.play();
        setSoundOn(!v.muted);
        setBlocked(false);
      } catch {
        // Autoplay with sound refused: fall back to muted and wait for a gesture.
        v.muted = true;
        setSoundOn(false);
        setBlocked(!userMuted.current);
        v.play().catch(() => {});
      }
    };

    const unlock = () => {
      if (userMuted.current) return;
      v.muted = false;
      if (visible.current) v.play().catch(() => {});
      setSoundOn(true);
      setBlocked(false);
      off();
    };
    const evs = ["pointerdown", "keydown", "touchend"] as const;
    const off = () => evs.forEach((t) => window.removeEventListener(t, unlock));
    evs.forEach((t) => window.addEventListener(t, unlock, { passive: true }));

    // Pause (and silence) as soon as most of the hero has scrolled away.
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.intersectionRatio >= 0.35;
        if (visible.current) play();
        else v.pause();
      },
      { threshold: [0, 0.35, 1] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      off();
    };
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    const next = !soundOn;
    userMuted.current = !next;
    v.muted = !next;
    if (v.paused) v.play().catch(() => {});
    setSoundOn(next);
    setBlocked(false);
  };

  const jump = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToTarget(id);
  };

  return (
    <section id="top" className="hero-pin" aria-labelledby="hero-title">
      <style>{css}</style>
      <div ref={section} className={`hero ${hasVideo ? "" : "no-video"}`}>
      <WhaleSea />

      {hasVideo && (
        <div className="hero-stage">
          <video
            ref={video}
            className="hero-video"
            muted
            loop
            playsInline
            preload="auto"
            aria-label={`Intro video: ${PROFILE.name} speaking to camera`}
          >
            <source src="/hero/hero.webm" type="video/webm" />
            <source src="/hero/hero.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      <div className="hero-copy">
        <p className="tag hero-in" style={{ "--d": "0ms" } as React.CSSProperties}>
          {PROFILE.name}
        </p>
        <h1 id="hero-title" className="h1">
          <span className="hero-line" style={{ "--d": "80ms" } as React.CSSProperties}>
            <span>Computer</span>
          </span>
          <span className="hero-line" style={{ "--d": "120ms" } as React.CSSProperties}>
            <span>Engineering</span>
          </span>
          <span className="hero-line" style={{ "--d": "160ms" } as React.CSSProperties}>
            <span className="serif">undergraduate.</span>
          </span>
        </h1>
        <div className="hero-ctas hero-in" style={{ "--d": "320ms" } as React.CSSProperties}>
          <a href="#work" className="btn btn-primary" onClick={(e) => jump(e, "work")}>
            Explore work
          </a>
          <a href="#contact" className="btn btn-ghost" onClick={(e) => jump(e, "contact")}>
            Let&apos;s talk
          </a>
          <a href={PROFILE.resume} download className="btn btn-ghost">
            Résumé <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <div className="hero-side hero-in" style={{ "--d": "420ms" } as React.CSSProperties}>
        <p className="mono">{PROFILE.location}</p>
        <p className="mono">B.Tech · {PROFILE.graduationYear}</p>
        {hasVideo && (
          <button
            className={`hero-sound ${blocked ? "is-blocked" : ""}`}
            onClick={toggle}
            aria-label={soundOn ? "Mute intro video" : "Play intro video with sound"}
            aria-pressed={soundOn}
          >
            {soundOn ? (
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <rect x="3" y="2" width="3.4" height="12" rx="1" fill="currentColor" />
                <rect x="9.6" y="2" width="3.4" height="12" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M4 2.2v11.6c0 .6.7 1 1.2.7l9-5.8c.5-.3.5-1 0-1.4l-9-5.8C4.7 1.2 4 1.6 4 2.2Z" fill="currentColor" />
              </svg>
            )}
          </button>
        )}
      </div>
      </div>
    </section>
  );
}

const css = `
.hero-pin{position:relative;height:190svh}
.hero{position:sticky;top:0;height:100svh;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:end;gap:24px;padding:96px var(--gutter) clamp(28px,5vh,56px);overflow:clip}
.hero-stage{grid-column:2;grid-row:1;align-self:end;justify-self:center;position:relative;z-index:1;height:min(96svh,1040px);aspect-ratio:768/960;max-width:calc(100vw - var(--gutter)*2);margin-bottom:calc(-1*clamp(28px,5vh,56px))}
.hero-video{width:100%;height:100%;object-fit:contain;object-position:bottom;mix-blend-mode:multiply;display:block;animation:rise 1.4s var(--ease) both}
@keyframes rise{from{opacity:0;transform:translateY(40px)}}
.hero-copy{grid-column:1;grid-row:1;position:relative;z-index:2;padding-bottom:8px}
.h1{font-size:clamp(30px,3.3vw,60px);margin:18px 0 28px}
.hero-line{display:block;overflow:hidden;padding-bottom:.08em}
/* Copy stays hidden until the whale has crossed (WhaleSea adds .is-done to .hero-pin) */
.hero-copy,.hero-side{visibility:hidden;transition:visibility 0s .9s}
.hero-pin.is-done .hero-copy,.hero-pin.is-done .hero-side{visibility:visible;transition-delay:0s}
.hero-line>span{display:inline-block;transform:translateY(105%);transition:transform .5s var(--ease)}
.hero-pin.is-done .hero-line>span{transform:none;transition:transform 1.1s var(--ease) var(--d)}
.hero-in{opacity:0;transform:translateY(16px);transition:opacity .4s var(--ease),transform .5s var(--ease)}
.hero-pin.is-done .hero-in{opacity:1;transform:none;transition:opacity 1s var(--ease) var(--d),transform 1.1s var(--ease) var(--d)}
.hero-ctas{display:flex;flex-wrap:wrap;gap:10px}
.hero-side{grid-column:3;grid-row:1;justify-self:end;display:flex;flex-direction:column;align-items:flex-end;gap:6px;color:var(--mute);position:relative;z-index:2;padding-bottom:8px}
.hero-sound{margin-top:14px;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;position:relative;transition:transform .5s var(--ease)}
.hero-sound:hover{transform:scale(1.06)}
.hero-sound.is-blocked::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 1.5px var(--ink);animation:ping 1.8s var(--ease) infinite}
@keyframes ping{from{transform:scale(1);opacity:.6}to{transform:scale(1.9);opacity:0}}
@media (max-width:1024px){
  .hero{grid-template-columns:minmax(0,1fr);align-items:start;gap:0;padding-top:calc(70px + max(20svh,130px))}
  .hero-stage{grid-column:1;grid-row:1;height:34svh;margin-bottom:0}
  .hero.no-video{align-content:end}
  .h1{font-size:clamp(36px,8vw,64px)}
  .h1 .hero-line{display:inline-block;margin-right:.25em}
  .hero-copy{grid-row:2;margin-top:0;text-align:left}
  .hero-side{grid-column:1;grid-row:1;align-self:end;justify-self:end;padding:0 0 10px}
  .hero-side .mono{display:none}
}
@media (max-width:1024px) and (min-width:640px){
  .hero-copy{text-align:center}.hero-ctas{justify-content:center}.hero-copy .tag{justify-content:center}
}
@media (prefers-reduced-motion:reduce){.hero-pin{height:auto}.hero{position:relative;height:auto;min-height:100svh}}
`;
