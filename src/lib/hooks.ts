"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True once (or while, if `once` is false) the element intersects the viewport. */
export function useInView<T extends Element>(
  options: IntersectionObserverInit & { once?: boolean } = {},
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const { once = true, root, rootMargin, threshold } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting && once) io.disconnect();
      },
      { root, rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, root, rootMargin, threshold]);
  return [ref, inView];
}

/**
 * Calls `onProgress` (rAF-throttled) with how far the element has travelled
 * through the viewport: 0 when its top meets `start` (fraction of viewport
 * height), 1 when its bottom meets `end`.
 */
export function useScrollProgress<T extends HTMLElement>(
  onProgress: (p: number, el: T) => void,
  start = 0.8,
  end = 0.5,
) {
  const ref = useRef<T>(null);
  const cb = useRef(onProgress);
  cb.current = onProgress;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh * (start - end);
      const p = Math.min(1, Math.max(0, (vh * start - r.top) / total));
      cb.current(p, el);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [start, end]);
  return ref;
}
