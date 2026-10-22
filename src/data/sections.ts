/**
 * Home page sections, in scroll order. Each id maps 1:1 to a <section id> and drives the navbar,
 * the active-link highlight and visitor tracking.
 */
export const sections = [
  { id: 'home', no: '00', label: 'Home' },
  { id: 'about', no: '01', label: 'About' },
  { id: 'experience', no: '02', label: 'Experience' },
  { id: 'work', no: '03', label: 'Work' },
  { id: 'stack', no: '04', label: 'Stack' },
  { id: 'education', no: '05', label: 'Education' },
  { id: 'contact', no: '06', label: 'Contact' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

/** Everything after the hero — what the navbar links to. */
export const navSections = sections.slice(1);

export function getSection(id: SectionId) {
  return sections.find((s) => s.id === id)!;
}
