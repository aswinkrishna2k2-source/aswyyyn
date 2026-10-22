import { useMemo, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { getSection } from '../../data/sections';
import { parseMarked } from '../../lib/text';
import { gsap, useScrollScene } from '../../lib/gsap';

// Each entry starts on its own line; *wrapped* words get the ink highlight
const MANIFESTO = [
  'I *design* it. I *build* it. I *ship* it.',
  'Modern *web* and *mobile* experiences designed for *people* and built for *performance.*',
];

const ROLES = ['Full-stack developer', 'React Native', 'UI/UX designer', 'MERN stack'];

/**
 * Pinned on lime: the statement lights up word by word, key phrases get an ink highlighter
 * swiped behind them, then a dark curtain rises from the bottom into the next section.
 */
export default function About() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const lines = useMemo(() => MANIFESTO.map(parseMarked), []);
  const section = getSection('about');

  useScrollScene(ref, () => {
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    });

    const els = gsap.utils.toArray<HTMLElement>('.m-word');
    const step = 0.05;
    els.forEach((el, i) => {
      const at = i * step;
      tl.fromTo(el, { opacity: 0.12, y: 24, rotate: 3 }, { opacity: 1, y: 0, rotate: 0, duration: 0.3 }, at);
      const mark = el.querySelector('.m-mark');
      if (mark) {
        tl.fromTo(mark, { scaleX: 0 }, { scaleX: 1, duration: 0.18 }, at + 0.12);
        tl.fromTo(el.querySelector('.m-text'), { color: '#1b1b1b' }, { color: '#cbff4c', duration: 0.1 }, at + 0.16);
      }
    });

    const end = els.length * step + 0.35;
    tl.fromTo('.m-roles', { xPercent: 0 }, { xPercent: -40, duration: end + 0.7 }, 0)
      .to('.m-copy', { scale: 0.86, opacity: 0.25, yPercent: -8, duration: 0.55, ease: 'power1.in' }, end)
      .fromTo(
        '.m-curtain',
        { clipPath: 'circle(0% at 50% 110%)' },
        { clipPath: 'circle(160% at 50% 110%)', duration: 0.7, ease: 'power2.in' },
        end,
      );
  });

  return (
    <section
      id="about"
      ref={ref}
      aria-labelledby="about-title"
      className={`on-accent relative bg-accent text-ink ${reduce ? 'px-4 py-24 md:px-8' : 'h-[300svh]'}`}
    >
      <div className={reduce ? '' : 'sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-4 md:px-8'}>
        <div className="m-copy relative z-10 mx-auto w-full max-w-6xl origin-top">
          <p className="label flex items-center gap-3 text-ink/70">
            <span className="rounded-full bg-ink px-2.5 py-1 text-accent">{section.no}</span>
            <span aria-hidden className="h-px w-8 bg-ink/30" />
            What I do
          </p>
          <h2 id="about-title" className="mt-6 text-[clamp(1.9rem,8.2vw,5.4rem)] font-bold leading-[1.04] tracking-[-0.035em]">
            {lines.map((words, l) => (
              <span key={l} className="block">
                {words.map((w, i) => (
                  <span key={i}>
                    <span className="m-word relative inline-block isolate">
                      {w.accent ? (
                        <>
                          <span
                            aria-hidden
                            className={`m-mark absolute -inset-x-[0.14em] inset-y-[0.06em] -z-10 origin-left rounded-[0.18em] bg-ink ${reduce ? '' : 'scale-x-0'}`}
                          />
                          <span className={`m-text story-serif font-normal ${reduce ? 'text-accent' : ''}`}>{w.text}</span>
                        </>
                      ) : (
                        w.text
                      )}
                      {w.tail}
                    </span>{' '}
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>

        {!reduce && (
          <>
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] overflow-hidden md:bottom-10">
              <div className="m-roles flex w-max gap-8 whitespace-nowrap text-[clamp(2.5rem,11vw,7rem)] font-extrabold leading-none tracking-[-0.04em] text-ink/[0.09]">
                {[...ROLES, ...ROLES, ...ROLES].map((r, i) => (
                  <span key={i}>{r} ✦</span>
                ))}
              </div>
            </div>
            <div aria-hidden className="m-curtain absolute inset-0 z-20 bg-ink" style={{ clipPath: 'circle(0% at 50% 110%)' }} />
          </>
        )}
      </div>
    </section>
  );
}
