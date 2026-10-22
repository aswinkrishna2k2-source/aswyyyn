import { useEffect, useState, type RefObject } from 'react';

const LIGHT_LUMINANCE = 140; // lime (#cbff4c) ≈ 228, page ink (#1b1b1b) ≈ 27

/**
 * True while the element floats over a light surface (the lime sections), so floating UI can
 * switch from white to ink. Checks the first opaque background painted under the element's
 * left edge, re-checked on scroll and resize, and a few times a second because scrubbed scroll
 * animations keep easing for a moment after scrolling stops. Elements must be hit-testable to
 * count, so scroll-driven overlays that should affect this must not use pointer-events: none.
 */
export function useOnLightSurface(ref: RefObject<HTMLElement>) {
  const [onLight, setOnLight] = useState(false);

  useEffect(() => {
    let frame = 0;

    const check = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width) return; // hidden at this breakpoint
      const stack = document.elementsFromPoint(r.left + Math.min(10, r.width / 2), r.top + r.height / 2);

      let light = false;
      for (const node of stack) {
        if (el.contains(node)) continue;
        const style = getComputedStyle(node);
        const rgba = style.backgroundColor.match(/[\d.]+/g)?.map(Number);
        if (!rgba || (rgba[3] ?? 1) < 0.5 || Number(style.opacity) < 0.5) continue;
        const [red, green, blue] = rgba;
        light = 0.2126 * red + 0.7152 * green + 0.0722 * blue > LIGHT_LUMINANCE;
        break;
      }
      setOnLight(light);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    check();
    const poll = window.setInterval(() => !document.hidden && schedule(), 200);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      clearInterval(poll);
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref]);

  return onLight;
}
