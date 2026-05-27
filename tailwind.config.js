/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Fira Code"', 'monospace'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        accent: 'rgb(var(--accent) / <alpha-value>)',
        fg: '#e4e4e4',
        muted: '#abb2bf',
        surface: '#252526',
      },
    },
  },
  plugins: [],
}
