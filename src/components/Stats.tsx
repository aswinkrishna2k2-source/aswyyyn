import { font } from '../utils/fontsize';

export default function Stats() {
  return (
    <section className="py-16 px-6 lg:px-16 lg:ml-0">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mx-auto border border-white/10 p-8 relative">
          <span className="absolute -top-5 left-6 text-5xl text-accent font-serif leading-none select-none">
            "
          </span>

          <p className={`text-fg ${font.quoteText} text-center leading-relaxed mt-2`}>
            I am always doing what I cannot do yet, in order to learn how to do it.
          </p>

          <div className="flex justify-between items-end mt-6">
            <span />
            <span className={`text-muted ${font.quoteAuthor}`}>Pablo Picasso</span>
          </div>

          <span className="absolute -bottom-5 right-6 text-5xl text-accent font-serif leading-none select-none rotate-180">
            "
          </span>
        </div>
      </div>
    </section>
  );
}
