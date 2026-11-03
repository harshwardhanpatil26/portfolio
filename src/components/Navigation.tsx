"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { getLenis, scrollToTarget } from "@/lib/scroll";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const links = useRef<Record<string, HTMLAnchorElement | null>>({});
  const menuBtn = useRef<HTMLButtonElement>(null);

  // Scroll state + top progress bar
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty("transform", `scaleX(${max > 0 ? y / max : 0})`);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  // Active section
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ["top", ...NAV.map((n) => n.id), "certifications"]) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  // Sliding indicator under the active link
  useLayoutEffect(() => {
    const place = () => {
      const a = active ? links.current[active] : null;
      setPill(a ? { x: a.offsetLeft, w: a.offsetWidth } : null);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active, scrolled]);

  // Mobile menu: lock scroll, Esc to close
  useEffect(() => {
    if (!open) return;
    const btn = menuBtn.current;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    // let the overlay release scroll lock first
    requestAnimationFrame(() => scrollToTarget(id));
  };

  return (
    <>
      <style>{css}</style>
      <div className="nav-progress" aria-hidden="true">
        <div ref={bar} />
      </div>
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <a href="#top" className="nav-brand" onClick={(e) => go(e, "top")}>
          <span className="nav-mark">{PROFILE.initials}</span>
          <span className="nav-name">{PROFILE.name}</span>
        </a>
        <nav aria-label="Primary" className="nav-pill">
          {pill && <span className="nav-ind" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} />}
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              ref={(el) => {
                links.current[n.id] = el;
              }}
              aria-current={active === n.id ? "true" : undefined}
              className={active === n.id ? "on" : ""}
              onClick={(e) => go(e, n.id)}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <button
          ref={menuBtn}
          className="nav-menu-btn"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </header>

      <div
        id="menu"
        className={`menu ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
      >
        <div className="menu-top">
          <span className="mono">{PROFILE.name}</span>
          <button className="nav-menu-btn is-close" onClick={() => setOpen(false)} autoFocus>
            Close
          </button>
        </div>
        <nav aria-label="Mobile">
          <ol>
            {NAV.map((n, i) => (
              <li key={n.id} style={{ "--i": i } as React.CSSProperties}>
                <a href={`#${n.id}`} onClick={(e) => go(e, n.id)}>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <a className="menu-mail" href={`mailto:${PROFILE.email}`}>
          {PROFILE.email}
        </a>
      </div>
    </>
  );
}

const css = `
.nav-progress{position:fixed;inset:0 0 auto;height:2px;z-index:60;pointer-events:none}
.nav-progress>div{height:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(0)}
.nav{position:fixed;top:14px;left:var(--gutter);right:var(--gutter);z-index:50;display:flex;align-items:center;justify-content:space-between;gap:16px;pointer-events:none}
.nav>*{pointer-events:auto}
.nav-brand{display:flex;align-items:center;gap:12px;border-radius:999px}
.nav-mark{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:14px;letter-spacing:-.04em;box-shadow:inset 0 0 0 1.5px var(--ink);background:rgba(244,242,238,.6);transition:background .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
.nav-brand:hover .nav-mark{transform:rotate(360deg)}
.nav.is-scrolled .nav-mark{background:var(--ink);color:#fff}
.nav-name{font-weight:600;letter-spacing:-.02em;transition:opacity .5s var(--ease),transform .5s var(--ease)}
.nav.is-scrolled .nav-name{opacity:0;transform:translateX(-8px);pointer-events:none}
.nav-pill{position:relative;display:flex;gap:2px;padding:5px;border-radius:999px;transition:background .5s var(--ease),box-shadow .5s var(--ease)}
.nav.is-scrolled .nav-pill,.nav.is-scrolled .nav-menu-btn{background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:var(--hair),0 10px 30px -18px rgba(13,13,13,.3)}
.nav-pill a{position:relative;z-index:1;padding:9px 16px;border-radius:999px;font-size:14px;font-weight:500;color:var(--ink-2);transition:color .4s var(--ease)}
.nav-pill a:hover{color:var(--ink)}
.nav-pill a.on{color:#fff}
.nav-ind{position:absolute;left:0;top:5px;bottom:5px;border-radius:999px;background:var(--ink);transition:transform .6s var(--ease),width .6s var(--ease)}
.nav-menu-btn{display:none;height:44px;padding:0 20px;border-radius:999px;font-weight:500;font-size:14px;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);background:rgba(244,242,238,.7)}
@media (max-width:900px){
  .nav-pill{display:none}
  .nav-menu-btn{display:inline-flex;align-items:center}
}
.menu{position:fixed;inset:0;z-index:70;background:var(--paper);display:flex;flex-direction:column;padding:14px var(--gutter) 32px;clip-path:circle(0 at calc(100% - 50px) 36px);transition:clip-path .8s var(--ease)}
.menu.is-open{clip-path:circle(150% at calc(100% - 50px) 36px)}
.menu[hidden]{display:flex;visibility:hidden}
.menu-top{display:flex;justify-content:space-between;align-items:center;min-height:44px;color:var(--mute)}
.menu .nav-menu-btn.is-close{display:inline-flex;align-items:center;background:var(--ink);color:#fff;box-shadow:none}
.menu ol{list-style:none;margin:auto 0;padding:0}
.menu li{overflow:hidden;border-bottom:1px solid var(--line)}
.menu li a{display:flex;align-items:baseline;gap:16px;padding:14px 0;font-size:clamp(36px,11vw,64px);font-weight:700;letter-spacing:-.045em;line-height:1.05;transform:translateY(105%);transition:transform .8s var(--ease);transition-delay:calc(var(--i)*60ms + 150ms)}
.menu li a .mono{color:var(--mute)}
.menu.is-open li a{transform:none}
.menu-mail{color:var(--mute);text-decoration:underline;text-underline-offset:4px;overflow-wrap:anywhere}
`;
