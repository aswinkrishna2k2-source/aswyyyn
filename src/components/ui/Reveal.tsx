import { motion, type HTMLMotionProps } from 'framer-motion';
import { EASE } from '../../lib/motion';

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number;
  y?: number;
}

/** Fades and lifts its content in the first time it scrolls into view. */
export default function Reveal({ delay = 0, y = 28, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
