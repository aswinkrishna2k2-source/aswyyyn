import { useLayoutEffect, type DependencyList, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

interface SceneConditions {
  isDesktop: boolean;
}

/**
 * Builds a scroll-driven scene scoped to `scope`. Selector strings inside `setup` only match
 * within the scope, everything GSAP creates is reverted on unmount / breakpoint change, and
 * nothing runs when the reader prefers reduced motion (components render a static layout instead).
 */
export function useScrollScene(
  scope: RefObject<HTMLElement>,
  setup: (conditions: SceneConditions) => void | (() => void),
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    if (!scope.current) return;
    const mm = gsap.matchMedia(scope.current);
    mm.add({ isDesktop: '(min-width: 768px)', motionOk: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
      const { isDesktop, motionOk } = ctx.conditions as Record<string, boolean>;
      if (!motionOk) return;
      return setup({ isDesktop });
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
