import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { IconType } from 'react-icons';
import { FiArrowUpRight, FiDownload } from 'react-icons/fi';
import {
  LuBriefcaseBusiness,
  LuCodeXml,
  LuGraduationCap,
  LuHouse,
  LuInbox,
  LuLayoutGrid,
  LuUserRound,
} from 'react-icons/lu';
import { useSections } from './SectionProvider';
import Dialog from '../ui/Dialog';
import Logo from '../ui/Logo';
import { ResumeLink, SOCIAL_ICONS } from '../ui/Links';
import { navSections, sections, type SectionId } from '../../data/sections';
import { profile, socials } from '../../data/profile';
import { useOnLightSurface } from '../../hooks/useOnLightSurface';
import { EASE } from '../../lib/motion';

/*
 * Two navigation layouts:
 *   phones (<768px)   — transparent bar: wordmark left, white Menu pill right (frosts once you scroll),
 *                       opening a full-screen menu
 *   tablet & desktop  — just the wordmark at the top left (no bar), and an icon dock at the bottom
 */

// ── Phones ───────────────────────────────────────────────────────────────────

/** The small white pill used for Menu / Close; the button around it keeps a 44px tap target. */
function PillButton({ label, ...rest }: { label: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className="group -mr-1 flex h-11 items-center px-1" {...rest}>
      <span className="flex h-8 items-center rounded-full bg-white px-4 text-[14px] font-medium text-ink transition group-active:scale-95 [@media(hover:hover)]:group-hover:bg-accent">
        {label}
      </span>
    </button>
  );
}

