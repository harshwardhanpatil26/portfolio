"use client";

import { useState } from "react";
import { SKILL_GROUPS, projectsUsing } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";
import TechLogo, { BRAND, isBrand } from "../ui/TechLogo";

const TILES = SKILL_GROUPS.flatMap((g) => g.skills.map((s) => ({ ...s, family: g.family }))).map((t, i) => ({
  ...t,
  n: i + 1,
}));
const FAMILIES = SKILL_GROUPS.map((g) => g.family);

export default function Skills() {
  const [active, setActive] = useState(TILES[0]);
  const [family, setFamily] = useState<string | null>(null);
  const [gridRef, inView] = useInView<HTMLUListElement>({ rootMargin: "0px 0px -15% 0px" });
  const used = projectsUsing(active.name);
  const tint = BRAND[active.name]?.tint ?? "#0d0d0d";

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <style>{css}</style>
      <div className="wrap">
        <SectionHead index="02" label="Skills" title="The periodic table of my" accent="stack." id="skills-title" />

        <div className="chips rv" role="group" aria-label="Filter by family">
          <button className="chip" aria-pressed={family === null} onClick={() => setFamily(null)}>
            All <span className="mono">{TILES.length}</span>
          </button>
          {FAMILIES.map((f) => (
            <button key={f} className="chip" aria-pressed={family === f} onClick={() => setFamily(family === f ? null : f)}>
              {f}
            </button>
          ))}
        </div>

        <div className="ptable">
          <ul ref={gridRef} className={`pgrid ${inView ? "is-in" : ""}`}>
            {TILES.map((t, i) => {
              const dim = family !== null && t.family !== family;
              return (
                <li
                  key={t.name}
                  style={
                    {
                      "--d8": `${(Math.floor(i / 8) + (i % 8)) * 40}ms`,
                      "--d4": `${(Math.floor(i / 4) + (i % 4)) * 40}ms`,
                    } as React.CSSProperties
                  }
                >
                  <button
                    className={`el ${dim ? "is-dim" : ""} ${active.name === t.name ? "is-active" : ""}`}
                    onMouseEnter={() => setActive(t)}
                    onFocus={() => setActive(t)}
                    onClick={() => setActive(t)}
                    aria-label={`${t.name}, ${t.family}`}
                  >
                    <span className="el-n mono">{t.n}</span>
                    <span className="el-sym">{t.symbol}</span>
                    <span className="el-name">{t.name}</span>
                    <span className="el-fam mono">{t.family}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <aside className="inspector card" aria-live="polite" aria-label="Selected skill">
            <div className="insp-top mono">
              <span>No. {String(active.n).padStart(2, "0")}</span>
              <span>{active.symbol}</span>
            </div>
            <div className="insp-logo" key={active.name} style={{ "--tint": tint } as React.CSSProperties}>
              <TechLogo name={active.name} size={isBrand(active.name) ? 150 : 120} />
            </div>
            <p className="insp-name">{active.name}</p>
            <p className="insp-fam mono">{active.family}</p>
            <div className="insp-used">
              <p className="mono">Used in</p>
              {used.length ? (
                <ul>
                  {used.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              ) : (
                <p className="insp-none">Listed under Technical Skills</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const css = `
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:40px 0 28px}
.chip{height:38px;padding:0 16px;border-radius:999px;font-size:14px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.16);display:inline-flex;align-items:center;gap:8px;transition:background .4s var(--ease),color .4s var(--ease)}
.chip:hover{background:var(--soft)}
.chip[aria-pressed=true]{background:var(--ink);color:#fff;box-shadow:none}
.chip .mono{font-size:10px;opacity:.6}
.ptable{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:24px;align-items:start}
.pgrid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px}
.pgrid li{opacity:0;transform:translateY(18px) scale(.96);transition:opacity .7s var(--ease),transform .9s var(--ease);transition-delay:var(--d8)}
.pgrid.is-in li{opacity:1;transform:none}
.el{width:100%;aspect-ratio:1/1.08;border-radius:14px;background:var(--card);box-shadow:var(--hair);padding:9px 10px;display:flex;flex-direction:column;text-align:left;position:relative;transition:transform .5s var(--ease),box-shadow .5s var(--ease),opacity .5s var(--ease),background .4s var(--ease),color .4s var(--ease)}
.el:hover,.el:focus-visible{transform:translateY(-4px);box-shadow:var(--hair),var(--lift)}
.el.is-active{background:var(--ink);color:#fff}
.el.is-active .el-n,.el.is-active .el-fam{color:rgba(255,255,255,.6)}
.el.is-dim{opacity:.22}
.el-n{font-size:10px;color:var(--mute)}
.el-sym{font-weight:700;font-size:clamp(22px,2.4vw,34px);letter-spacing:-.04em;line-height:1;margin-top:auto}
.el-name{font-size:12px;font-weight:500;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.el-fam{font-size:8.5px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.inspector{position:sticky;top:96px;padding:22px;display:flex;flex-direction:column;align-items:center;text-align:center;min-height:440px}
.insp-top{width:100%;display:flex;justify-content:space-between;color:var(--mute);font-size:11px}
.insp-logo{width:190px;height:190px;display:grid;place-items:center;margin:18px 0 10px;position:relative;animation:pop .7s var(--ease) both}
.insp-logo::before{content:"";position:absolute;inset:14%;border-radius:50%;background:var(--tint);opacity:.13;filter:blur(30px)}
.insp-logo>*{position:relative}
@keyframes pop{0%{opacity:0;transform:scale(.7)}60%{transform:scale(1.04)}100%{opacity:1;transform:none}}
.insp-name{font-weight:700;font-size:28px;letter-spacing:-.04em}
.insp-fam{color:var(--mute);margin-top:4px}
.insp-used{margin-top:auto;width:100%;text-align:left;border-top:1px solid var(--line);padding-top:14px}
.insp-used .mono{color:var(--mute);font-size:10.5px}
.insp-used ul{list-style:none;padding:0;margin:8px 0 0;display:grid;gap:4px;font-size:14px;font-weight:500}
.insp-none{margin-top:8px;font-size:14px;color:var(--ink-2)}
@media (max-width:1100px){.ptable{grid-template-columns:minmax(0,1fr) 280px}.pgrid{grid-template-columns:repeat(6,minmax(0,1fr))}}
@media (max-width:860px){
  .ptable{grid-template-columns:minmax(0,1fr)}
  .pgrid{grid-template-columns:repeat(4,minmax(0,1fr))}
  .pgrid li{transition-delay:var(--d4)}
  .inspector{position:relative;top:0;min-height:0}
}
`;
