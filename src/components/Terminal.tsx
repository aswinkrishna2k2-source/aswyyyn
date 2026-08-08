import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { scaleIn, viewport } from '../utils/animations';
import { font } from '../utils/fontsize';
import { skills } from '../data/skills';
import { experiences } from '../data/experience';

const EXPERIENCE_START_YEAR = 2024;
function getExperienceYears(startYear: number) {
  return new Date().getFullYear() - startYear;
}

// ── Commands registry (also drives the quick-command buttons & help text) ───
const COMMANDS: { cmd: string; desc: string }[] = [
  { cmd: 'about', desc: "View Aswin's background bio & education" },
  { cmd: 'skills', desc: 'View full technical stack breakdown' },
  { cmd: 'journey', desc: 'Display timeline roles & experience' },
  { cmd: 'contact', desc: 'Display contact details & socials' },
  { cmd: 'matrix', desc: 'Easter egg glitch animation' },
  { cmd: 'clear', desc: 'Clear terminal history' },
];

const INTRO =
  'Booting aswin@dev-shell... done. No sudo required — type "help" or tap a shortcut below to look around.';

// ── Boot line — types itself out once the terminal scrolls into view ────────
const TYPE_SPEED_MS = 28;

function TypedIntro({ text, active }: { text: string; active: boolean }) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) clearInterval(id);
    }, TYPE_SPEED_MS);
    return () => clearInterval(id);
  }, [active, text]);

  const done = count >= text.length;

  return (
    <p className={`text-muted ${font.small} leading-relaxed`}>
      {text.slice(0, count)}
      {active && !done && <span className="text-accent terminal-caret">|</span>}
    </p>
  );
}

// ── Small output-formatting helpers ──────────────────────────────────────────
function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-2">
      <span className={`text-fg font-semibold shrink-0 w-24 ${font.small}`}>{label}:</span>
      <span className={`text-muted min-w-0 break-words ${font.small}`}>{value}</span>
    </div>
  );
}

// Streams a command's output one line at a time, like real stdout printing — instead
// of dumping the whole block at once. The first line lands immediately, the rest follow.
const LINE_REVEAL_MS = 140;

function LineReveal({ lines, className }: { lines: ReactNode[]; className?: string }) {
  const [count, setCount] = useState(() => Math.min(1, lines.length));
  const lastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (count >= lines.length) return;
    const id = setTimeout(() => setCount((c) => c + 1), LINE_REVEAL_MS);
    return () => clearTimeout(id);
  }, [count, lines.length]);

  useEffect(() => {
    lastRef.current?.scrollIntoView({ block: 'nearest' });
  }, [count]);

  return (
    <div className={className}>
      {lines.slice(0, count).map((line, i) => (
        <div key={i} ref={i === count - 1 ? lastRef : undefined}>
          {line}
        </div>
      ))}
    </div>
  );
}

// ── Command outputs ───────────────────────────────────────────────────────────
function aboutOutput() {
  const years = getExperienceYears(EXPERIENCE_START_YEAR);
  const lines: ReactNode[] = [
    <Row key="bio" label="BIO" value="Aswin Krishnan — Full Stack & React Native Developer · UI/UX Designer" />,
    <Row key="location" label="LOCATION" value="Kollam, Kerala, India" />,
    <Row
      key="summary"
      label="SUMMARY"
      value={`${years}+ years of experience building fast, clean web and mobile apps using the MERN stack and React Native.`}
    />,
  ];
  return <LineReveal lines={lines} className="space-y-1" />;
}

function skillsOutput() {
  const lines: ReactNode[] = skills.map((cat) => (
    <p key={cat.category} className={font.small}>
      <span className="text-fg font-semibold uppercase tracking-wide">{cat.category}:</span>{' '}
      <span className="text-muted">{cat.skills.map((s) => s.name).join(' / ')}</span>
    </p>
  ));
  return <LineReveal lines={lines} className="space-y-2" />;
}

function journeyOutput() {
  const lines: ReactNode[] = [];
  experiences.forEach((exp, i) => {
    lines.push(
      <p key={`${exp.id}-head`} className={`flex flex-wrap items-baseline gap-x-2 ${font.small} ${i > 0 ? 'pt-2' : ''}`}>
        <span className="text-accent">{exp.duration}</span>
        <span className="text-fg font-semibold">
          {exp.role} · {exp.company}
        </span>
      </p>,
    );
    lines.push(
      <p key={`${exp.id}-type`} className={`text-muted/60 ${font.small}`}>
        {exp.type}
      </p>,
    );
    exp.contributions.forEach((c, ci) => {
      lines.push(
        <p key={`${exp.id}-c${ci}`} className={`text-muted flex gap-2 ${font.small}`}>
          <span className="text-accent shrink-0">-</span>
          <span>{c}</span>
        </p>,
      );
    });
  });
  return <LineReveal lines={lines} className="space-y-0.5" />;
}

