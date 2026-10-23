import { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import { experiences, type Experience } from '../../data/experience';
import { pad2 } from '../../lib/motion';
import { gsap, ScrollTrigger, useScrollScene } from '../../lib/gsap';

function RolePanel({ exp, n, current, flat }: { exp: Experience; n: number; current: boolean; flat: boolean }) {
  return (
    <article
      className={`j-panel relative flex flex-col justify-center ${
        flat ? 'w-full border-t border-white/10 pt-10' : 'w-screen shrink-0 border-l border-white/10 px-4 md:w-[46vw] md:px-14'
      }`}
    >
      <div className="relative">
        {!flat && (
          <span
            aria-hidden
            className="j-year display text-outline pointer-events-none mb-5 block select-none text-[clamp(4.25rem,22vw,9rem)] !leading-[0.8] opacity-40"
          >
            {exp.duration.slice(0, 4)}
          </span>
        )}
        <p className="j-in label flex flex-wrap items-center gap-2 text-accent">
          {pad2(n + 1)} · {exp.duration}
          {current && <span className="rounded-full bg-accent px-2 py-0.5 text-ink">Now</span>}
        </p>
        <h3 className="j-in mt-4 text-[clamp(2.1rem,8.5vw,3.6rem)] font-bold leading-[1] tracking-[-0.04em]">{exp.role}</h3>
        <p className="j-in story-serif mt-2 text-[clamp(1.6rem,6vw,2.4rem)] text-muted">at {exp.company}</p>
        <span className="j-in chip mt-5">{exp.type}</span>
        <ul className="j-in mt-6 space-y-2.5">
          {exp.contributions.map((c) => (
            <li key={c} className="flex gap-3 leading-snug text-muted md:text-lg">
              <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/** Vertical scroll drives a horizontal track: intro → each role. */
export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const roles = [...experiences].reverse(); // first job first

  useScrollScene(ref, () => {
    const scene = sceneRef.current!;
    const track = trackRef.current!;
    // Measured from the last panel's layout box: scrollWidth would also count the parallax years
    // while they're shifted sideways, and overshoot the end of the track.
    const distance = () => {
      const last = track.lastElementChild as HTMLElement;
      return Math.max(0, last.offsetLeft + last.offsetWidth - window.innerWidth);
    };
    const setHeight = () => {
      scene.style.height = `${window.innerHeight + distance()}px`;
    };
    setHeight();
    ScrollTrigger.addEventListener('refreshInit', setHeight);

    const move = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true },
    });
    gsap.fromTo(
      '.j-progress',
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: true } },
    );

    gsap.utils.toArray<HTMLElement>('.j-panel').forEach((panel, i) => {
      const year = panel.querySelector('.j-year');
      if (year) {
        // drifts in from the right and settles in line with the title as the card arrives
        gsap.fromTo(year, { xPercent: 30 }, {
          xPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: move, start: 'left right', end: 'left 60%', scrub: true },
        });
      }
      const bits = panel.querySelectorAll('.j-in');
      if (bits.length && i > 0) {
        gsap.fromTo(bits, { x: 80, opacity: 0 }, {
          x: 0,
          opacity: 1,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: panel, containerAnimation: move, start: 'left 92%', end: 'left 40%', scrub: true },
        });
      }
    });

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', setHeight);
      scene.style.height = '';
    };
  });

  return (
    <section id="experience" ref={ref} aria-labelledby="experience-title" className="grain relative bg-ink">
      <div ref={sceneRef} className="relative">
        <div className={reduce ? 'px-4 py-20 md:px-8' : 'sticky top-0 h-[100svh] overflow-hidden'}>
          <div ref={trackRef} className={reduce ? 'mx-auto flex max-w-6xl flex-col gap-16' : 'flex h-full w-max items-stretch pb-16 pt-24 md:pb-36'}>
            <div className={`j-panel flex flex-col justify-center ${reduce ? '' : 'w-screen shrink-0 px-4 md:w-[64vw] md:px-12 lg:pl-[max(3rem,calc((100vw-72rem)/2))]'}`}>
              <SectionHeading
                id="experience"
                size="compact"
                title="Where I've *worked.*"
                intro="Real products, real users, and the teams I shipped them with."
              />
              {!reduce && (
                <p className="label mt-10 flex items-center gap-3 text-muted">
                  Keep scrolling <FiArrowRight aria-hidden className="text-accent" />
                </p>
              )}
            </div>

            {roles.map((exp, i) => (
              <RolePanel key={exp.id} exp={exp} n={i} current={i === roles.length - 1} flat={reduce} />
            ))}

          </div>

          {!reduce && (
            <div className="pointer-events-none absolute inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+1.75rem)] md:inset-x-8 md:bottom-[7.5rem]">
              <div className="h-[2px] overflow-hidden rounded-full bg-white/10">
                <div className="j-progress h-full origin-left bg-accent" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
