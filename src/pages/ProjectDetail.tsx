import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiMaximize2 } from 'react-icons/fi';
import Reveal from '../components/ui/Reveal';
import Lightbox from '../components/ui/Lightbox';
import { PhoneFan } from '../components/ui/ProjectCover';
import Logo from '../components/ui/Logo';
import { allProjects, getProjectBySlug } from '../data/projects';
import { profile } from '../data/profile';
import { getProjectGallery } from '../utils/projectGallery';
import { getCover, getProjectLinks } from '../lib/projects';
import { enter } from '../lib/motion';
import { scrollToTarget } from '../lib/smoothScroll';
import { useOnLightSurface } from '../hooks/useOnLightSurface';

const DEFAULT_TITLE = document.title;

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-4">
      <dt className="label text-muted">{label}</dt>
      <dd className="mt-2 text-lg">{children}</dd>
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const gallery = useMemo(() => (slug ? getProjectGallery(slug) : []), [slug]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const onLight = useOnLightSurface(logoRef);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    scrollToTarget(0, true);
    setLightbox(null);
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    document.title = `${project.title} — ${profile.name}`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [project]);

  if (!project) return <Navigate to="/" replace />;

  const goHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/');
  };

  const index = allProjects.indexOf(project);
  const next = allProjects[(index + 1) % allProjects.length];
  const nextCover = next.cover === 'phones' ? undefined : getCover(next);
  const links = getProjectLinks(project);
  const hero = gallery[0];

  return (
    <div className="min-h-screen">
      {/* Phones: transparent bar that frosts on scroll. Tablet & desktop: just the wordmark and a back pill. */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] transition-[background-color,border-color] duration-300 md:hidden ${
          scrolled ? 'border-white/[0.06] bg-ink/75 backdrop-blur-xl' : 'border-transparent'
        }`}
      >
        <nav aria-label="Primary" className="flex h-16 items-center justify-between px-5">
          <Logo variant="plain" href="/" onClick={goHome} />
          <Link to="/#work" className="group -mr-1 flex h-11 items-center px-1">
            <span className="flex h-8 items-center gap-1.5 rounded-full bg-white px-4 text-[14px] font-medium text-ink transition group-active:scale-95 [@media(hover:hover)]:group-hover:bg-accent">
              <FiArrowLeft aria-hidden /> All projects
            </span>
          </Link>
        </nav>
      </header>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden px-8 pt-5 md:block">
        <nav aria-label="Primary" className="mx-auto flex max-w-6xl items-center justify-between gap-2">
          <div ref={logoRef} className="pointer-events-auto">
            <Logo variant="plain" tone={onLight ? 'ink' : 'light'} href="/" onClick={goHome} />
          </div>
          <Link to="/#work" className="group pointer-events-auto flex h-11 items-center">
            <span className="flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-[14px] font-medium text-ink transition group-active:scale-95 [@media(hover:hover)]:group-hover:bg-accent">
              <FiArrowLeft aria-hidden /> All projects
            </span>
          </Link>
        </nav>
      </header>

      <main className="px-4 pb-16 pt-28 md:px-8 md:pt-40">
        <article className="mx-auto max-w-6xl">
          <motion.p {...enter(0)} className="label flex flex-wrap items-center gap-x-3 gap-y-2 text-muted">
            <span className="rounded-full bg-accent px-2.5 py-1 text-ink">{project.featured ? 'Featured' : 'Personal build'}</span>
            {project.platform}
            {project.client && <span>· for {project.client}</span>}
          </motion.p>
          <motion.h1 {...enter(0.08)} className="display mt-6 text-[clamp(3.25rem,15vw,9rem)]">
            {project.title}
          </motion.h1>
          <motion.p {...enter(0.16)} className="story-serif mt-5 max-w-3xl text-[clamp(1.6rem,5.5vw,2.75rem)] leading-[1.1] text-fg/90">
            {project.tagline}
          </motion.p>

          {links.length > 0 && (
            <motion.div {...enter(0.24)} className="mt-8 flex flex-wrap gap-2">
              {links.map(({ href, label, icon: Icon }, i) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={`btn ${i === 0 ? 'btn-primary' : 'btn-ghost'}`}>
                  <Icon aria-hidden /> {label}
                </a>
              ))}
            </motion.div>
          )}

          {/* Hero media */}
          <motion.div {...enter(0.3, 32)} className="mt-12 md:mt-16">
            {project.cover === 'phones' ? (
              <PhoneFan images={gallery.slice(0, 3)} className="h-[min(62svh,560px)] rounded-[2rem]" />
            ) : hero ? (
              <button
                type="button"
                onClick={() => setLightbox(0)}
                className="group relative block w-full overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-ink-deep"
                aria-label="Enlarge the first screenshot"
              >
                <img src={hero} alt={`${project.title} — main screen`} className="w-full transition-transform duration-700 ease-story group-hover:scale-[1.01]" />
                <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-ink/80 text-muted backdrop-blur">
                  <FiMaximize2 aria-hidden />
                </span>
              </button>
            ) : project.logo ? (
              <div className="grid h-72 place-items-center rounded-[1.75rem] bg-accent/10">
                <img src={project.logo} alt={`${project.title} logo`} className="max-h-[50%] max-w-[60%] object-contain" />
              </div>
            ) : null}
          </motion.div>

          {/* Overview + facts */}
          <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <p className="label text-accent">Overview</p>
              <p className="mt-5 text-[1.125rem] leading-[1.75] text-fg/85 md:text-[1.25rem]">
                {project.longDescription ?? project.description}
              </p>
            </Reveal>
            <Reveal className="lg:col-span-4 lg:col-start-9">
              <dl className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
                <Fact label="Platform">{project.platform}</Fact>
                {project.client && <Fact label="Built for">{project.client}</Fact>}
                <Fact label="Stack">
                  <ul className="flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </Fact>
                {gallery.length > 0 && <Fact label="Screenshots">{gallery.length}</Fact>}
              </dl>
            </Reveal>
          </div>

          {/* Gallery */}
          {gallery.length > 1 && (
            <section aria-labelledby="gallery-title" className="mt-20 md:mt-28">
              <Reveal className="flex items-end justify-between gap-4">
                <h2 id="gallery-title" className="text-3xl font-bold tracking-tight md:text-4xl">
                  Gallery
                </h2>
                <span className="label text-muted">Swipe · tap to enlarge</span>
              </Reveal>
              <Reveal>
                <ul className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:-mx-8 md:scroll-px-8 md:px-8">
                  {gallery.map((src, i) => (
                    <li key={src} className="shrink-0 snap-start">
                      <button
                        type="button"
                        onClick={() => setLightbox(i)}
                        aria-label={`Enlarge screenshot ${i + 1}`}
                        className="block overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-deep transition hover:border-white/25"
                      >
                        <img src={src} alt="" loading="lazy" className="h-[clamp(220px,50svh,460px)] w-auto max-w-[85vw] object-contain" />
                      </button>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </section>
          )}

          {/* Next project — keeps visitors moving through the work */}
          <Reveal className="mt-24 md:mt-32">
            <Link to={`/projects/${next.slug}`} className="group block overflow-hidden rounded-[2rem] bg-accent text-ink">
              <div className="grid items-stretch md:grid-cols-12">
                <div className="p-6 md:col-span-7 md:p-12">
                  <p className="label text-ink/60">Next project</p>
                  <p className="display mt-4 text-[clamp(2.75rem,12vw,5.5rem)]">{next.title}</p>
                  <p className="story-serif mt-2 text-2xl leading-snug text-ink/75">{next.tagline}</p>
                  <span className="btn btn-ink mt-8">
                    View project <FiArrowRight aria-hidden className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                {nextCover && (
                  <div className="h-56 overflow-hidden md:col-span-5 md:h-auto">
                    <img src={nextCover} alt="" loading="lazy" className="h-full w-full object-cover object-left-top transition-transform duration-700 ease-story group-hover:scale-[1.04]" />
                  </div>
                )}
              </div>
            </Link>
          </Reveal>
        </article>
      </main>

      <footer className="border-t border-white/[0.06] px-4 py-8 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Logo
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
          />
          <p className="label text-muted">
            © {new Date().getFullYear()} {profile.handle}
          </p>
        </div>
      </footer>

      <Lightbox
        items={gallery.map((src, i) => ({ src, alt: `${project.title} screenshot ${i + 1}`, caption: `${project.title} · screenshot ${i + 1} of ${gallery.length}` }))}
        index={lightbox}
        onChange={setLightbox}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}
