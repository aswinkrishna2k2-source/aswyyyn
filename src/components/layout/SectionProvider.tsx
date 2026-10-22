import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { sections, type SectionId } from '../../data/sections';
import { scrollToTarget } from '../../lib/smoothScroll';

interface SectionState {
  /** Section currently under the middle of the viewport */
  active: SectionId;
  goTo: (id: SectionId) => void;
}

const SectionContext = createContext<SectionState | null>(null);

export function SectionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SectionId>(sections[0].id);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.5;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current: SectionId = sections[0].id;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= line) current = section.id;
      }
      setActive(atBottom ? sections[sections.length - 1].id : current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const goTo = useCallback((id: SectionId) => {
    const el = document.getElementById(id);
    if (!el) return;
    const isHome = id === sections[0].id;
    scrollToTarget(isHome ? 0 : el);
    history.replaceState(null, '', isHome ? window.location.pathname : `#${id}`);
  }, []);

  const value = useMemo(() => ({ active, goTo }), [active, goTo]);

  return <SectionContext.Provider value={value}>{children}</SectionContext.Provider>;
}

export function useSections() {
  const ctx = useContext(SectionContext);
  if (!ctx) throw new Error('useSections must be used inside <SectionProvider>');
  return ctx;
}
