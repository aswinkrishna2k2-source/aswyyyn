/**
 * Central font-size registry.
 * Edit values here to change sizes site-wide.
 * All values must be complete Tailwind class strings so the JIT scanner picks them up.
 */
export const font = {
  // ── Hero ──────────────────────────────────────────────────────────────
  heroGreeting: "text-xl",
  heroName: "text-5xl md:text-6xl lg:text-7xl",
  heroSurname: "text-5xl md:text-6xl lg:text-7xl",
  heroRole: "text-2xl",
  heroBody: "text-lg",

  // ── Navigation ────────────────────────────────────────────────────────
  navLogo: "text-xl",
  navLink: "text-lg",

  // ── Section titles  (#projects, #skills …) ───────────────────────────
  sectionTitle: "text-2xl",

  // ── Project cards ─────────────────────────────────────────────────────
  cardTitle: "text-xl",
  cardTag: "text-sm",
  cardBody: "text-base",

  // ── Skills ────────────────────────────────────────────────────────────
  skillCategory: "text-lg",
  skillItem: "text-base",

  // ── Experience ────────────────────────────────────────────────────────
  expRole: "text-2xl",
  expCompany: "text-lg",
  expBody: "text-base",

  // ── About ─────────────────────────────────────────────────────────────
  aboutHeading: "text-2xl",
  aboutBody: "text-lg",

  // ── Contact ───────────────────────────────────────────────────────────
  contactLabel: "text-base",
  contactBody: "text-lg",

  // ── Quote / Stats ─────────────────────────────────────────────────────
  quoteText: "text-xl",
  quoteAuthor: "text-base",

  // ── General / shared ──────────────────────────────────────────────────
  body: "text-lg",
  label: "text-base",
  small: "text-sm",
  button: "text-base",
  badge: "text-sm",
} as const;
