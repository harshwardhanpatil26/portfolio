import { existsSync } from "node:fs";
import { join } from "node:path";
import App from "@/components/App";

// Assets produced by scripts/build-hero-assets.py. Until they exist the hero and
// ID card fall back to typographic versions.
const pub = (p: string) => existsSync(join(process.cwd(), "public", p));

export default function Page() {
  return <App hasVideo={pub("hero/hero.mp4")} hasPortrait={pub("portrait-bust.webp")} />;
}
