import { useLayoutEffect, type DependencyList, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Render every tween's starting state the moment it's created. By default GSAP defers that first
// render to a shared queue; if a ScrollTrigger refresh reverts some other animation before the queue
// flushes (common on iOS Safari during load), the flush runs in "revert" mode and strips the waiting
// state off unrelated scenes, leaving them half-animated.
gsap.defaults({ lazy: false });
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
    // Test for `reduce` rather than `no-preference`: during the first ~300ms after load, iOS Safari
    // reports `no-preference` as false even when the visitor hasn't asked for reduced motion, which
    // made scenes skip their setup and leave elements half-animated. `reduce` is only ever true when
    // they really did ask. `always` guarantees the callback runs (matchMedia only calls it when at
    // least one condition matches).
    mm.add({ always: 'all', isDesktop: '(min-width: 768px)', reduceMotion: '(prefers-reduced-motion: reduce)' }, (ctx) => {
      const { isDesktop, reduceMotion } = ctx.conditions as Record<string, boolean>;
      if (reduceMotion) return;
      return setup({ isDesktop });
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