/** Full-screen menu: big links that stagger in, contact details below. */
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { active, goTo } = useSections();

  const jump = (id: SectionId) => {
    onClose();
    // let the menu release the scroll lock before we scroll
    setTimeout(() => goTo(id), 30);
  };

  const rise = (i: number) => ({
    initial: { opacity: 0, y: 36 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE, delay: 0.06 + i * 0.05 },
  });

  return (
    <Dialog open={open} onClose={onClose} labelledBy="menu-title" variant="fullscreen">
      <div className="flex min-h-full flex-col bg-ink px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-[env(safe-area-inset-top)]">
        <div className="flex h-16 w-full items-center justify-between">
          <h2 id="menu-title" className="sr-only">
            Menu
          </h2>
          <Logo variant="plain" href="#home" onClick={(e) => { e.preventDefault(); jump('home'); }} />
          <PillButton label="Close" onClick={onClose} data-autofocus aria-label="Close menu" />
        </div>

        <nav aria-label="Sections" className="mt-6 w-full">
          <ol>
            {navSections.map((s, i) => {
              const isActive = s.id === active;
              return (
                <motion.li key={s.id} {...rise(i)} className="border-b border-white/[0.07]">
                  <button
                    type="button"
                    onClick={() => jump(s.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className="group flex w-full items-center gap-4 py-3 text-left"
                  >
                    <span className={`label w-6 shrink-0 ${isActive ? 'text-accent' : 'text-muted'}`}>{s.no}</span>
                    <span
                      className={`display flex-1 text-[clamp(2.4rem,11.5vw,4.5rem)] transition-colors ${
                        isActive ? 'text-accent' : 'text-fg group-hover:text-accent'
                      }`}
                    >
                      {s.label}
                    </span>
                    <FiArrowUpRight aria-hidden className="shrink-0 text-xl text-muted transition group-hover:rotate-45 group-hover:text-accent" />
                  </button>
                </motion.li>
              );
            })}
          </ol>
        </nav>

        <motion.div {...rise(navSections.length)} className="mt-auto w-full pt-10">
          <a href={`mailto:${profile.email}`} className="block break-all text-lg font-semibold underline decoration-white/20 underline-offset-4 hover:decoration-accent">
            {profile.email}
          </a>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <ResumeLink className="btn btn-primary">
              <FiDownload aria-hidden /> Resume
            </ResumeLink>
            {socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.key];
              return (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="grid h-12 w-12 place-items-center rounded-full border border-white/15 transition hover:border-accent hover:text-accent"
                >
                  <Icon aria-hidden />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </Dialog>
  );
}

function MobileNav() {
  const { goTo } = useSections();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Transparent at the very top (as designed); a dark frosted strip fades in once content scrolls underneath
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="md:hidden">
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled ? 'border-white/[0.06] bg-ink/75 backdrop-blur-xl' : 'border-transparent bg-transparent'
        }`}
      >
        <nav aria-label="Primary" className="flex h-16 items-center justify-between px-5">
          <Logo
            variant="plain"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              goTo('home');
            }}
          />
          <PillButton label="Menu" onClick={() => setMenuOpen(true)} aria-haspopup="dialog" aria-expanded={menuOpen} />
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

// ── Tablet & desktop ─────────────────────────────────────────────────────────

const ICONS: Record<SectionId, IconType> = {
  home: LuHouse,
  about: LuUserRound,
  experience: LuBriefcaseBusiness,
  work: LuLayoutGrid,
  stack: LuCodeXml,
  education: LuGraduationCap,
  contact: LuInbox,
};

function Tooltip({ label }: { label: string }) {
  return (
    <motion.span
      aria-hidden
      initial={{ opacity: 0, y: 6, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95, transition: { duration: 0.12 } }}
      transition={{ duration: 0.22, ease: EASE }}
      className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-ink-raised px-4 py-2 text-sm font-medium text-fg shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]"
    >
      {label}
    </motion.span>
  );
}

/**
 * Bottom dock: one round icon per section; the current section stretches into a wide lime pill.
 * Mouse and keyboard users get a tooltip on hover/focus; a tap on a touch screen flashes it briefly.
 */
function Dock() {
  const { active, goTo } = useSections();
  const [hovered, setHovered] = useState<SectionId | null>(null);
  const [flashed, setFlashed] = useState<SectionId | null>(null);
  const flashTimer = useRef(0);

  useEffect(() => () => clearTimeout(flashTimer.current), []);

  const flash = (id: SectionId) => {
    clearTimeout(flashTimer.current);
    setFlashed(id);
    flashTimer.current = window.setTimeout(() => setFlashed(null), 1100);
  };

  const tip = hovered ?? flashed;

  return (
    <nav aria-label="Sections" className="pointer-events-none fixed inset-x-0 bottom-0 z-50 hidden justify-center px-2 pb-6 md:flex">
      <ul
        className="dock glass-chip pointer-events-auto flex items-center gap-[var(--dock-gap)] rounded-full p-[var(--dock-pad)]"
        onPointerLeave={() => setHovered(null)}
      >
        {sections.map((s) => {
          const Icon = ICONS[s.id];
          const isActive = s.id === active;
          return (
            <li key={s.id} className="relative">
              <AnimatePresence>{tip === s.id && <Tooltip label={s.label} />}</AnimatePresence>
              <a
                href={`#${s.id}`}
                aria-label={s.label}
                aria-current={isActive ? 'location' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(s.id);
                }}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(s.id)}
                onPointerUp={(e) => e.pointerType !== 'mouse' && flash(s.id)}
                onFocus={(e) => e.currentTarget.matches(':focus-visible') && setHovered(s.id)}
                onBlur={() => setHovered(null)}
                className={`grid h-[var(--dot)] place-items-center rounded-full transition-[width,background-color,color] duration-500 ease-story ${
                  isActive
                    ? 'w-[calc(var(--dot)*var(--dock-stretch))] bg-accent text-ink'
                    : 'w-[var(--dot)] bg-white/[0.06] text-muted hover:bg-white/[0.11] hover:text-fg'
                }`}
              >
                <Icon aria-hidden className="h-[calc(var(--dot)*0.44)] w-[calc(var(--dot)*0.44)]" strokeWidth={1.5} />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function DesktopNav() {
  const { goTo } = useSections();
  const logoRef = useRef<HTMLDivElement>(null);
  const onLight = useOnLightSurface(logoRef);

  return (
    <div className="hidden md:block">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-8 pt-5">
        <div className="mx-auto max-w-6xl">
          <div ref={logoRef} className="pointer-events-auto inline-block">
            <Logo
              variant="plain"
              tone={onLight ? 'ink' : 'light'}
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                goTo('home');
              }}
            />
          </div>
        </div>
      </header>

      <Dock />
    </div>
  );
}

export default function Navbar() {
  return (
    <>
      <MobileNav />
      <DesktopNav />
    </>
  );
}
