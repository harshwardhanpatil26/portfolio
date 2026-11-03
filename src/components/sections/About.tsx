"use client";

/* eslint-disable @next/next/no-img-element -- pre-sized local webp */
import { useEffect, useRef, useState } from "react";
import { EDUCATION, EXPERIENCE, PROFILE, PROJECTS, CERTIFICATIONS } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

const degree = EDUCATION[EDUCATION.length - 1];

// Deterministic barcode widths from the name.
const BARS = Array.from(PROFILE.name + PROFILE.emailHandle).map((c) => 1 + (c.charCodeAt(0) % 3));

export default function About({ hasPortrait }: { hasPortrait: boolean }) {
  const section = useRef<HTMLElement>(null);
  const swing = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const lastPointer = useRef<string>("mouse");

  // Damped pendulum: pointer velocity kicks the card, a spring pulls it back
  // towards a slow idle sway.
  useEffect(() => {
    const el = section.current;
    const s = swing.current;
    if (!el || !s || prefersReducedMotion()) return;
    let angle = 0;
    let vel = 0;
    let lastX: number | null = null;
    let raf = 0;
    let prev = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(3, (now - prev) / 16.67);
      prev = now;
      const target = Math.sin(now / 1400) * 1.4;
      vel += (-(angle - target) * 0.018 - vel * 0.055) * dt;
      angle += vel * dt;
      s.style.transform = `rotate(${angle.toFixed(3)}deg)`;
      raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      if (lastX !== null) vel += Math.max(-1.2, Math.min(1.2, (e.clientX - lastX) * 0.03));
      lastX = e.clientX;
    };
    const onLeave = () => (lastX = null);

    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(el);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section ref={section} id="about" className="section about" aria-labelledby="about-title">
      <style>{css}</style>
      <div className="wrap about-grid">
        <div className="about-left">
          <p className="tag rv">01 — About</p>
          <h2 className="h2" id="about-title">
            <span className="rv-mask">
              <span>
                Hi, I&apos;m <span className="serif">{PROFILE.firstName}.</span>
              </span>
            </span>
          </h2>
          <p className="about-summary rv" style={{ "--i": 1 } as React.CSSProperties}>
            {PROFILE.resumeSummary}
          </p>
          <p className="about-extra rv" style={{ "--i": 2 } as React.CSSProperties}>
            {PROFILE.softSkills.join(" · ")}
          </p>
          <div className="about-btns rv" style={{ "--i": 3 } as React.CSSProperties}>
            <a href={PROFILE.resume} download className="btn btn-primary">
              Résumé <span aria-hidden="true">↓</span>
            </a>
            {PROFILE.github && (
              <a href={PROFILE.github} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            )}
            {PROFILE.linkedin && (
              <a href={PROFILE.linkedin} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>

        <div className="about-mid">
          <div ref={swing} className="lanyard">
            <span className="strap" aria-hidden="true">
              <span className="strap-run">
                <span>
                  {PROFILE.name} · {PROFILE.role} ·{" "}
                </span>
                <span>
                  {PROFILE.name} · {PROFILE.role} ·{" "}
                </span>
              </span>
            </span>
            <span className="clasp" aria-hidden="true" />
            <span className="ring" aria-hidden="true" />
            <div
              className={`idcard ${flipped ? "is-flipped" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={flipped}
              aria-describedby="idcard-hint"
              onPointerDown={(e) => (lastPointer.current = e.pointerType)}
              onPointerEnter={(e) => e.pointerType === "mouse" && setFlipped(true)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setFlipped(false)}
              onClick={() => lastPointer.current !== "mouse" && setFlipped((f) => !f)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFlipped((f) => !f);
                }
              }}
            >
              <span id="idcard-hint" className="sr-only">
                ID card. Press Enter or Space to flip to the {flipped ? "front" : "back"}.
              </span>
              <div className="idcard-inner">
                <div className="face front" aria-hidden={flipped}>
                  <div className="band mono">Developer ID</div>
                  <div className="portrait">
                    {hasPortrait ? (
                      <img src="/portrait-bust.webp" alt={`Portrait of ${PROFILE.name}`} width={128} height={156} />
                    ) : (
                      <span className="portrait-ini serif" role="img" aria-label={`${PROFILE.name} initials`}>
                        {PROFILE.initials}
                      </span>
                    )}
                  </div>
                  <p className="id-name">{PROFILE.name}</p>
                  <p className="id-role">{PROFILE.role}</p>
                  <dl className="id-rows">
                    <div>
                      <dt>ID No.</dt>
                      <dd>{PROFILE.emailHandle}</dd>
                    </div>
                    <div>
                      <dt>Dept.</dt>
                      <dd>Computer Engg.</dd>
                    </div>
                    <div>
                      <dt>Valid till</dt>
                      <dd>{PROFILE.graduationYear}</dd>
                    </div>
                  </dl>
                  <div className="id-foot">
                    <span className="barcode" aria-hidden="true">
                      {BARS.map((w, i) => (
                        <i key={i} style={{ width: w }} />
                      ))}
                    </span>
                    <span className="holo" aria-hidden="true" />
                  </div>
                </div>
                <div className="face back" aria-hidden={!flipped}>
                  <p className="mono back-k">What I am</p>
                  <ul>
                    <li>{PROFILE.role}</li>
                    <li>
                      B.Tech Computer Engineering · {degree.detail}
                    </li>
                    <li>Projects: {PROJECTS.map((p) => p.short).join(", ")}</li>
                    <li>{EXPERIENCE[0].title}, {EXPERIENCE[0].place}</li>
                    <li>{CERTIFICATIONS.length} certifications: Cisco, Infosys Springboard, IIT Bombay</li>
                  </ul>
                  <div className="sign">
                    <span className="serif">{PROFILE.name}</span>
                  </div>
                  <p className="found mono">If found, say hello · {PROFILE.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-right">
          <p className="mono facts-k rv">Quick facts</p>
          <dl className="facts">
            {[
              ["Location", PROFILE.location],
              ["Education", `${degree.title}, ${degree.when}`],
              ["Role", `${EXPERIENCE[0].title}, ${EXPERIENCE[0].place}`],
              ["Email", PROFILE.email],
            ].map(([k, v], i) => (
              <div key={k} className="rv" style={{ "--i": i } as React.CSSProperties}>
                <dt className="mono">{k}</dt>
                <dd>{k === "Email" ? <a href={`mailto:${v}`}>{v}</a> : v}</dd>
              </div>
            ))}
          </dl>
          <blockquote className="quote rv" style={{ "--i": 4 } as React.CSSProperties}>
            <span className="serif">“</span>Building software engineering skills through projects, research and
            internships — and getting the work done accurately, on time.
          </blockquote>
        </div>
      </div>
    </section>
  );
}

const css = `
.about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,4vw,64px);align-items:stretch}
.about-left,.about-right{display:flex;flex-direction:column}
.about-summary{margin-top:28px;font-size:clamp(17px,1.35vw,20px);line-height:1.5;color:var(--ink-2)}
.about-extra{margin-top:16px;color:var(--mute);font-size:14px}
.about-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:auto;padding-top:32px}
.about-mid{position:relative;margin-top:calc(-1*var(--section-y));display:flex;justify-content:center;min-height:560px}
.lanyard{display:flex;flex-direction:column;align-items:center;transform-origin:50% 0;will-change:transform}
/* Woven ribbon from the top of the section, swivel clasp, split ring through the card's slot */
.strap{--strap-h:calc(var(--section-y) + 72px);width:30px;height:var(--strap-h);background:var(--ink);overflow:hidden;position:relative;border-radius:0 0 3px 3px;box-shadow:inset 3px 0 0 -2px rgba(255,255,255,.14),inset -3px 0 0 -2px rgba(255,255,255,.14),0 6px 14px -6px rgba(13,13,13,.4);-webkit-mask-image:linear-gradient(transparent,#000 48px);mask-image:linear-gradient(transparent,#000 48px)}
.strap::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,.08),transparent 35%,transparent 65%,rgba(0,0,0,.25))}
.strap-run{display:flex;flex-direction:column;writing-mode:vertical-rl;margin:0 auto;color:rgba(255,255,255,.78);font-family:var(--font-mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;line-height:30px;white-space:nowrap;animation:strap 16s linear infinite}
@keyframes strap{from{transform:translateY(-50%)}to{transform:none}}
.clasp{width:20px;height:30px;margin-top:-4px;border-radius:5px 5px 10px 10px;background:linear-gradient(90deg,#8f8d88,#f1efea 42%,#a19f9a 68%,#d6d4cf);box-shadow:inset 0 0 0 1px rgba(0,0,0,.2),0 3px 6px -2px rgba(13,13,13,.35);position:relative;z-index:1}
.clasp::before{content:"";position:absolute;left:4px;right:4px;top:6px;height:3px;border-radius:2px;background:rgba(0,0,0,.22)}
.ring{width:18px;height:18px;margin:-6px 0 -10px;border-radius:50%;border:2.5px solid #a3a19c;box-shadow:inset 0 0 0 1px rgba(255,255,255,.5);position:relative;z-index:2}
.idcard{width:300px;height:404px;perspective:1400px;cursor:pointer;border-radius:22px}
.idcard-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 1s var(--ease)}
.idcard.is-flipped .idcard-inner{transform:rotateY(180deg)}
.face{position:absolute;inset:0;border-radius:22px;background:var(--card);box-shadow:var(--hair),var(--lift);backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;display:flex;flex-direction:column;align-items:center}
.face.back{transform:rotateY(180deg);align-items:stretch;padding:30px 24px 20px}
.face.back::before{content:"";position:absolute;left:50%;top:8px;width:38px;height:7px;transform:translateX(-50%);border-radius:4px;background:var(--paper);box-shadow:inset 0 1px 2px rgba(0,0,0,.3)}
.band{width:100%;background:var(--ink);color:#fff;text-align:center;padding:22px 0 10px;font-size:11px;letter-spacing:.24em;position:relative}
.band::before{content:"";position:absolute;left:50%;top:8px;width:38px;height:7px;transform:translateX(-50%);border-radius:4px;background:var(--paper);box-shadow:inset 0 1px 2px rgba(0,0,0,.35)}
.portrait{margin-top:20px;width:128px;height:156px;border-radius:18px;padding:3px;background:linear-gradient(160deg,#d8d5cf,#8f8c86 55%,#e6e3dd);box-shadow:0 0 0 8px rgba(13,13,13,.035),0 18px 40px -18px rgba(13,13,13,.45);overflow:hidden}
.portrait img,.portrait-ini{width:100%;height:100%;border-radius:15px;object-fit:cover;display:grid;place-items:center;background:var(--soft);transition:transform .8s var(--ease)}
.portrait-ini{font-size:58px;color:var(--ink-2)}
.idcard:hover .portrait img,.idcard:hover .portrait-ini{transform:scale(1.06)}
.id-name{margin-top:14px;font-weight:700;font-size:20px;letter-spacing:-.03em}
.id-role{font-size:12px;color:var(--mute)}
.id-rows{margin:12px 0 0;width:100%;padding:0 26px;font-size:12px}
.id-rows div{display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid var(--line)}
.id-rows dt{color:var(--mute);font-family:var(--font-mono);font-size:10.5px;text-transform:uppercase;letter-spacing:.06em}
.id-rows dd{margin:0;font-weight:600}
.id-foot{margin-top:auto;width:100%;padding:0 26px 18px;display:flex;align-items:flex-end;justify-content:space-between}
.barcode{display:flex;gap:2px;height:26px}
.barcode i{display:block;height:100%;background:var(--ink)}
.holo{width:34px;height:34px;border-radius:50%;background:conic-gradient(from 0deg,#f2f2f2,#9c9c9c,#e5e5e5,#6f6f6f,#f7f7f7,#b8b8b8,#f2f2f2);box-shadow:inset 0 0 0 1px rgba(0,0,0,.08);animation:holo 6s linear infinite}
@keyframes holo{to{transform:rotate(360deg)}}
.back-k{color:var(--mute)}
.back ul{list-style:none;padding:0;margin:14px 0 0;display:grid;gap:10px;font-size:14px;line-height:1.35}
.back li{padding-left:16px;position:relative}
.back li::before{content:"";position:absolute;left:0;top:.5em;width:6px;height:6px;border-radius:50%;background:var(--ink)}
.sign{margin-top:auto;border-bottom:1px solid var(--ink);padding-bottom:2px}
.sign .serif{font-size:30px}
.found{margin-top:10px;color:var(--mute);font-size:9.5px;overflow-wrap:anywhere}
.facts-k{color:var(--mute)}
.facts{margin:16px 0 0}
.facts div{padding:16px 0;border-top:1px solid var(--line);display:grid;gap:4px}
.facts dt{color:var(--mute);font-size:11px}
.facts dd{margin:0;font-weight:500;overflow-wrap:anywhere}
.facts a{text-decoration:underline;text-underline-offset:3px;text-decoration-color:var(--faint)}
.quote{margin:auto 0 0;padding-top:28px;font-size:clamp(20px,1.7vw,26px);line-height:1.25;letter-spacing:-.02em;font-weight:500}
.quote .serif{font-size:1.6em;line-height:0;vertical-align:-.3em;margin-right:4px;color:var(--mute)}
@media (max-width:1100px){
  .about-grid{grid-template-columns:minmax(0,1fr) 320px}
  .about-right{grid-column:1/-1}
}
@media (max-width:720px){
  .about-grid{grid-template-columns:minmax(0,1fr)}
  .about-mid{grid-row:2;margin-top:0;min-height:0;padding-top:8px}
  .about-right{grid-row:3}
  .strap{--strap-h:84px}
  .about-btns{margin-top:0}
}
`;
