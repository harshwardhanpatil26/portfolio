"use client";

import { useState } from "react";
import { PROJECTS, type Project } from "@/lib/data";
import SectionHead from "../ui/SectionHead";
import TechLogo from "../ui/TechLogo";

export default function Work() {
  const [open, setOpen] = useState(PROJECTS[0].id);

  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <style>{css}</style>
      <div className="wrap">
        <SectionHead index="03" label="Selected work" title="Things I've" accent="built." id="work-title" />
        <p className="work-count mono rv">{PROJECTS.length} projects from the résumé · hover or tap to open</p>

        <ul className="acc rv">
          {PROJECTS.map((p) => {
            const isOpen = open === p.id;
            return (
              <li
                key={p.id}
                className={`panel card ${isOpen ? "is-open" : ""}`}
                onMouseEnter={() => setOpen(p.id)}
                onFocusCapture={() => setOpen(p.id)}
              >
                <h3 className="sr-only" id={`p-${p.id}`}>
                  {p.title}
                </h3>
                <button
                  className="spine"
                  aria-expanded={isOpen}
                  aria-controls={`pb-${p.id}`}
                  aria-labelledby={`p-${p.id}`}
                  onClick={() => setOpen(p.id)}
                >
                  <span className="mono">{p.index}</span>
                  <span className="spine-title">{p.short}</span>
                  <span className="plus" aria-hidden="true">
                    +
                  </span>
                </button>
                <div className="body" id={`pb-${p.id}`} hidden={!isOpen}>
                  <div className="body-text">
                    <p className="mono kicker">
                      {p.index} — {p.kicker}
                    </p>
                    <p className="title" aria-hidden="true">
                      {p.title}
                    </p>
                    <p className="desc">{p.description}</p>
                    <ul className="feats">
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <ul className="techs" aria-label="Technologies">
                      {p.tech.map((t) => (
                        <li key={t}>
                          <TechLogo name={t} size={16} />
                          {t}
                        </li>
                      ))}
                    </ul>
                    {p.github && (
                      <a href={p.github} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                        View on GitHub <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                  <figure className="mini">
                    <MiniUI p={p} />
                    <figcaption className="mono">Illustrative UI</figcaption>
                  </figure>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Grayscale CSS sketches hinting at each project. Not screenshots. */
function MiniUI({ p }: { p: Project }) {
  switch (p.id) {
    case "food-waste":
      return (
        <div className="ui" aria-hidden="true">
          <div className="ui-bar">
            <i />
            <span>Food listings</span>
            <b>Sign in</b>
          </div>
          {["Veg thali × 12", "Bread loaves × 30", "Rice & dal × 8"].map((t, i) => (
            <div className="ui-row" key={t}>
              <span className="ui-thumb" />
              <span className="ui-lines">
                <em>{t}</em>
                <s style={{ width: `${60 - i * 12}%` }} />
              </span>
              <span className={`ui-pill ${i === 1 ? "dark" : ""}`}>{i === 1 ? "Claimed" : "Available"}</span>
            </div>
          ))}
          <div className="ui-btn">+ Add listing</div>
        </div>
      );
    case "image-processing":
      return (
        <div className="ui ui-flow" aria-hidden="true">
          {["Upload", "S3 bucket", "EC2 worker", "S3 output"].map((t, i) => (
            <div key={t} className="ui-node" style={{ "--n": i } as React.CSSProperties}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              {t}
            </div>
          ))}
          <div className="ui-iam mono">IAM policy · least privilege</div>
        </div>
      );
    case "quiz":
      return (
        <div className="ui" aria-hidden="true">
          <div className="ui-bar">
            <span>Question 3 / 10</span>
            <b>Score 2</b>
          </div>
          <div className="ui-q">Which keyword creates an object in Java?</div>
          {["class", "new", "static", "this"].map((o) => (
            <div key={o} className={`ui-opt ${o === "new" ? "sel" : ""}`}>
              <span />
              {o}
            </div>
          ))}
          <div className="ui-progress">
            <i />
          </div>
        </div>
      );
    default:
      return (
        <div className="ui" aria-hidden="true">
          <div className="ui-bar">
            <span>Sales dashboard</span>
            <b>Filter</b>
          </div>
          <div className="ui-kpis">
            {["Orders", "Customers", "Categories"].map((k) => (
              <div key={k}>
                <s />
                <span>{k}</span>
              </div>
            ))}
          </div>
          <div className="ui-chart">
            {[38, 52, 46, 70, 64, 82, 58, 90].map((h, i) => (
              <i key={i} style={{ height: `${h}%`, "--n": i } as React.CSSProperties} />
            ))}
          </div>
        </div>
      );
  }
}

const css = `
.work-count{color:var(--mute);margin-top:18px}
.acc{list-style:none;margin:40px 0 0;padding:0;display:flex;gap:10px;height:min(78svh,600px)}
.panel{flex:1;min-width:0;position:relative;overflow:hidden;transition:flex 1s var(--ease),box-shadow .6s var(--ease)}
.panel.is-open{flex:8;box-shadow:var(--hair),var(--lift)}
.spine{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;border-radius:inherit;transition:opacity .4s var(--ease)}
.panel.is-open .spine{opacity:0;pointer-events:none}
.spine:focus-visible{outline-offset:-4px}
.spine-title{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600;letter-spacing:-.02em;font-size:17px;white-space:nowrap}
.plus{width:34px;height:34px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);display:grid;place-items:center;font-size:18px;transition:transform .6s var(--ease),background .4s var(--ease),color .4s var(--ease)}
.spine:hover .plus{transform:rotate(90deg);background:var(--ink);color:#fff}
.body{position:absolute;inset:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(20px,3vw,48px);padding:clamp(24px,3vw,44px);min-width:640px}
.body[hidden]{display:none}
.body-text{display:flex;flex-direction:column;animation:fade .8s .15s var(--ease) both}
.kicker{color:var(--mute)}
.title{font-weight:700;font-size:clamp(26px,2.6vw,40px);letter-spacing:-.04em;line-height:1.02;margin-top:14px}
.desc{margin-top:16px;color:var(--ink-2)}
.feats{list-style:none;padding:0;margin:20px 0 0;display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13.5px;color:var(--ink-2)}
.feats li{border-top:1px solid var(--line);padding-top:10px}
.techs{list-style:none;padding:0;margin:auto 0 0;display:flex;flex-wrap:wrap;gap:6px;padding-top:20px}
.techs li{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px 0 8px;border-radius:999px;background:var(--paper);font-size:12.5px;font-weight:500}
.body-text .btn{margin-top:16px;align-self:flex-start}
.mini{margin:0;position:relative;border-radius:20px;background:var(--paper);overflow:hidden;display:flex;flex-direction:column;justify-content:center;padding:clamp(16px,2vw,28px);animation:wipe 1.1s .2s var(--ease) both}
@keyframes wipe{from{clip-path:inset(0 0 0 100%)}to{clip-path:inset(0 0 0 0)}}
@keyframes fade{from{opacity:0;transform:translateY(12px)}}
.mini figcaption{position:absolute;top:12px;right:14px;font-size:9.5px;color:var(--faint)}
.ui{background:#fff;border-radius:14px;box-shadow:var(--hair),0 20px 40px -24px rgba(13,13,13,.3);padding:14px;display:grid;gap:9px;font-size:12px}
.ui-bar{display:flex;align-items:center;gap:8px;font-weight:600;padding-bottom:8px;border-bottom:1px solid var(--line)}
.ui-bar i{width:10px;height:10px;border-radius:3px;background:var(--ink)}
.ui-bar b{margin-left:auto;font-weight:500;font-size:11px;padding:3px 10px;border-radius:999px;background:var(--soft)}
.ui-row{display:flex;align-items:center;gap:10px}
.ui-thumb{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#ddd,#bdbdbd)}
.ui-lines{flex:1;display:grid;gap:5px;min-width:0}
.ui-lines em{font-style:normal;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ui-lines s{display:block;height:5px;border-radius:3px;background:var(--soft)}
.ui-pill{font-size:10px;padding:3px 8px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line)}
.ui-pill.dark{background:var(--ink);color:#fff}
.ui-btn{justify-self:start;background:var(--ink);color:#fff;border-radius:999px;padding:6px 12px;font-size:11px}
.ui-flow{grid-template-columns:repeat(4,minmax(0,1fr));align-items:center;padding:22px 14px;gap:14px}
.ui-node{position:relative;display:grid;gap:4px;padding:12px 8px;border-radius:12px;box-shadow:inset 0 0 0 1px var(--line);text-align:center;font-weight:600;font-size:11px;animation:fade .7s var(--ease) both;animation-delay:calc(.3s + var(--n)*.12s)}
.ui-node .mono{font-size:9px;color:var(--mute)}
.ui-node:not(:last-of-type)::after{content:"";position:absolute;right:-12px;top:50%;width:10px;height:1px;background:var(--ink)}
.ui-iam{grid-column:1/-1;text-align:center;color:var(--mute);font-size:9.5px;border-top:1px dashed var(--line);padding-top:10px}
.ui-q{font-weight:600;font-size:14px;line-height:1.3;padding:4px 0}
.ui-opt{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;box-shadow:inset 0 0 0 1px var(--line);font-family:var(--font-mono)}
.ui-opt span{width:12px;height:12px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--faint)}
.ui-opt.sel{background:var(--ink);color:#fff}
.ui-opt.sel span{box-shadow:inset 0 0 0 3.5px #fff}
.ui-progress{height:5px;border-radius:3px;background:var(--soft)}
.ui-progress i{display:block;height:100%;width:30%;border-radius:3px;background:var(--ink)}
.ui-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.ui-kpis div{border-radius:10px;box-shadow:inset 0 0 0 1px var(--line);padding:10px;display:grid;gap:6px;font-size:10px;color:var(--mute)}
.ui-kpis s{display:block;height:12px;width:70%;border-radius:3px;background:var(--ink-2)}
.ui-chart{height:110px;display:flex;align-items:flex-end;gap:7px;padding-top:6px;border-bottom:1px solid var(--line)}
.ui-chart i{flex:1;border-radius:5px 5px 0 0;background:linear-gradient(#5a5a5a,#bdbdbd);transform-origin:bottom;animation:grow .9s var(--ease) both;animation-delay:calc(.35s + var(--n)*.05s)}
@keyframes grow{from{transform:scaleY(0)}}
@media (max-width:860px){
  .acc{flex-direction:column;height:auto}
  .panel{flex:none}
  .spine{position:relative;flex-direction:row;padding:20px 22px;justify-content:flex-start;gap:16px;width:100%}
  .spine-title{writing-mode:horizontal-tb;transform:none;white-space:normal;text-align:left;flex:1}
  .panel.is-open .spine{display:none}
  .body{position:relative;min-width:0;grid-template-columns:minmax(0,1fr);padding:24px 20px}
  .feats{grid-template-columns:1fr}
  .ui-flow{grid-template-columns:repeat(2,minmax(0,1fr))}
  .ui-node:nth-of-type(2)::after{display:none}
}
`;
