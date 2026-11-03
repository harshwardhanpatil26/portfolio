/* eslint-disable @next/next/no-img-element -- static SVGs, no optimisation needed */
import type { ReactNode } from "react";

// Official devicon "original" SVGs copied into public/logos (MIT, see LICENSE-devicon.txt).
// `tint` is the brand colour used for the soft glow behind the logo.
export const BRAND: Record<string, { src: string; tint: string }> = {
  Python: { src: "/logos/python.svg", tint: "#3776ab" },
  Java: { src: "/logos/java.svg", tint: "#ea2d2e" },
  C: { src: "/logos/c.svg", tint: "#659ad3" },
  HTML: { src: "/logos/html5.svg", tint: "#e44d26" },
  CSS: { src: "/logos/css3.svg", tint: "#1572b6" },
  Django: { src: "/logos/django.svg", tint: "#092e20" },
  MySQL: { src: "/logos/mysql.svg", tint: "#00618a" },
  SQLite: { src: "/logos/sqlite.svg", tint: "#0f80cc" },
  AWS: { src: "/logos/aws.svg", tint: "#f7a80d" },
  Git: { src: "/logos/git.svg", tint: "#f34f29" },
  GitHub: { src: "/logos/github.svg", tint: "#181616" },
  "VS Code": { src: "/logos/vscode.svg", tint: "#0065a9" },
  Windows: { src: "/logos/windows.svg", tint: "#0078d4" },
  Linux: { src: "/logos/linux.svg", tint: "#f0b400" },
  MacOS: { src: "/logos/apple.svg", tint: "#555555" },
};

// Thin 1.5px line icons on a 24 grid for concepts (and tools without a bundled logo).
export const CONCEPT: Record<string, ReactNode> = {
  SQL: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
      <path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </>
  ),
  DBMS: (
    <>
      <ellipse cx="9" cy="6" rx="5.5" ry="2" />
      <path d="M3.5 6v9c0 1.1 2.5 2 5.5 2M14.5 6v4M3.5 10.5c0 1.1 2.5 2 5.5 2" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.5" />
      <path d="M13 16.5h7.5M16.8 13v7.5" />
    </>
  ),
  DSA: (
    <>
      <circle cx="12" cy="4.5" r="2" />
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="12" r="2" />
      <circle cx="3.5" cy="19.5" r="2" />
      <circle cx="9" cy="19.5" r="2" />
      <path d="M10.8 6.1 7.2 10.4M13.2 6.1l3.6 4.3M5.2 13.8l-1 3.8M6.9 13.8l1.2 3.8" />
    </>
  ),
  OOP: (
    <>
      <rect x="8" y="2.5" width="8" height="6" rx="1.5" />
      <rect x="2.5" y="15.5" width="8" height="6" rx="1.5" />
      <rect x="13.5" y="15.5" width="8" height="6" rx="1.5" />
      <path d="M12 8.5v3.5M6.5 15.5V12h11v3.5" />
    </>
  ),
  Excel: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </>
  ),
  "Power BI": (
    <>
      <path d="M3 21h18" />
      <rect x="5" y="12" width="3" height="6.5" rx="1" />
      <rect x="10.5" y="7" width="3" height="11.5" rx="1" />
      <rect x="16" y="3" width="3" height="15.5" rx="1" />
    </>
  ),
  Degree: (
    <>
      <path d="m12 4 10 5-10 5L2 9l10-5Z" />
      <path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M22 9v6" />
    </>
  ),
  Projects: (
    <>
      <rect x="2.5" y="4" width="19" height="14" rx="2" />
      <path d="m9 9-2.5 2L9 13M15 9l2.5 2-2.5 2M8 21h8" />
    </>
  ),
  Certificate: (
    <>
      <rect x="2.5" y="3.5" width="19" height="13" rx="2" />
      <path d="M6.5 8h7M6.5 11.5h4.5" />
      <circle cx="17" cy="15.5" r="3" />
      <path d="m15.5 18.2-.8 3.3 2.3-1.2 2.3 1.2-.8-3.3" />
    </>
  ),
  Leadership: (
    <>
      <circle cx="12" cy="6" r="3" />
      <circle cx="4.5" cy="10" r="2.2" />
      <circle cx="19.5" cy="10" r="2.2" />
      <path d="M6.5 20.5c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6M1.5 18.5c.2-2.2 1.5-3.8 3.3-4.2M22.5 18.5c-.2-2.2-1.5-3.8-3.3-4.2" />
    </>
  ),
};

export const isBrand = (name: string) => name in BRAND;

export default function TechLogo({
  name,
  size = 24,
  className = "",
  lazy = true,
}: {
  name: string;
  size?: number;
  className?: string;
  lazy?: boolean;
}) {
  const brand = BRAND[name];
  if (brand) {
    return (
      <img
        src={brand.src}
        alt=""
        width={size}
        height={size}
        loading={lazy ? "lazy" : "eager"}
        decoding="async"
        className={className}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {CONCEPT[name] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}
