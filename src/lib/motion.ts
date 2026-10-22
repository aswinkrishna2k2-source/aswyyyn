/** Shared easing — a long, soft settle that reads as "turning a page" rather than snapping. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Props for a one-off entrance animation on mount (hero, detail page headers). */
export function enter(delay = 0, y = 20) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  };
}

export function pad2(n: number) {
  return String(n).padStart(2, '0');
}
