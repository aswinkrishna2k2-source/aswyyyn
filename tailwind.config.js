/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        hero: ['Sora', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#1b1b1b',
          deep: '#141414',
          raised: '#252526',
        },
        fg: '#e4e4e4',
        muted: '#abb2bf',
        accent: 'rgb(var(--accent) / <alpha-value>)',
      },
      transitionTimingFunction: {
        story: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        blink: { '0%, 49%': { opacity: '1' }, '50%, 100%': { opacity: '0' } },
        'scroll-hint': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
        pulse_ring: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 18s linear infinite',
        blink: 'blink 1s steps(1) infinite',
        'pulse-ring': 'pulse_ring 1.8s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'scroll-hint': 'scroll-hint 1.6s cubic-bezier(0.65, 0, 0.35, 1) infinite',
      },
    },
  },
  plugins: [],
}
