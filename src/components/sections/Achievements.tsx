"use client";

import { useEffect, useRef } from "react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import TechLogo from "../ui/TechLogo";

const fmt = (a: Achievement, v: number) => v.toFixed(a.decimals);

export default function Achievements() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const nums = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const sec = section.current;
    const tr = track.current;
    if (!sec || !tr) return;
    const reduced = prefersReducedMotion();
    const counted = new Set<number>();
    let travel = 0;
    let raf = 0;

    const countUp = (i: number) => {
      counted.add(i);
      const a = ACHIEVEMENTS[i];
      const el = nums.current[i];
      if (!el) return;
      if (reduced) return void (el.textContent = fmt(a, a.value));
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / 1400);
        el.textContent = fmt(a, a.value * (1 - Math.pow(1 - t, 4)));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const measure = () => {
      travel = Math.max(0, tr.scrollWidth - window.innerWidth);
      sec.style.height = `calc(100svh + ${travel}px)`;
      update();
    };

    const update = () => {
      raf = 0;
      const r = sec.getBoundingClientRect();
      const p = travel ? Math.min(1, Math.max(0, -r.top / travel)) : 0;
      tr.style.transform = `translate3d(${-p * travel}px,0,0)`;
      bar.current?.style.setProperty("transform", `scaleX(${p})`);
      const mid = window.innerWidth / 2;
      let best = -1;
      let bestD = Infinity;
      cards.current.forEach((c, i) => {
        if (!c) return;
        const cr = c.getBoundingClientRect();
        const d = Math.abs(cr.left + cr.width / 2 - mid);
        if (d < bestD) [best, bestD] = [i, d];
        const visible = cr.left < window.innerWidth * 0.92 && cr.right > 0 && r.top < window.innerHeight * 0.6;
        if (visible && !counted.has(i) && i < ACHIEVEMENTS.length) countUp(i);
      });
      cards.current.forEach((c, i) => c?.classList.toggle("is-near", i === best));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    measure();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const total = String(ACHIEVEMENTS.length).padStart(2, "0");

  return (
    <section ref={section} id="achievements" className="ach" aria-labelledby="ach-title">
      <style>{css}</style>
      <div className="ach-pin">
        <div className="wrap ach-head">
          <div>
            <p className="tag">06 — Achievements</p>
            <h2 className="h2" id="ach-title">
              By the <span className="serif">numbers.</span>
            </h2>
          </div>
          <span className="ach-bar" aria-hidden="true">
            <span ref={bar} />
          </span>
        </div>
        <ul ref={track} className="ach-track">
          {ACHIEVEMENTS.map((a, i) => (
            <li
              key={a.id}
              ref={(el) => {
                cards.current[i] = el;
              }}
              className="ach-card"
            >
              <div className="ach-top">
                <span className="ach-logo">
                  <TechLogo name={a.icon} size={34} />
                </span>
                <span className="mono ach-idx">
                  {String(i + 1).padStart(2, "0")} / {total}
                </span>
              </div>
              <div className="ach-bottom">
                <div className="ach-text">
                  <p className="ach-label">{a.label}</p>
                  <p className="ach-cap">{a.caption}</p>
                  <p className="ach-detail mono">{a.detail}</p>
                </div>
                <p className="ach-num">
                  <span className="sr-only">
                    {fmt(a, a.value)}
                    {a.suffix}
                  </span>
                  <span
                    ref={(el) => {
                      nums.current[i] = el;
                    }}
                    aria-hidden="true"
                  >
                    {fmt(a, 0)}
                  </span>
                  {a.suffix && (
                    <small aria-hidden="true" className="serif">
                      {a.suffix}
                    </small>
                  )}
                </p>
              </div>
            </li>
          ))}
          <li className="ach-end" aria-hidden="true">
            and <span className="serif">counting →</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

const css = `
.ach{position:relative;height:100svh}
.ach-pin{position:sticky;top:0;height:100svh;overflow:hidden;display:flex;flex-direction:column;justify-content:center;gap:clamp(28px,6vh,64px)}
.ach-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.ach-bar{width:min(240px,30vw);height:2px;background:var(--soft);border-radius:2px;overflow:hidden;margin-bottom:12px;flex:none}
.ach-bar span{display:block;height:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(0)}
.ach-track{list-style:none;margin:0;padding:24px max(var(--gutter),calc((100vw - 1320px)/2)) 40px;display:flex;gap:clamp(16px,2vw,28px);width:max-content;will-change:transform}
.ach-card{width:clamp(340px,40vw,540px);height:clamp(260px,36vh,310px);flex:none;background:var(--card);border-radius:28px;box-shadow:var(--hair);padding:clamp(20px,2vw,28px);display:flex;flex-direction:column;justify-content:space-between;transition:transform .7s var(--ease),box-shadow .7s var(--ease)}
.ach-card.is-near{transform:translateY(-12px);box-shadow:var(--hair),0 40px 70px -34px rgba(13,13,13,.32)}
.ach-top{display:flex;justify-content:space-between;align-items:flex-start}
.ach-logo{width:72px;height:72px;border-radius:20px;display:grid;place-items:center;background:var(--paper);color:var(--ink);box-shadow:0 0 0 0 rgba(13,13,13,0);transition:box-shadow .7s var(--ease)}
.ach-card.is-near .ach-logo{box-shadow:0 12px 36px -8px rgba(13,13,13,.22)}
.ach-idx{color:var(--mute)}
.ach-bottom{display:flex;align-items:flex-end;justify-content:space-between;gap:16px}
.ach-text{min-width:0}
.ach-label{font-weight:700;font-size:20px;letter-spacing:-.03em}
.ach-cap{color:var(--ink-2);font-size:14px;margin-top:4px}
.ach-detail{color:var(--mute);font-size:10px;margin-top:8px;text-transform:none;letter-spacing:0;line-height:1.5}
.ach-num{font-weight:700;font-size:clamp(72px,8vw,120px);letter-spacing:-.06em;line-height:.8;font-variant-numeric:tabular-nums;display:flex;align-items:flex-end;flex:none}
.ach-num small{font-size:.26em;letter-spacing:0;color:var(--mute);margin-left:4px;line-height:1}
.ach-end{flex:none;align-self:center;font-weight:700;font-size:clamp(32px,4vw,56px);letter-spacing:-.045em;padding:0 8vw 0 24px;white-space:nowrap}
.ach-end .serif{color:var(--mute)}
@media (max-width:560px){
  .ach-card{width:82vw;height:300px}
  .ach-bottom{flex-direction:column-reverse;align-items:flex-start}
}
`;
