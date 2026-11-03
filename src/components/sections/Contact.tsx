"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

const LINES = ["Let's build", "something together."];

function Hop({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, w) => (
        <span key={w} className="hop-word" aria-hidden="true">
          {w > 0 && " "}
          {Array.from(word).map((ch, i) => (
            <span
              key={i}
              className="hop"
              onPointerEnter={(e) => {
                const el = e.currentTarget;
                el.classList.remove("is-hop");
                void el.offsetWidth; // restart the animation
                el.classList.add("is-hop");
              }}
              onAnimationEnd={(e) => e.currentTarget.classList.remove("is-hop")}
            >
              {ch}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <style>{css}</style>
      <div className="wrap">
        <p className="tag rv">07 — Contact</p>
        <h2 className="contact-h" id="contact-title" aria-label={LINES.join(" ")}>
          <span className="rv-mask">
            <span>
              <Hop text={LINES[0]} />
            </span>
          </span>
          <span className="rv-mask serif" style={{ "--i": 1 } as React.CSSProperties}>
            <span>
              <Hop text={LINES[1]} />
            </span>
          </span>
        </h2>

        <div className="contact-row">
          <div className="contact-main rv">
            <div className="mail-line">
              <a href={`mailto:${PROFILE.email}`} className="mail">
                {PROFILE.email}
              </a>
              <button className="copy" onClick={copy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>
            <ul className="contact-links">
              <li>
                <span className="mono">Phone</span>
                <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
              </li>
              {PROFILE.github && (
                <li>
                  <span className="mono">GitHub</span>
                  <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                    {PROFILE.github.replace(/^https?:\/\/(www\.)?/, "")} ↗
                  </a>
                </li>
              )}
              {PROFILE.linkedin && (
                <li>
                  <span className="mono">LinkedIn</span>
                  <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
                    {PROFILE.linkedin.replace(/^https?:\/\/(www\.)?/, "")} ↗
                  </a>
                </li>
              )}
              <li>
                <span className="mono">Based in</span>
                <span>{PROFILE.location}</span>
              </li>
            </ul>
          </div>

          <a href={`mailto:${PROFILE.email}`} className="badge">
            <span className="sr-only">Say hello by email</span>
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text>
                <textPath href="#badge-circle" textLength="486" lengthAdjust="spacing">say hello · say hello · say hello · </textPath>
              </text>
            </svg>
            <span className="badge-core" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>

      <footer className="wrap foot">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
        <p className="mono">Built with Next.js</p>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget("top");
          }}
        >
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}

const css = `
.contact{padding-bottom:32px}
.contact-h{font-size:clamp(46px,9.4vw,152px);letter-spacing:-.055em;line-height:.95;margin-top:24px}
.contact-h .serif{color:var(--mute);font-weight:400}
.hop-word{white-space:nowrap}
.hop{display:inline-block}
.hop.is-hop{animation:hop .6s var(--ease)}
@keyframes hop{0%{transform:none}35%{transform:translateY(-.16em)}65%{transform:translateY(.03em)}100%{transform:none}}
.contact-row{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;margin-top:clamp(40px,8vh,88px)}
.contact-main{min-width:0;flex:1}
.mail-line{display:flex;align-items:center;flex-wrap:wrap;gap:14px}
.mail{font-size:clamp(22px,3.4vw,48px);font-weight:600;letter-spacing:-.035em;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.18em;text-decoration-color:var(--faint);overflow-wrap:anywhere;transition:text-decoration-color .4s var(--ease)}
.mail:hover{text-decoration-color:var(--ink)}
.copy{height:34px;padding:0 14px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);transition:background .4s var(--ease),color .4s var(--ease)}
.copy:hover{background:var(--ink);color:#fff}
.contact-links{list-style:none;margin:32px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0 32px;max-width:900px}
.contact-links li{display:grid;gap:2px;padding:14px 0;border-top:1px solid var(--line);min-width:0}
.contact-links .mono{color:var(--mute);font-size:11px}
.contact-links a,.contact-links span:not(.mono){font-weight:500;overflow-wrap:anywhere}
.contact-links a:hover{text-decoration:underline;text-underline-offset:3px}
.badge{flex:none;position:relative;width:150px;height:150px;border-radius:50%;display:grid;place-items:center}
.badge svg{position:absolute;inset:0;width:100%;height:100%;animation:spin 18s linear infinite}
.badge text{font-family:var(--font-mono);font-size:15.5px;letter-spacing:.2em;text-transform:uppercase;fill:var(--ink)}
.badge-core{width:58px;height:58px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:22px;transition:transform .6s var(--ease)}
.badge:hover .badge-core{transform:rotate(45deg) scale(1.08)}
@keyframes spin{to{transform:rotate(360deg)}}
.foot{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-top:clamp(64px,12vh,128px);padding-top:24px;border-top:1px solid var(--line);color:var(--mute);font-size:14px}
.foot a{color:var(--ink);font-weight:500}
.foot a:hover{text-decoration:underline;text-underline-offset:3px}
@media (max-width:720px){
  .contact-row{flex-direction:column;align-items:flex-start}
  .badge{width:120px;height:120px;align-self:flex-end}
}
`;
