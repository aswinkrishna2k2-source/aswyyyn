import { useRef } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { useSections } from './SectionProvider';
import { SOCIAL_ICONS } from '../ui/Links';
import Reveal from '../ui/Reveal';
import { useLocalTime } from '../../hooks/useLocalTime';
import { profile, socials } from '../../data/profile';
import { gsap, useScrollScene } from '../../lib/gsap';

export default function Footer() {
  const { goTo } = useSections();
  const { time, hour } = useLocalTime(profile.timeZone);
  const asleep = hour < 7;
  const ref = useRef<HTMLElement>(null);

  // The wordmark rises out of the floor, letter by letter, as the page runs out
  useScrollScene(ref, () => {
    gsap.fromTo(
      '.f-letter',
      { yPercent: 105, rotate: 12 },
      {
        yPercent: 0,
        rotate: 0,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current!.querySelector('.f-mark'), start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
      },
    );
  });

  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink-deep px-4 pb-32 pt-20 md:px-8 md:pt-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="story-serif text-[clamp(2.5rem,9vw,5rem)] leading-none">
            Thanks for <span className="text-accent">scrolling.</span>
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-3">
          <div>
            <p className="label text-muted">Designed & built by</p>
            <p className="mt-2 text-lg">
              {profile.name}, {profile.location}.
            </p>
          </div>
          <div>
            <p className="label text-muted">Local time</p>
            <p className="mt-2 text-lg">
              {time} in Kerala — {asleep ? "probably asleep. I'll reply when the sun's up." : 'probably shipping something.'}
            </p>
          </div>
          <div className="md:text-right">
            <button type="button" onClick={() => goTo('home')} className="btn btn-ghost">
              Back to top <FiArrowUp aria-hidden />
            </button>
          </div>
        </div>

        <p
          aria-hidden
          className="f-mark display text-outline mt-16 select-none overflow-hidden pb-[0.06em] text-center text-[clamp(4.5rem,22vw,19rem)] !leading-[0.85]"
        >
          {Array.from(profile.handle).map((ch, i) => (
            <span key={i} className="f-letter inline-block origin-bottom-left">
              {ch}
            </span>
          ))}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <p className="label text-muted">
            © {new Date().getFullYear()} {profile.handle} · Made with care
          </p>
          <div className="flex gap-1">
            {socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.key];
              return (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="grid h-11 w-11 place-items-center rounded-full text-muted transition hover:bg-white/[0.06] hover:text-accent"
                >
                  <Icon aria-hidden />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
