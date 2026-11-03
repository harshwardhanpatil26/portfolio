"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

/** Smoothly scroll to `#id` (or the top for "top"). Falls back to native scroll. */
export function scrollToTarget(id: string) {
  const el = id === "top" ? 0 : document.getElementById(id);
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.4 });
  } else {
    const y = el === 0 ? 0 : el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
  if (el !== 0) {
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let raf = requestAnimationFrame(function loop(t) {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}
