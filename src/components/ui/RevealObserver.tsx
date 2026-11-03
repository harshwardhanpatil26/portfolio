"use client";

import { useEffect } from "react";

/** Adds `.is-in` to every `.rv` / `.rv-mask` the first time it scrolls into view. */
export default function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".rv, .rv-mask").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
