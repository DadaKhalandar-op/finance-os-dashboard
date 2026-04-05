import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/formatters';

// ─── Types

export type CardAccent = 'blue' | 'emerald' | 'rose' | 'violet' | 'amber';

interface SummaryCardProps {
  title: string;
  /** Raw numeric value — always passed as the true number (can be negative) */
  value: number;
  icon: LucideIcon;
  accent: CardAccent;
  trend?: 'up' | 'down' | 'neutral';
  /** Formatted string shown beside the trend arrow, e.g. "+12.4%" */
  trendValue?: string | null;
  trendLabel?: string;
  /**
   * When true, an upward trend is semantically bad (e.g. expenses rising).
   * Flips the colour mapping: up→rose, down→emerald.
   */
  inverseTrend?: boolean;
}

// ─── Accent palette ───────────────────────────────────────────────────────────
// All class strings are complete so Tailwind can detect them at build time.

const ACCENT: Record<CardAccent, { iconBg: string; iconColor: string }> = {
  blue: {
    iconBg:    'bg-blue-50    dark:bg-blue-500/10',
    iconColor: 'text-blue-500  dark:text-blue-400',
  },
  emerald: {
    iconBg:    'bg-emerald-50    dark:bg-emerald-500/10',
    iconColor: 'text-emerald-500  dark:text-emerald-400',
  },
  rose: {
    iconBg:    'bg-rose-50    dark:bg-rose-500/10',
    iconColor: 'text-rose-500  dark:text-rose-400',
  },
  violet: {
    iconBg:    'bg-violet-50    dark:bg-violet-500/10',
    iconColor: 'text-violet-500  dark:text-violet-400',
  },
  amber: {
    iconBg:    'bg-amber-50    dark:bg-amber-500/10',
    iconColor: 'text-amber-500  dark:text-amber-400',
  },
};

// ─── CountUp 
// Programmatic animation via framer-motion's standalone `animate()` function.
// Reads the node's textContent directly — no state, no re-renders.

function CountUp({
  to,
  format = formatCurrency,
}: {
  to: number;
  format?: (n: number) => string;
}) {
  const nodeRef  = useRef<HTMLSpanElement>(null);
  const prevRef  = useRef(0);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(prevRef.current, to, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1], // expo-out: bursts through the number, settles crisply
      onUpdate(latest) {
        node.textContent = format(latest);
      },
      onComplete() {
        prevRef.current = to;
      },
    });

    return () => controls.stop();
  }, [to, format]);

  return (
    <span ref={nodeRef} className="tabular-nums">
      {format(to)}
    </span>
  );
}

//Trend indicator

function TrendBadge({
  trend,
  trendValue,
  trendLabel,
  inverseTrend,
}: {
  trend: 'up' | 'down' | 'neutral';
  trendValue?: string | null;
  trendLabel?: string;
  inverseTrend?: boolean;
}) {
  const isPositive = inverseTrend
    ? trend === 'down'
    : trend === 'up';

  const trendClass =
    trend === 'neutral'
      ? 'text-slate-400 dark:text-slate-500'
      : isPositive
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-rose-500   dark:text-rose-400';

  const Icon =
    trend === 'up'
      ? TrendingUp
      : trend === 'down'
      ? TrendingDown
      : Minus;

  return (
    <div className="mt-5 flex items-center gap-1.5">
      <span className={cn('flex items-center gap-0.5 text-xs font-semibold', trendClass)}>
        <Icon className="h-3 w-3" strokeWidth={2.5} />
        {trendValue}
      </span>
      {trendLabel && (
        <span className="text-xs text-slate-400 dark:text-slate-500">{trendLabel}</span>
      )}
    </div>
  );
}

//Summary Card 

export default function SummaryCard({
  title,
  value,
  icon: Icon,
  accent,
  trend = 'neutral',
  trendValue,
  trendLabel,
  inverseTrend = false,
}: SummaryCardProps) {
  const { iconBg, iconColor } = ACCENT[accent];

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-card p-5',
        'shadow-sm shadow-slate-200/50',
        'dark:border-slate-800/80 dark:bg-slate-900/60 dark:shadow-none',
        'transition-shadow duration-200 hover:shadow-md dark:hover:border-slate-700'
      )}
    >
      {/* ── Top row ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {/* Label */}
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {title}
          </p>
          {/* Animated value */}
          <p className="mt-1.5 font-syne text-[1.75rem] font-semibold leading-none text-slate-900 dark:text-slate-100">
            <CountUp to={value} />
          </p>
        </div>

        {/* Icon badge */}
        <div
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl',
            iconBg
          )}
        >
          <Icon className={cn('h-5 w-5', iconColor)} strokeWidth={2} />
        </div>
      </div>

      {/* ── Trend row ───────────────────────────────────────────────────────── */}
      {(trendValue || trendLabel) && (
        <TrendBadge
          trend={trend}
          trendValue={trendValue}
          trendLabel={trendLabel}
          inverseTrend={inverseTrend}
        />
      )}
    </div>
  );
}