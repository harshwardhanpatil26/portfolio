import { SmoothScroll } from "@/lib/scroll";
import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Certifications from "./sections/Certifications";
import Experience from "./sections/Experience";
import Achievements from "./sections/Achievements";
import Contact from "./sections/Contact";
import RevealObserver from "./ui/RevealObserver";

export default function App({ hasVideo, hasPortrait }: { hasVideo: boolean; hasPortrait: boolean }) {
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <style>{`
        .skip{position:fixed;left:16px;top:-60px;z-index:100;background:var(--ink);color:#fff;padding:10px 16px;border-radius:999px;transition:top .3s var(--ease)}
        .skip:focus{top:16px}
      `}</style>
      <SmoothScroll />
      <RevealObserver />
      <Navigation />
      <main id="main">
        <Hero hasVideo={hasVideo} />
        <About hasPortrait={hasPortrait} />
        <Skills />
        <Work />
        <Certifications />
        <Experience />
        <Achievements />
        <Contact />
      </main>
    </>
  );
}
