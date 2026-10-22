import { Fragment, useMemo, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Reveal from './Reveal';
import { getSection, type SectionId } from '../../data/sections';
import { parseMarked } from '../../lib/text';
import { EASE } from '../../lib/motion';

interface SectionHeadingProps {
  id: SectionId;
  /** Plain copy; wrap words in *asterisks* to set them in the accent serif */
  title: string;
  intro?: ReactNode;
  /** 'compact' for headings that sit in a narrow column beside other content */
  size?: 'full' | 'compact';
  tone?: 'dark' | 'accent';
}

const word = {
  hidden: { y: '115%', rotate: 7 },
  show: { y: '0%', rotate: 0, transition: { duration: 0.95, ease: EASE } },
};

export default function SectionHeading({ id, title, intro, size = 'full', tone = 'dark' }: SectionHeadingProps) {
  const section = getSection(id);
  const onAccent = tone === 'accent';
  const words = useMemo(() => parseMarked(title), [title]);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const drift = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <header ref={ref} className="relative isolate">
      <motion.span
        aria-hidden
        style={{ y: reduce ? 0 : drift }}
        className={`pointer-events-none absolute -top-8 right-0 -z-10 select-none text-[clamp(7rem,32vw,15rem)] font-extrabold leading-none tracking-[-0.06em] md:-top-14 ${
          onAccent ? 'text-ink/[0.07]' : 'text-white/[0.03]'
        }`}
      >
        {section.no}
      </motion.span>

      <Reveal className="flex items-center gap-3">
        <span className={`label rounded-full px-2.5 py-1 ${onAccent ? 'bg-ink text-accent' : 'bg-accent text-ink'}`}>{section.no}</span>
        <span aria-hidden className={`h-px w-8 ${onAccent ? 'bg-ink/30' : 'bg-white/20'}`} />
        <span className={`label ${onAccent ? 'text-ink/70' : 'text-muted'}`}>{section.label}</span>
      </Reveal>

      <motion.h2
        id={`${id}-title`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ staggerChildren: 0.07 }}
        className={`display mt-6 ${
          size === 'full' ? 'text-[clamp(2.6rem,10.5vw,6rem)] lg:max-w-[76%]' : 'text-[clamp(2.6rem,10.5vw,4.25rem)]'
        }`}
      >
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="-mb-[0.14em] -mr-[0.1em] inline-block overflow-hidden pb-[0.14em] pr-[0.1em] align-top">
              <motion.span variants={word} className="inline-block origin-bottom-left">
                <span className={w.accent ? `story-serif ${onAccent ? '' : 'text-accent'}` : undefined}>{w.text}</span>
                {w.tail}
              </motion.span>
            </span>{' '}
          </Fragment>
        ))}
      </motion.h2>

      {intro && (
        <Reveal delay={0.15}>
          <p className={`mt-6 max-w-xl text-lg leading-relaxed ${onAccent ? 'text-ink/75' : 'text-muted'}`}>{intro}</p>
        </Reveal>
      )}
    </header>
  );
}