function contactOutput() {
  const lines: ReactNode[] = [
    <Row key="location" label="LOCATION" value="Kollam, Kerala, India (remote-friendly)" />,
    <Row
      key="email"
      label="EMAIL"
      value={
        <a href="mailto:aswinkrishna2k2@gmail.com" className="text-accent hover:underline">
          aswinkrishna2k2@gmail.com
        </a>
      }
    />,
    <Row
      key="linkedin"
      label="LINKEDIN"
      value={
        <a href="https://www.linkedin.com/in/aswyyyn/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          linkedin.com/in/aswyyyn
        </a>
      }
    />,
    <Row
      key="github"
      label="GITHUB"
      value={
        <a href="https://github.com/aswin2002" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          github.com/aswin2002
        </a>
      }
    />,
    <Row
      key="resume"
      label="RESUME"
      value={
        <a
          href="/resume.pdf"
          download="Aswin Krishnan — Resume.pdf"
          onClick={() => document.dispatchEvent(new CustomEvent('portfolio:resume-download'))}
          className="text-accent hover:underline"
        >
          /resume.pdf ↓
        </a>
      }
    />,
    <p key="note" className={`text-muted/60 pt-1 ${font.small}`}>
      Or scroll down to <span className="text-accent">#contact</span> to send a message directly.
    </p>,
  ];
  return <LineReveal lines={lines} className="space-y-1" />;
}

function helpOutput() {
  const lines: ReactNode[] = [
    <p key="header" className={`text-fg font-semibold ${font.small}`}>
      Available Commands:
    </p>,
    ...COMMANDS.map((c) => (
      <div key={c.cmd} className={`flex gap-2 ${font.small}`}>
        <span className="text-accent w-20 shrink-0">- {c.cmd}</span>
        <span className="text-muted">: {c.desc}</span>
      </div>
    )),
  ];
  return <LineReveal lines={lines} className="space-y-1" />;
}

// ── Matrix easter egg — text-decode glitch effect ────────────────────────────
const GLITCH_CHARS = '!<>-_\\/[]{}=+*^?#$%&01';
const MATRIX_LINES = [
  'INITIATING GLITCH SEQUENCE...',
  'You found the easter egg. Nice eye. 🐇',
  'System note: no bugs here — only undocumented features. — Aswyyyn',
];
const MATRIX_LINE_CHARS = MATRIX_LINES.map((l) => Array.from(l)); // Array.from splits on code points, so the 🐇 surrogate pair survives intact
const MATRIX_STAGGER = 8;
const MATRIX_DONE_TICK = Math.max(...MATRIX_LINE_CHARS.map((l) => l.length)) + MATRIX_STAGGER * (MATRIX_LINE_CHARS.length - 1) + 4;

function scrambleChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

function MatrixGlitch() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (tick >= MATRIX_DONE_TICK) return;
    const id = setTimeout(() => setTick((t) => t + 1), 35);
    return () => clearTimeout(id);
  }, [tick]);

  return (
    <pre className={`whitespace-pre-wrap break-words text-accent leading-relaxed ${font.small}`}>
      {MATRIX_LINE_CHARS.map((chars, i) => {
        const offset = i * MATRIX_STAGGER;
        const revealed = Math.max(0, tick - offset);
        const text = chars
          .map((ch, idx) => (ch === ' ' ? ' ' : idx < revealed ? ch : scrambleChar()))
          .join('');
        return <div key={i}>{text}</div>;
      })}
    </pre>
  );
}

// ── Command loader — a fake install/resolve sequence, like running a real CLI ─
const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const LOAD_MS = 950;

function loadPhases(cmd: string) {
  return [`Resolving @aswin/${cmd}@latest...`, 'Fetching module...', 'Linking output...'];
}

function CommandLoader({ cmd }: { cmd: string }) {
  const [frame, setFrame] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phases = loadPhases(cmd);
  const phaseMs = LOAD_MS / phases.length;

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % SPINNER_FRAMES.length), 110);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (phaseIdx >= phases.length - 1) return;
    const id = setTimeout(() => setPhaseIdx((p) => p + 1), phaseMs);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIdx]);

  return (
    <p className={`text-muted ${font.small}`}>
      <span className="text-accent">{SPINNER_FRAMES[frame]}</span> {phases[phaseIdx]}
    </p>
  );
}

// ── History entry types ───────────────────────────────────────────────────────
type Entry =
  | { id: number; kind: 'intro'; text: string }
  | { id: number; kind: 'command'; text: string }
  | { id: number; kind: 'error'; text: string }
  | { id: number; kind: 'output'; content: ReactNode }
  | { id: number; kind: 'matrix' }
  | { id: number; kind: 'loading'; cmd: string };

