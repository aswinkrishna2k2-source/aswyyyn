export interface MarkedWord {
  text: string;
  /** Punctuation that follows an accented word but shouldn't be accented itself */
  tail: string;
  accent: boolean;
}

/** Splits copy into words; `*wrapped*` phrases are flagged as accents. "*ship*." → { text: 'ship', tail: '.' } */
export function parseMarked(input: string): MarkedWord[] {
  const words: MarkedWord[] = [];
  let inAccent = false;
  for (let raw of input.split(' ')) {
    if (raw.startsWith('*')) {
      inAccent = true;
      raw = raw.slice(1);
    }
    const close = raw.indexOf('*');
    if (close >= 0) {
      words.push({ text: raw.slice(0, close), tail: raw.slice(close + 1), accent: true });
      inAccent = false;
    } else {
      words.push({ text: raw, tail: '', accent: inAccent });
    }
  }
  return words;
}
