"use client";

import { useRef } from "react";
import { EDUCATION, EXPERIENCE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";

// Oldest first: school, then the degree, then the roles held during it.
const STOPS = [
  ...EDUCATION.map((e) => ({ id: e.id, when: e.when, title: e.title, place: e.place, detail: e.detail ? [e.detail] : [] })),
  ...EXPERIENCE.map((e) => ({ id: e.id, when: e.when, title: e.title, place: e.place, detail: e.points })),
];

export default function Experience() {
  const spine = useRef<HTMLSpanElement>(null);
  const stops = useRef<(HTMLLIElement | null)[]>([]);

  const list = useScrollProgress<HTMLOListElement>((_, el) => {
    const r = el.getBoundingClientRect();
    const drawn = Math.min(r.height, Math.max(0, window.innerHeight * 0.6 - r.top));
    spine.current?.style.setProperty("transform", `scaleY(${r.height ? drawn / r.height : 0})`);
    for (const s of stops.current) s?.classList.toggle("is-lit", !!s && s.offsetTop + 14 <= drawn);
  });

  return (
    <section id="experience" className="section exp" aria-labelledby="exp-title">
      <style>{css}</style>
      <div className="wrap">
        <SectionHead index="05" label="Education & experience" title="The path so" accent="far." id="exp-title" />
        <div className="path-wrap">
        <span className="path-track" aria-hidden="true">
          <span ref={spine} className="path-spine" />
        </span>
        <ol ref={list} className="path">
          {STOPS.map((s, i) => (
            <li
              key={s.id}
              ref={(el) => {
                stops.current[i] = el;
              }}
              className="stop"
            >
              <span className="dot" aria-hidden="true" />
              <p className="stop-when mono">{s.when}</p>
              <div className="stop-body">
                <h3>{s.title}</h3>
                <p className="stop-place">{s.place}</p>
                {s.detail.length > 0 && (
                  <ul>
                    {s.detail.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
          <li className="stop stop-next">
            <span className="dot" aria-hidden="true" />
            <p className="stop-when mono">Next</p>
            <div className="next-card">
              <h3>
                Your <span className="serif">team?</span>
              </h3>
            </div>
          </li>
        </ol>
        </div>
      </div>
    </section>
  );
}

const css = `
.path-wrap{position:relative;margin-top:56px;max-width:980px}
.path{list-style:none;margin:0;padding:0}
.path-track{position:absolute;left:9px;top:8px;bottom:8px;width:2px;background:var(--soft);border-radius:2px}
.path-spine{position:absolute;inset:0;background:var(--ink);transform-origin:50% 0;transform:scaleY(0);border-radius:2px}
.stop{position:relative;display:grid;grid-template-columns:200px minmax(0,1fr);gap:8px 32px;padding:0 0 48px 48px}
.dot{position:absolute;left:3px;top:6px;width:14px;height:14px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--faint);transition:box-shadow .6s var(--ease),background .6s var(--ease),transform .6s var(--ease)}
.stop-when{color:var(--mute);padding-top:4px;transition:color .6s var(--ease)}
.stop-body{transform:translateX(8px);transition:transform .9s var(--ease)}
.stop h3{color:var(--mute);transition:color .8s var(--ease)}
.stop.is-lit h3{color:var(--ink)}
.stop h3{font-size:clamp(22px,2.2vw,32px);letter-spacing:-.035em;line-height:1.1}
.stop-place{color:var(--mute);margin-top:6px}
.stop-body ul{margin:14px 0 0;padding:0 0 0 18px;color:var(--ink-2);display:grid;gap:6px;font-size:15px}
.stop.is-lit .dot{background:var(--ink);box-shadow:0 0 0 5px rgba(13,13,13,.08);transform:scale(1.1)}
.stop.is-lit .stop-when{color:var(--ink)}
.stop.is-lit .stop-body{transform:none}
.stop-next{padding-bottom:0}
.next-card{border:1.5px dashed var(--faint);border-radius:24px;padding:28px 32px;transition:border-color .8s var(--ease)}
.stop-next.is-lit .next-card{border-color:var(--ink)}
.next-card h3{font-size:clamp(32px,4vw,56px)}
.next-card .serif{color:var(--mute)}
@media (max-width:720px){
  .stop{grid-template-columns:minmax(0,1fr);padding-left:40px}
}
@media (prefers-reduced-motion:reduce){.stop-body{transform:none}}
`;