const RUNNERS: Record<string, () => ReactNode> = {
  about: aboutOutput,
  skills: skillsOutput,
  journey: journeyOutput,
  contact: contactOutput,
};

function buildResult(id: number, cmd: string): Entry {
  if (cmd === 'help') return { id, kind: 'output', content: helpOutput() };
  if (cmd === 'matrix') return { id, kind: 'matrix' };
  return { id, kind: 'output', content: RUNNERS[cmd]() };
}

export default function Terminal() {
  const [history, setHistory] = useState<Entry[]>([{ id: 0, kind: 'intro', text: INTRO }]);
  const [input, setInput] = useState('');
  const [cmdLog, setCmdLog] = useState<string[]>([]);
  const [histPointer, setHistPointer] = useState<number | null>(null);
  const [introActive, setIntroActive] = useState(false);

  const idRef = useRef(1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const nextId = () => idRef.current++;

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const cmd = trimmed.replace(/^\//, '').toLowerCase();

    setCmdLog((log) => [...log, trimmed]);

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    const echo: Entry = { id: nextId(), kind: 'command', text: trimmed };
    const isKnown = cmd === 'help' || cmd === 'matrix' || Boolean(RUNNERS[cmd]);

    if (!isKnown) {
      const error: Entry = {
        id: nextId(),
        kind: 'error',
        text: `command not found: ${cmd} — type 'help' for available commands.`,
      };
      setHistory((h) => [...h, echo, error]);
      return;
    }

    // Known commands run through a fake install/resolve sequence first, like a real CLI
    const loadingId = nextId();
    setHistory((h) => [...h, echo, { id: loadingId, kind: 'loading', cmd }]);

    setTimeout(() => {
      setHistory((h) => {
        const idx = h.findIndex((e) => e.id === loadingId && e.kind === 'loading');
        if (idx === -1) return h; // cleared (or already resolved) before the loader finished
        const next = [...h];
        next[idx] = buildResult(loadingId, cmd);
        return next;
      });
    }, LOAD_MS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(input);
    setInput('');
    setHistPointer(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdLog.length === 0) return;
      const next = histPointer === null ? cmdLog.length - 1 : Math.max(0, histPointer - 1);
      setHistPointer(next);
      setInput(cmdLog[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histPointer === null) return;
      const next = histPointer + 1;
      if (next >= cmdLog.length) {
        setHistPointer(null);
        setInput('');
      } else {
        setHistPointer(next);
        setInput(cmdLog[next]);
      }
    }
  };

  return (
    <section id="terminal" className="py-20 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="border border-white/10 bg-[#141414]"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          onViewportEnter={() => setIntroActive(true)}
        >
          {/* Title bar */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-surface">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className={`text-muted ${font.small} truncate`}>aswin@dev-shell:~</span>
            </div>
           
          </div>

          {/* Output */}
          <div
            ref={bodyRef}
            onClick={() => inputRef.current?.focus()}
            className="h-[360px] sm:h-[420px] overflow-y-auto overflow-x-hidden px-4 py-4 space-y-2"
          >
            {history.map((entry) => {
              if (entry.kind === 'intro') {
                return <TypedIntro key={entry.id} text={entry.text} active={introActive} />;
              }
              if (entry.kind === 'command') {
                return (
                  <p key={entry.id} className={font.small}>
                    <span className="text-accent">$ </span>
                    <span className="text-cyan-300">{entry.text}</span>
                  </p>
                );
              }
              if (entry.kind === 'error') {
                return (
                  <p key={entry.id} className={`text-red-400 ${font.small}`}>
                    {entry.text}
                  </p>
                );
              }
              if (entry.kind === 'matrix') {
                return <MatrixGlitch key={entry.id} />;
              }
              if (entry.kind === 'loading') {
                return <CommandLoader key={entry.id} cmd={entry.cmd} />;
              }
              return (
                <div key={entry.id} className="pb-1">
                  {entry.content}
                </div>
              );
            })}
          </div>

          {/* Quick commands */}
          <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-t border-white/10 bg-surface">
            <span className={`text-muted ${font.small} mr-1`}>Quick Commands:</span>
            {['help', ...COMMANDS.map((c) => c.cmd)].map((cmd) => (
              <button key={cmd} onClick={() => runCommand(cmd)} className={`btn-ghost ${font.small}`}>
                /{cmd}
              </button>
            ))}
          </div>

          {/* Input row */}
          <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 py-3 border-t border-white/10">
            <span className="text-accent shrink-0">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command..."
              spellCheck={false}
              autoComplete="off"
              className={`flex-1 min-w-0 bg-transparent outline-none text-fg placeholder-muted/40 font-mono ${font.small}`}
            />
            <button type="submit" className={`btn-accent ${font.button} inline-flex items-center gap-1.5 shrink-0`}>
              Run ↵
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
