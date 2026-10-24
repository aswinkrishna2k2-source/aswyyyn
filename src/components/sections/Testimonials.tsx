import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheck, FiPlus, FiX } from 'react-icons/fi';
import Dialog from '../ui/Dialog';
import { testimonials, type Testimonial } from '../../data/testimonials';
import { EASE } from '../../lib/motion';
import { gsap, useScrollScene } from '../../lib/gsap';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMPTY = { name: '', role: '', words: '', email: '' };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const field =
  'mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-fg placeholder:text-muted/50 focus:border-accent focus:outline-none';

function QuoteCard({ t }: { t: Testimonial }) {
  return (
    <figure className="t-card flex w-[80%] shrink-0 snap-start flex-col rounded-3xl border border-white/10 bg-[#202021] p-5 md:w-auto md:p-6">
      <blockquote className="flex-1 text-[15px] leading-relaxed text-fg/90">
        <span aria-hidden className="story-serif mr-1 inline-block translate-y-[0.32em] text-[1.75rem] leading-none text-accent">
          &ldquo;
        </span>
        {t.quote}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-bold text-ink">
          {initials(t.name)}
        </span>
        <span className="text-sm leading-tight">
          <span className="block font-semibold">{t.name}</span>
          <span className="block text-muted">
            {t.role} · {t.company}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Someone who's worked with Aswin can send their words in; they arrive by email for him to review */
function AddYoursForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [sentTo, setSentTo] = useState('');

  const set = (key: keyof typeof EMPTY) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const { WEB3FORMS_KEY, rememberContact } = await import('../../utils/analytics');
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Testimonial for review — from ${form.name}`,
          from_name: form.name,
          name: form.name,
          ...(form.email && { email: form.email }),
          message: [
            `"${form.words.trim()}"`,
            '',
            `— ${form.name}, ${form.role}`,
            form.email ? `Email: ${form.email}` : 'No email given',
            '',
            'To publish it, add it to src/data/testimonials.ts.',
          ].join('\n'),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error('rejected');
      if (form.email) rememberContact(form.name, form.email);
      setSentTo(form.name.split(' ')[0]);
      setForm(EMPTY);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <h3 id="add-yours-title" className="text-2xl font-bold tracking-tight">
          {status === 'sent' ? 'Thank you' : 'Add your words'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-muted transition hover:border-white/40 hover:text-fg"
        >
          <FiX aria-hidden />
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <motion.div
            key="sent"
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="pt-6"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-ink">
              <FiCheck size={24} aria-hidden />
            </span>
            <p className="display mt-6 text-[clamp(2rem,8vw,2.75rem)]">Got it{sentTo ? `, ${sentTo}` : ''}.</p>
            <p className="mt-3 text-lg text-muted">Aswin will review your words and add them to the site soon.</p>
            <button type="button" onClick={onClose} className="btn btn-ghost mt-8">
              Close
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} exit={{ opacity: 0 }} className="pt-2">
            <p className="text-muted">Worked with Aswin? Share a line or two. He reviews every note before it goes up.</p>

            <label className="mt-6 block">
              <span className="label text-muted">Your name</span>
              <input required data-autofocus name="name" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Your name" className={field} />
            </label>

            <label className="mt-5 block">
              <span className="label text-muted">Role &amp; company</span>
              <input required name="role" autoComplete="organization-title" value={form.role} onChange={set('role')} placeholder="Developer @company" className={field} />
            </label>

            <label className="mt-5 block">
              <span className="label text-muted">Your words</span>
              <textarea
                required
                name="words"
                rows={4}
                maxLength={500}
                value={form.words}
                onChange={set('words')}
                placeholder="What was it like working with Aswin?"
                className={`${field} resize-none leading-relaxed`}
              />
            </label>

            <label className="mt-5 block">
              <span className="label text-muted">Email (optional)</span>
              <input name="email" type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="you@email.com" className={field} />
              <span className="mt-2 block text-sm text-muted/70">Only so Aswin can confirm it&rsquo;s you. Never shown.</span>
            </label>

            {status === 'error' && (
              <p role="alert" className="mt-5 text-sm text-red-300">
                That didn&rsquo;t send. Check your connection and try again.
              </p>
            )}

            <button type="submit" disabled={status === 'sending'} className="btn btn-primary mt-7 w-full disabled:opacity-60">
              {status === 'sending' ? 'Sending…' : 'Send for review'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

// Where each card starts before it settles: dropped at a slight angle, like notes on a desk
const SCATTER = [
  { rotate: -7, x: -24, y: 70 },
  { rotate: 5, x: 0, y: 110 },
  { rotate: -4, x: 24, y: 150 },
];

/**
 * A small coda to the Experience section: quotes from colleagues and a way to add one. As it scrolls
 * into view the cards drift up from a scattered pile and straighten into a tidy row.
 */
export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const quotes = testimonials.filter((t) => t.approved && t.quote.trim());

  useScrollScene(ref, () => {
    const cards = gsap.utils.toArray<HTMLElement>('.t-card');
    if (!cards.length) return;
    const from = (i: number) => SCATTER[i % SCATTER.length];
    gsap.fromTo(
      cards,
      { rotate: (i) => from(i).rotate, x: (i) => from(i).x, y: (i) => from(i).y, opacity: 0 },
      {
        rotate: 0,
        x: 0,
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.t-row', start: 'top 95%', end: 'top 50%', scrub: 0.6 },
      },
    );
  }, [quotes.length]);

  return (
    <section ref={ref} aria-labelledby="kind-words-title" className="mx-auto max-w-6xl px-4 pb-20 pt-4 md:px-8 md:pb-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-muted">Kind words</p>
          <h3 id="kind-words-title" className="mt-3 text-[clamp(1.75rem,5vw,2.5rem)] font-bold leading-none tracking-[-0.03em]">
            {quotes.length ? (
              <>
                What people <span className="story-serif font-normal text-accent">say.</span>
              </>
            ) : (
              <>
                Worked <span className="story-serif font-normal text-accent">with me?</span>
              </>
            )}
          </h3>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="btn btn-ghost min-h-0 h-10 px-4 text-sm">
          <FiPlus aria-hidden className="text-accent" /> Add yours
        </button>
      </div>

      {quotes.length > 0 && (
        // Phones swipe through the cards; wider screens lay them out in one row
        <div className="t-row no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 pt-2 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
          {quotes.map((t) => (
            <QuoteCard key={t.name} t={t} />
          ))}
        </div>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} labelledBy="add-yours-title">
        <AddYoursForm onClose={() => setOpen(false)} />
      </Dialog>
    </section>
  );
}
