export type FunFactPart =
  | { type: 'text'; value: string }
  | { type: 'highlight'; value: string };

export interface FunFact {
  id: number;
  parts: FunFactPart[];
}

export const funFacts: FunFact[] = [
  {
    id: 1,
    parts: [{ type: 'text', value: 'I like winter more than summer' }],
  },
  {
    id: 2,
    parts: [{ type: 'text', value: 'I often bike with my friends' }],
  },
  {
    id: 3,
    parts: [
      { type: 'text', value: 'I like ' },
      { type: 'highlight', value: 'pizza' },
      { type: 'text', value: ' and ' },
      { type: 'highlight', value: 'pasta' },
    ],
  },
  {
    id: 4,
    parts: [
      { type: 'text', value: 'I was in ' },
      { type: 'highlight', value: 'Egypt' },
      { type: 'text', value: ', ' },
      { type: 'highlight', value: 'Poland' },
      { type: 'text', value: ' and ' },
      { type: 'highlight', value: 'Turkey' },
    ],
  },
  {
    id: 5,
    parts: [
      { type: 'text', value: 'My favorite movie is ' },
      { type: 'highlight', value: 'The Green Mile' },
    ],
  },
  {
    id: 6,
    parts: [{ type: 'text', value: 'I am still in school' }],
  },
  {
    id: 7,
    parts: [{ type: 'text', value: "I don't have any siblings" }],
  },
];
