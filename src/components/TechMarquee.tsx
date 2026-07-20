import type { IconType } from 'react-icons';
import {
  SiHtml5, SiCss, SiJavascript, SiTypescript, SiReact, SiNextdotjs,
  SiNodedotjs, SiExpress, SiMongodb, SiMysql, SiFirebase, SiTailwindcss,
  SiBootstrap, SiWordpress, SiGit, SiFigma, SiExpo,
} from 'react-icons/si';
import { font } from '../utils/fontsize';

interface TechItem {
  name: string;
  Icon: IconType;
}

const rowOne: TechItem[] = [
  { name: 'HTML5', Icon: SiHtml5 },
  { name: 'CSS3', Icon: SiCss },
  { name: 'JavaScript', Icon: SiJavascript },
  { name: 'TypeScript', Icon: SiTypescript },
  { name: 'React', Icon: SiReact },
  { name: 'Next.js', Icon: SiNextdotjs },
  { name: 'Node.js', Icon: SiNodedotjs },
  { name: 'Express.js', Icon: SiExpress },
  { name: 'MongoDB', Icon: SiMongodb },
];

const rowTwo: TechItem[] = [
  { name: 'MySQL', Icon: SiMysql },
  { name: 'Firebase', Icon: SiFirebase },
  { name: 'Tailwind CSS', Icon: SiTailwindcss },
  { name: 'Bootstrap', Icon: SiBootstrap },
  { name: 'React Native', Icon: SiReact },
  { name: 'WordPress', Icon: SiWordpress },
  { name: 'Git', Icon: SiGit },
  { name: 'Figma', Icon: SiFigma },
  { name: 'Expo', Icon: SiExpo },
];

function MarqueeRow({ items, direction, duration }: { items: TechItem[]; direction: 'left' | 'right'; duration: number }) {
  const track = [...items, ...items];

  return (
    <div className="marquee-mask overflow-hidden">
      <div
        className={`flex gap-3 w-max ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {track.map(({ name, Icon }, i) => (
          <div
            key={`${name}-${i}`}
            className="group flex items-center gap-2.5 px-4 py-2.5 border border-white/8 bg-white/[0.02] hover:border-accent/40 hover:bg-white/[0.04] transition-colors flex-shrink-0"
          >
            <Icon size={18} className="text-muted/70 group-hover:text-accent transition-colors flex-shrink-0" />
            <span className={`${font.small} text-muted/70 group-hover:text-fg transition-colors whitespace-nowrap`}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <div className="py-10 overflow-hidden">
      <div className="flex flex-col gap-4">
        <MarqueeRow items={rowOne} direction="left" duration={32} />
        <MarqueeRow items={rowTwo} direction="right" duration={28} />
      </div>
    </div>
  );
}
