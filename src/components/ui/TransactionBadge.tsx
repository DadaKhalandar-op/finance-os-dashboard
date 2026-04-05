import { cn } from '@/lib/utils';
import type { TransactionCategory, TransactionType } from '@/types';

// ─── Category Badge ───────────────────────────────────────────────────────────
// Complete class strings — Tailwind can't detect dynamically-constructed classes.

const CATEGORY_STYLES: Record<TransactionCategory, string> = {
  Salary:        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  Investment:    'bg-indigo-100  text-indigo-700  dark:bg-indigo-500/15  dark:text-indigo-400',
  Food:          'bg-amber-100   text-amber-700   dark:bg-amber-500/15   dark:text-amber-400',
  Transport:     'bg-blue-100    text-blue-700    dark:bg-blue-500/15    dark:text-blue-400',
  Shopping:      'bg-pink-100    text-pink-700    dark:bg-pink-500/15    dark:text-pink-400',
  Entertainment: 'bg-violet-100  text-violet-700  dark:bg-violet-500/15  dark:text-violet-400',
  Health:        'bg-red-100     text-red-700     dark:bg-red-500/15     dark:text-red-400',
  Housing:       'bg-sky-100     text-sky-700     dark:bg-sky-500/15     dark:text-sky-400',
  Other:         'bg-slate-100   text-slate-600   dark:bg-slate-700/60   dark:text-slate-400',
};

interface CategoryBadgeProps {
  category: TransactionCategory;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5',
        'text-[11px] font-medium leading-none whitespace-nowrap',
        CATEGORY_STYLES[category],
        className
      )}
    >
      {category}
    </span>
  );
}

// ─── Type Badge ───────────────────────────────────────────────────────────────

interface TypeBadgeProps {
  type: TransactionType;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const isIncome = type === 'income';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5',
        'text-[11px] font-medium leading-none whitespace-nowrap',
        isIncome
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
          : 'bg-rose-100    text-rose-700    dark:bg-rose-500/15    dark:text-rose-400',
        className
      )}
    >
      {/* Directional indicator */}
      <span className="text-[10px] leading-none">{isIncome ? '↑' : '↓'}</span>
      {isIncome ? 'Income' : 'Expense'}
    </span>
  );
}