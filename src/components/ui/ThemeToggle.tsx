import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ThemeToggleProps {
  /** When 'icon-only' the button shows no text label (used in sidebar) */
  variant?: 'icon-only' | 'with-label';
  className?: string;
}

const iconVariants = {
  initial: { opacity: 0, rotate: -45, scale: 0.7 },
  animate: { opacity: 1, rotate: 0, scale: 1 },
  exit:    { opacity: 0, rotate: 45, scale: 0.7 },
};

export default function ThemeToggle({
  variant = 'icon-only',
  className,
}: ThemeToggleProps) {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  const button = (
    <button
      onClick={toggleTheme}
      aria-label={label}
      className={[
        'relative flex items-center gap-2 rounded-lg transition-all duration-200 focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
        'focus-visible:ring-offset-slate-900',
        variant === 'icon-only'
          ? 'h-8 w-8 justify-center bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
          : 'px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Animated icon swap */}
      <span className="relative flex h-4 w-4 items-center justify-center overflow-hidden flex-shrink-0">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="h-4 w-4" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="h-4 w-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {/* Optional text label */}
      {variant === 'with-label' && (
        <span className="text-xs">{isDark ? 'Dark' : 'Light'}</span>
      )}
    </button>
  );

  if (variant === 'icon-only') {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right" className="bg-slate-800 text-slate-200 border-slate-700 text-xs">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}