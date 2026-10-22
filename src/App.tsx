import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SectionProvider } from './components/layout/SectionProvider';
import Intro from './components/layout/Intro';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Work from './components/sections/Work';
import Stack from './components/sections/Stack';
import Education from './components/sections/Education';
import Contact from './components/sections/Contact';
import { ScrollTrigger } from './lib/gsap';
import { scrollToTarget } from './lib/smoothScroll';

export default function App() {
  const [ready, setReady] = useState(false);
  const reveal = useCallback(() => setReady(true), []);
  const { hash } = useLocation();

  // Deep links like /#work (e.g. "All projects" from a project page) land on their section
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (!el) return;
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      scrollToTarget(el, true);
    }, 80);
    return () => clearTimeout(id);
  }, [hash]);

  // Scroll scenes measure positions once; re-measure whenever fonts, images or content change page height
  useEffect(() => {
    let timer = 0;
    const refresh = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    const observer = new ResizeObserver(refresh);
    observer.observe(document.querySelector('main')!);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', refresh);
      observer.disconnect();
    };
  }, []);

  return (
    <SectionProvider>
      <Intro onReveal={reveal} />
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero ready={ready} />
        <About />
        <Experience />
        <Work />
        <Stack />
        <Education />
        <Contact />
      </main>
      <Footer />
    </SectionProvider>
  );
}
