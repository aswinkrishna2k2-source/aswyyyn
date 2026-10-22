import { useEffect, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { EASE } from '../../lib/motion';

export function Monogram({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M14 52V32a18 18 0 0 1 36 0v20z" fill="currentColor" />
      <circle cx="46" cy="16" r="5" fill="currentColor" />
    </svg>
  );
}

const WORDS = ['whoami', 'aswyyyn'] as const;
const LONGEST = WORDS.reduce((a, b) => (b.length > a.length ? b : a));

interface LogoProps {
  href: string;
  /** 'tile': monogram tile + mono wordmark. 'plain': bold "/whoami" wordmark. */
  variant?: 'tile' | 'plain';
  /** 'plain' only: 'ink' for sitting directly on the lime sections */
  tone?: 'light' | 'ink';
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * The wordmark reads `whoami` and rolls over to `aswyyyn` on hover or keyboard focus.
 * Touch screens can't hover, so there it flips back and forth by itself.
 */
export default function Logo({ href, onClick, variant = 'tile', tone = 'light' }: LogoProps) {
  const [hover, setHover] = useState(false);
  const [tick, setTick] = useState(false);
  const canHover = useMediaQuery('(hover: hover)');
  const reduce = useReducedMotion();
  const plain = variant === 'plain';

  useEffect(() => {
    if (canHover || reduce) return;
    const id = setInterval(() => setTick((t) => !t), 3200);
    return () => clearInterval(id);
  }, [canHover, reduce]);

  const word = WORDS[(canHover ? hover : tick) ? 1 : 0];
  const suffix = plain ? null : <span className="animate-blink text-accent">_</span>;

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      aria-label="Aswin Krishnan — home"
      className={`group flex items-center ${plain ? 'h-11' : 'h-10 gap-2.5'}`}
    >
      {plain ? (
        <span
          aria-hidden
          className={`text-[21px] font-bold leading-none tracking-[-0.04em] transition-colors duration-300 ${tone === 'ink' ? 'text-ink' : 'text-accent'}`}
        >
          /
        </span>
      ) : (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-ink-raised shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <Monogram className="h-5 w-5 text-accent transition-transform duration-500 ease-story group-hover:rotate-[-8deg]" />
        </span>
      )}

      {/* An invisible copy of the longest word sizes the box, so it fits whichever font is in use */}
      <span
        aria-hidden
        className={`relative block overflow-hidden ${
          plain
            ? `text-[21px] font-bold leading-[1.5] tracking-[-0.04em] transition-colors duration-300 ${tone === 'ink' ? 'text-ink' : 'text-white'}`
            : 'font-mono text-[15px] font-semibold leading-6'
        }`}
      >
        <span className="invisible whitespace-nowrap">
          {LONGEST}
          {suffix}
        </span>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={word}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute left-0 top-0 whitespace-nowrap"
          >
            {word}
            {suffix}
          </motion.span>
        </AnimatePresence>
      </span>
    </a>
  );
}
