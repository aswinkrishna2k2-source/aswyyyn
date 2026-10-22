import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

/** Inertial wheel scrolling (touch stays native) driven by GSAP's ticker so scrubbed scenes stay in sync. */
export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  lenis = new Lenis({ lerp: 0.09 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function scrollToTarget(target: HTMLElement | number, immediate = false) {
  if (lenis) {
    lenis.resize(); // page height may have just changed (route change, scenes sizing themselves)
    lenis.scrollTo(target, { immediate, force: true, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = immediate || reduce ? 'auto' : 'smooth';
  if (typeof target === 'number') window.scrollTo({ top: target, behavior });
  else target.scrollIntoView({ block: 'start', behavior });
}
