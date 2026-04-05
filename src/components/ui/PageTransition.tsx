import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps each route's content with a coordinated enter/exit animation.
 *
 * The parent <AnimatePresence mode="wait"> in App.tsx ensures the exiting
 * page finishes its exit animation before the entering page begins — so the
 * two never overlap. The y offset (10px in, -6px out) gives a subtle sense
 * of directionality without being distracting.
 */
const variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.25, 0.1, 0.25, 1] as const, // CSS cubic-bezier ease equivalent
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.16,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export default function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      // Grow to fill the parent column so short pages don't collapse the layout
      className={className ?? 'min-h-full'}
    >
      {children}
    </motion.div>
  );
}