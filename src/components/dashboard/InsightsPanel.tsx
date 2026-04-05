import {
    Tag,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    AlertCircle,
    type LucideIcon,
  } from 'lucide-react';
  import { cn } from '@/lib/utils';
  import type { Insight } from '@/types';
  import { SkeletonInsightCard } from '@/components/ui/SkeletonCard';
  
  // ─── Icon registry ────────────────────────────────────────────────────────────
  
  const ICON_MAP: Record<string, LucideIcon> = {
    Tag,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    AlertCircle,
  };
  
  // ─── Sentiment palette ────────────────────────────────────────────────────────
  // Complete class strings — required for Tailwind to include them at build time.
  
  const SENTIMENT_STYLES = {
    positive: {
      iconBg:    'bg-emerald-50    dark:bg-emerald-500/10',
      iconColor: 'text-emerald-500  dark:text-emerald-400',
      valueColor: 'text-emerald-600 dark:text-emerald-400',
    },
    negative: {
      iconBg:    'bg-rose-50    dark:bg-rose-500/10',
      iconColor: 'text-rose-500  dark:text-rose-400',
      valueColor: 'text-rose-500  dark:text-rose-400',
    },
    neutral: {
      iconBg:    'bg-blue-50    dark:bg-blue-500/10',
      iconColor: 'text-blue-500  dark:text-blue-400',
      valueColor: 'text-slate-900 dark:text-slate-100',
    },
  } as const;
  
  // ─── Single Insight Card ──────────────────────────────────────────────────────
  
  function InsightCard({ insight }: { insight: Insight }) {
    const Icon   = ICON_MAP[insight.iconName] ?? Tag;
    const styles = SENTIMENT_STYLES[insight.sentiment];
  
    return (
      <div
        className={cn(
          'rounded-2xl border border-slate-200 bg-white p-4',
          'shadow-sm shadow-slate-200/50',
          'dark:border-slate-800/80 dark:bg-slate-900/60 dark:shadow-none',
          'transition-shadow duration-200 hover:shadow-md dark:hover:border-slate-700'
        )}
      >
        <div className="flex items-start gap-3">
          {/* Icon badge */}
          <div
            className={cn(
              'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg',
              styles.iconBg
            )}
          >
            <Icon className={cn('h-4 w-4', styles.iconColor)} strokeWidth={2} />
          </div>
  
          {/* Text block */}
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {insight.title}
            </p>
            <p
              className={cn(
                'mt-1 font-syne text-lg font-semibold leading-tight',
                styles.valueColor
              )}
            >
              {insight.value}
            </p>
            <p className="mt-1 truncate text-xs text-slate-400 dark:text-slate-500">
              {insight.subtext}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // ─── Insights Panel ───────────────────────────────────────────────────────────
  
  interface InsightsPanelProps {
    insights: Insight[];
    isLoading: boolean;
  }
  
  export default function InsightsPanel({
    insights,
    isLoading,
  }: InsightsPanelProps) {
    const SKELETON_COUNT = 4;
  
    return (
      <section aria-label="Financial insights">
        {/* Section header */}
        <div className="mb-4">
          <h2 className="font-syne text-sm font-semibold text-slate-900 dark:text-slate-100">
            Financial Insights
          </h2>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
            Smart observations derived from your data
          </p>
        </div>
  
        {/* Grid — 1 col mobile · 2 col sm · 4 col xl */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonInsightCard key={i} />
              ))
            : insights.length > 0
            ? insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))
            : (
              <div className="col-span-full flex items-center justify-center rounded-2xl border border-dashed border-slate-200 py-10 dark:border-slate-800">
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  Add transactions to generate insights.
                </p>
              </div>
            )}
        </div>
      </section>
    );
  }