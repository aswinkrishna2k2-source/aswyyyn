import { Fragment, useRef } from 'react';
import { FiArrowUp, FiArrowUpRight } from 'react-icons/fi';
import { useSections } from './SectionProvider';
import { SOCIAL_ICONS } from '../ui/Links';
import { profile, socials } from '../../data/profile';
import { gsap, useScrollScene } from '../../lib/gsap';

const SIGN_OFF = [
  { text: 'Thanks', accent: false },
  { text: 'for', accent: false },
  { text: 'scrolling.', accent: true },
];

export default function Footer() {
  const { goTo } = useSections();
  const ref = useRef<HTMLElement>(null);

  // As the footer arrives, the sign-off's letters drift up out of a blur one by one, then a
  // hand-drawn lime underline draws itself under "scrolling."
  useScrollScene(ref, () => {
    gsap
      .timeline({ scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'top 30%', scrub: 0.6 } })
      .fromTo(
        '.f-char',
        { yPercent: 70, opacity: 0, filter: 'blur(10px)' },
        { yPercent: 0, opacity: 1, filter: 'blur(0px)', ease: 'power3.out', stagger: 0.035, duration: 0.5 },
      )
      .fromTo('.f-swash', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'power2.inOut', duration: 0.45 }, '-=0.15');
  });

  return (
    <footer ref={ref} className="relative bg-ink-deep px-4 pb-[calc(env(safe-area-inset-bottom)+2rem)] pt-20 md:px-8 md:pb-32 md:pt-28">
      <div className="mx-auto max-w-6xl">
        {/* sign-off */}
        <div className="flex items-end justify-between gap-6">
          <p className="story-serif text-[clamp(2.75rem,10vw,5.5rem)] leading-[0.95]" aria-label="Thanks for scrolling.">
            {SIGN_OFF.map((word, w) => (
              <Fragment key={w}>
                <span aria-hidden className={`relative inline-block whitespace-nowrap ${word.accent ? 'text-accent' : ''}`}>
                  {Array.from(word.text).map((ch, i) => (
                    <span key={i} className="f-char inline-block will-change-transform">
                      {ch}
                    </span>
                  ))}
                  {word.accent && (
                    <svg
                      aria-hidden
                      viewBox="0 0 300 24"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute -bottom-[0.18em] left-[2%] h-[0.28em] w-[96%] overflow-visible"
                    >
                      <path
                        className="f-swash"
                        d="M4 16 C 70 4, 150 3, 210 9 S 280 18, 296 7"
                        pathLength={1}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeDasharray={1}
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  )}
                </span>{' '}
              </Fragment>
            ))}
          </p>
          <button
            type="button"
            onClick={() => goTo('home')}
            aria-label="Back to top"
            className="group grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent text-ink transition-transform duration-300 ease-story hover:-translate-y-1 md:h-16 md:w-16"
          >
            <FiArrowUp size={22} aria-hidden className="transition-transform duration-300 ease-story group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* contact + socials */}
        <div className="mt-14 flex flex-wrap items-end justify-between gap-8 border-t border-white/[0.08] pt-8 md:mt-20">
          <div>
            <p className="label mb-3 text-muted">Say hello</p>
            <a href={`mailto:${profile.email}`} aria-label="Email Aswin" className="group inline-flex items-center gap-3">
              <span className="text-[clamp(2rem,7vw,3.25rem)] font-bold leading-none tracking-[-0.04em] transition-colors group-hover:text-accent">
                aswin.mail
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 transition duration-300 ease-story group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                <FiArrowUpRight size={18} aria-hidden />
              </span>
            </a>
          </div>

          <div className="flex gap-2">
            {socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.key];
              return (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-muted transition hover:border-accent hover:text-accent"
                >
                  <Icon size={18} aria-hidden />
                </a>
              );
            })}
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-10 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="label text-muted">
            © {new Date().getFullYear()} {profile.handle}
            <span className="text-accent">.</span>
          </p>
          <p className="label text-muted/70">
            Designed & built by {profile.handle}
            <span className="text-accent">.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
