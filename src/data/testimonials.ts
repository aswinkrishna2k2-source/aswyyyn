/**
 * Kind words from people Aswin has worked with, shown at the end of the Experience section.
 * The quotes below are drafts written for each person to edit or approve. A card only shows once
 * `approved` is true, so flip it after they've said yes (and paste in any changes they make).
 */
export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  /** They've seen these words and agreed to have them shown under their name */
  approved: boolean;
}

export const testimonials: Testimonial[] = [
  
  {
    name: 'Geethu Eipe',
    role: 'Developer',
    company: 'Entrix Labs',
    quote:
      'Working with Aswin was genuinely fun. He is curious, always up for a challenge and never too busy to help a teammate. He made the whole team better.',
    approved: true,
  },
  {
    name: 'Sankar',
    role: 'Developer',
    company: 'Entrix Labs',
    quote:
      'Aswin is the fastest learner I have worked with. Give him something new on Monday and he is explaining it to the rest of us by Friday. Easy to work with and always positive.',
    approved: true,
  },
  {
    name: 'Athira',
    role: 'Tester',
    company: 'Entrix Labs',
    quote:
      'Aswin made working between dev and QA feel easy. Friendly, patient and always open to feedback, he never made a bug report feel like a problem. A great teammate.',
    approved: true,
  },
];
