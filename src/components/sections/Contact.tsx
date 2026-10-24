import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiArrowUpRight, FiCheck, FiSend } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import { SOCIAL_ICONS } from '../ui/Links';
import { profile, socials } from '../../data/profile';
import { fetchGeo, getDeviceInfo, rememberContact, WEB3FORMS_KEY } from '../../utils/analytics';
import { EASE } from '../../lib/motion';
import { gsap, useScrollScene } from '../../lib/gsap';

const TOPICS = ['a project', 'a full-time role', 'freelance work', 'just saying hi'];

type Status = 'idle' | 'sending' | 'sent' | 'error';

function InlineField({
  label,
  value,
  onChange,
  placeholder,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="inline-block max-w-full align-baseline">
      <span className="sr-only">{label}</span>
      <input
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ width: `${Math.max(value.length, placeholder.length) + 1}ch` }}
        className="max-w-full rounded-none border-b-2 border-white/20 bg-transparent px-1 pb-0.5 text-accent placeholder:text-white/25 focus:border-accent focus:outline-none"
        {...rest}
      />
    </label>
  );
}

function MessageForm() {
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [sentTo, setSentTo] = useState('');

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const [geo, device] = await Promise.all([fetchGeo(), Promise.resolve(getDeviceInfo())]);
      const context = [
        '',
        '---',
        'Visitor Context',
        `Device   : ${device.deviceType} · ${device.deviceModel}`,
        `Browser  : ${device.browserName} ${device.browserVersion}`.trim(),
        `OS       : ${device.osName} ${device.osVersion}`.trim(),
        `Location : ${geo.city ?? '?'}, ${geo.region ?? '?'}, ${geo.country_name ?? '?'}`,
        `ISP      : ${geo.org ?? 'Unknown'}`,
        `Referrer : ${document.referrer || 'Direct / Bookmark'}`,
      ].join('\n');

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio: ${form.topic} — from ${form.name}`,
          from_name: form.name,
          name: form.name,
          email: form.email,
          message: `Topic: ${form.topic}\n\n${form.message}${context}`,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error('rejected');
      rememberContact(form.name, form.email);
      setSentTo(form.name.split(' ')[0]);
      setForm({ name: '', email: '', topic: TOPICS[0], message: '' });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="on-dark rounded-[2rem] bg-ink p-6 text-fg shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] md:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <motion.div
            key="sent"
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="py-6"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-ink">
              <FiCheck size={24} aria-hidden />
            </span>
            <p className="display mt-6 text-[clamp(2.5rem,9vw,3.5rem)]">
              Sent. Talk soon{sentTo ? `, ${sentTo}` : ''}.
            </p>
            <p className="mt-3 text-lg text-muted">Your message is in my inbox. I'll get back to you soon.</p>
            <button type="button" onClick={() => setStatus('idle')} className="btn btn-ghost mt-8">
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} exit={{ opacity: 0 }} aria-labelledby="message-title">
            <p id="message-title" className="label text-muted">
              Send a message
            </p>

            <p className="mt-6 text-[clamp(1.4rem,5.4vw,2.1rem)] font-medium leading-[1.75] tracking-tight">
              Hi Aswin, I'm{' '}
              <InlineField label="Your name" name="name" autoComplete="name" placeholder="your name" value={form.name} onChange={set('name')} />
              , and you can reach me at{' '}
              <InlineField
                label="Your email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={set('email')}
              />
              . I'd love to talk about:
            </p>

            <fieldset className="mt-5">
              <legend className="sr-only">What would you like to talk about?</legend>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <label key={t} className="cursor-pointer">
                    <input
                      type="radio"
                      name="topic"
                      value={t}
                      checked={form.topic === t}
                      onChange={set('topic')}
                      className="peer sr-only"
                    />
                    <span className="flex h-11 items-center rounded-full border border-white/15 px-4 text-[15px] font-medium text-muted transition peer-checked:border-accent peer-checked:bg-accent peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="mt-7 block">
              <span className="label text-muted">A little more context</span>
              <textarea
                required
                name="message"
                rows={4}
                value={form.message}
                onChange={set('message')}
                placeholder="What are you building, and where could I help?"
                className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-base leading-relaxed text-fg placeholder:text-muted/50 focus:border-accent focus:outline-none"
              />
            </label>

            {status === 'error' && (
              <p role="alert" className="mt-4 text-sm text-red-300">
                That didn't go through. Check your connection and try again, or email me directly.
              </p>
            )}

            <button type="submit" disabled={status === 'sending'} className="btn btn-primary mt-6 w-full disabled:opacity-60 sm:w-auto">
              {status === 'sending' ? 'Sending...' : 'Send message'} <FiSend aria-hidden />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function DirectLines({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <p className="label text-ink/60">Or skip the form</p>
      <a
        href={`mailto:${profile.email}`}
        aria-label="Email Aswin"
        className="group mt-3 inline-flex items-center gap-3 text-[clamp(1.6rem,6vw,2.2rem)] font-bold tracking-tight"
      >
        <span className="underline decoration-ink/30 decoration-2 underline-offset-[6px] transition group-hover:decoration-ink">
          aswin.mail
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-accent transition-transform duration-300 ease-story group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-45">
          <FiArrowUpRight size={20} aria-hidden />
        </span>
      </a>
      <div className="mt-5 flex gap-2">
        {socials.map((s) => {
          const Icon = SOCIAL_ICONS[s.key];
          return (
            <a
              key={s.key}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              className="grid h-12 w-12 place-items-center rounded-full border border-ink/25 transition hover:bg-ink hover:text-accent"
            >
              <Icon size={18} aria-hidden />
            </a>
          );
        })}
      </div>
    </div>
  );
}

function LetsTalk({ className }: { className: string }) {
  return (
    <p className={`e-line display relative text-center text-[clamp(4.5rem,25vw,15rem)] !leading-[0.86] ${className}`}>
      <span className="block overflow-hidden pb-[0.08em]">
        <span className="e-word inline-block">Let's</span>
      </span>
      <span className="block overflow-hidden pb-[0.12em]">
        <span className="e-word story-serif inline-block font-normal">talk.</span>
      </span>
    </p>
  );
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // A lime circle bursts open from the centre while "Let's talk." rises and flips to ink
  useScrollScene(ref, () => {
    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: burstRef.current, start: 'top top', end: 'bottom bottom', scrub: 0.7 },
      })
      .fromTo('.e-burst', { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1, ease: 'power2.in' }, 0)
      .fromTo('.e-line', { scale: 0.55 }, { scale: 1, duration: 1 }, 0)
      .to({}, { duration: 0.25 });

    // The words rise while the stage is still sliding in, so there's no empty beat before the burst
    gsap.fromTo('.e-word', { yPercent: 115, rotate: 8 }, {
      yPercent: 0,
      rotate: 0,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: burstRef.current, start: 'top 85%', end: 'top 5%', scrub: 0.6 },
    });
  });

  return (
    <section id="contact" ref={ref} aria-labelledby="contact-title" className="relative">
      {!reduce && (
        <div ref={burstRef} aria-hidden className="relative h-[200svh]">
          {/* The words are drawn twice in the same spot: light on the dark stage, and ink inside the
              lime circle (clipped to it). Whatever part of the circle has reached them reads ink on lime,
              the rest light on dark, so "Let's talk." stays readable at every point of the scroll. */}
          <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden">
            <LetsTalk className="text-fg" />
            <div className="e-burst absolute inset-0 grid place-items-center bg-accent">
              <LetsTalk className="text-ink" />
            </div>
          </div>
        </div>
      )}

      <div className={`on-accent bg-accent px-4 pb-16 text-ink md:px-8 md:pb-32 ${reduce ? 'pt-20 md:pt-28' : 'pt-4 md:pt-8'}`}>
      <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id="contact"
            tone="accent"
            size="compact"
            title="Got an idea? *Let's build it.*"
          />
          <Reveal className="mt-8">
            <p className="max-w-md border-l-2 border-ink/25 pl-5 text-xl leading-relaxed text-ink/80 md:text-[1.35rem]">
              I like unique ideas and the kind of problems that don't have obvious answers. If you've got something
              interesting brewing, <span className="story-serif text-[1.15em] text-ink">I'm all ears.</span>
            </p>
          </Reveal>
          <Reveal className="mt-10 hidden lg:block">
            <DirectLines />
          </Reveal>
        </div>

        <Reveal className="mt-12 lg:col-span-7 lg:mt-0">
          <MessageForm />
        </Reveal>

        <Reveal className="mt-12 lg:hidden">
          <DirectLines />
        </Reveal>
      </div>
      </div>
    </section>
  );
}
