import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeInLeft, scaleIn, viewport } from '../utils/animations';
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
  'Aswin Developer CLI Sandbox v2.4 initialized. Type "help" or click shortcuts below to execute commands.';

// ── Small output-formatting helpers ──────────────────────────────────────────
function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-wrap gap-x-2">
      <span className={`text-fg font-semibold shrink-0 w-24 ${font.small}`}>{label}:</span>
      <span className={`text-muted min-w-0 break-words ${font.small}`}>{value}</span>
    </div>
  );
}

// ── Command outputs ───────────────────────────────────────────────────────────
function aboutOutput() {
  const years = getExperienceYears(EXPERIENCE_START_YEAR);
  return (
    <div className="space-y-1">
      <Row label="BIO" value="Aswin Krishnan — Full Stack & React Native Developer · UI/UX Designer" />
      <Row label="LOCATION" value="Kollam, Kerala, India" />
      <Row
        label="SUMMARY"
        value={`${years}+ years of experience building fast, clean web and mobile apps using the MERN stack and React Native.`}
      />
    </div>
  );
}

function skillsOutput() {
  return (
    <div className="space-y-2">
      {skills.map((cat) => (
        <p key={cat.category} className={font.small}>
          <span className="text-fg font-semibold uppercase tracking-wide">{cat.category}:</span>{' '}
          <span className="text-muted">{cat.skills.map((s) => s.name).join(' / ')}</span>
        </p>
      ))}
    </div>
  );
}

function journeyOutput() {
  return (
    <div className="space-y-3">
      {experiences.map((exp) => (
        <div key={exp.id} className={font.small}>
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-accent">{exp.duration}</span>
            <span className="text-fg font-semibold">
              {exp.role} · {exp.company}
            </span>
          </p>
          <p className="text-muted/60 mb-1">{exp.type}</p>
          <ul className="space-y-0.5">
            {exp.contributions.map((c) => (
              <li key={c} className="text-muted flex gap-2">
                <span className="text-accent shrink-0">-</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function contactOutput() {
  return (
    <div className="space-y-1">
      <Row label="LOCATION" value="Kollam, Kerala, India (remote-friendly)" />
      <Row
        label="EMAIL"
        value={
          <a href="mailto:aswinkrishna2k2@gmail.com" className="text-accent hover:underline">
            aswinkrishna2k2@gmail.com
          </a>
        }
      />
      <Row
        label="LINKEDIN"
        value={
          <a href="https://www.linkedin.com/in/aswyyyn/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            linkedin.com/in/aswyyyn
          </a>
        }
      />
      <Row
        label="GITHUB"
        value={
          <a href="https://github.com/aswin2002" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            github.com/aswin2002
          </a>
        }
      />
      <Row
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
      />
      <p className={`text-muted/60 pt-1 ${font.small}`}>
        Or scroll down to <span className="text-accent">#contact</span> to send a message directly.
      </p>
    </div>
  );
}

function helpOutput() {
  return (
    <div>
      <p className={`text-fg font-semibold mb-1 ${font.small}`}>Available Commands:</p>
      <div className="space-y-0.5">
        {COMMANDS.map((c) => (
          <div key={c.cmd} className={`flex gap-2 ${font.small}`}>
            <span className="text-accent w-20 shrink-0">- {c.cmd}</span>
            <span className="text-muted">: {c.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
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

// ── History entry types ───────────────────────────────────────────────────────
type Entry =
  | { id: number; kind: 'intro'; text: string }
  | { id: number; kind: 'command'; text: string }
  | { id: number; kind: 'error'; text: string }
  | { id: number; kind: 'output'; content: ReactNode }
  | { id: number; kind: 'matrix' };

const RUNNERS: Record<string, () => ReactNode> = {
  about: aboutOutput,
  skills: skillsOutput,
  journey: journeyOutput,
  contact: contactOutput,
};

export default function Terminal() {
  const [history, setHistory] = useState<Entry[]>([{ id: 0, kind: 'intro', text: INTRO }]);
  const [input, setInput] = useState('');
  const [cmdLog, setCmdLog] = useState<string[]>([]);
  const [histPointer, setHistPointer] = useState<number | null>(null);

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
    let result: Entry;
    if (cmd === 'help') {
      result = { id: nextId(), kind: 'output', content: helpOutput() };
    } else if (cmd === 'matrix') {
      result = { id: nextId(), kind: 'matrix' };
    } else if (RUNNERS[cmd]) {
      result = { id: nextId(), kind: 'output', content: RUNNERS[cmd]() };
    } else {
      result = { id: nextId(), kind: 'error', text: `command not found: ${cmd} — type 'help' for available commands.` };
    }

    setHistory((h) => [...h, echo, result]);
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

  const runQuickCommand = (cmd: string) => {
    runCommand(cmd);
    inputRef.current?.focus();
  };

  return (
    <section id="terminal" className="py-20 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="section-header"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className={`section-title ${font.sectionTitle}`}>
            <span className="text-accent">#</span>terminal
          </h2>
          <div className="section-line" />
        </motion.div>

        <motion.p
          className={`text-muted ${font.body} leading-relaxed mb-8 max-w-lg`}
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          A tiny CLI sandbox for this portfolio — poke around, or just click a command below.
        </motion.p>

        <motion.div
          className="border border-white/10 bg-[#141414]"
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
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
                return (
                  <p key={entry.id} className={`text-muted ${font.small} leading-relaxed`}>
                    {entry.text}
                  </p>
                );
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
              <button key={cmd} onClick={() => runQuickCommand(cmd)} className={`btn-ghost ${font.small}`}>
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
