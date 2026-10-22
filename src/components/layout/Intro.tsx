import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion';
import { getLenis } from '../../lib/smoothScroll';

const SEEN_KEY = '_intro';

function alreadySeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

/** Opening curtain: a quick 000→100 count, then the panel wipes up to reveal the hero. Once per session. */
export default function Intro({ onReveal }: { onReveal: () => void }) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(() => !reduce && !alreadySeen());
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible) {
      onReveal();
      return;
    }
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* private mode — the intro just plays again next time */
    }
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    getLenis()?.stop();

    const controls = animate(0, 100, {
      duration: 1.4,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        if (countRef.current) countRef.current.textContent = String(Math.round(v)).padStart(3, '0');
        if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
      },
      onComplete: () => {
        setVisible(false);
        onReveal();
      },
    });

    return () => {
      controls.stop();
      root.style.overflow = '';
      getLenis()?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          aria-hidden
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[150] flex flex-col justify-between bg-ink-deep px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-[calc(env(safe-area-inset-top)+1.5rem)] md:px-10 md:pb-10 md:pt-10"
        >
          <div className="label flex justify-between text-muted">
            <span>Aswin Krishnan</span>
            <span>Portfolio · {new Date().getFullYear()}</span>
          </div>
          <div>
            <div className="flex items-end justify-between gap-4">
              <p className="display text-[clamp(3.5rem,16vw,10rem)]">
                aswin<span className="text-accent">.</span>
              </p>
              <span ref={countRef} className="display text-[clamp(2rem,9vw,5rem)] tabular-nums text-accent">
                000
              </span>
            </div>
            <span className="mt-6 block h-[3px] overflow-hidden rounded-full bg-white/10">
              <span ref={barRef} className="block h-full origin-left scale-x-0 bg-accent" />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
