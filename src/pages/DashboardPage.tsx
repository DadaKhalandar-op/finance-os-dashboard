import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  X,
} from 'lucide-react';

import { useAppStore } from '@/store/useAppStore';
import PageTransition from '@/components/ui/PageTransition';
import SummaryCard    from '@/components/dashboard/SummaryCard';
import BalanceTrendChart from '@/components/dashboard/BalanceTrendChart';
import SpendingPieChart  from '@/components/dashboard/SpendingPieChart';
import InsightsPanel     from '@/components/dashboard/InsightsPanel';
import {
  SkeletonSummaryCard,
  SkeletonChartCard,
} from '@/components/ui/SkeletonCard';
import { formatPercent, formatDate } from '@/lib/utils/formatters';

// ─── Animation Variants ───────────────────────────────────────────────────────
// Defined at module scope: stable references, never recreated on render.

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const cardStaggerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.02 },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div
      className={[
        'flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4',
        'dark:border-rose-800/50 dark:bg-rose-900/20',
      ].join(' ')}
      role="alert"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-500" />
      <p className="flex-1 text-sm text-rose-700 dark:text-rose-300">{message}</p>
      <button
        onClick={onDismiss}
        className="text-rose-400 transition-colors hover:text-rose-600 dark:hover:text-rose-200"
        aria-label="Dismiss error"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function PageHeader({ transactionCount }: { transactionCount: number }) {
  const today = formatDate(new Date().toISOString().slice(0, 10));

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-syne text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{today}</p>
      </div>

      {transactionCount > 0 && (
        <div
          className={[
            'flex items-center gap-1.5 rounded-full border border-slate-200 bg-card px-3 py-1.5',
            'dark:border-slate-800 dark:bg-slate-900/60',
          ].join(' ')}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {transactionCount.toLocaleString()} transactions
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  // ── Store selectors (one per slice → fine-grained re-render control) ─────
  const summary             = useAppStore((s) => s.summary);
  const summaryLoading      = useAppStore((s) => s.summaryLoading);
  const transactionsLoading = useAppStore((s) => s.transactionsLoading);
  const error               = useAppStore((s) => s.error);
  const getInsights         = useAppStore((s) => s.getInsights);
  const setFilters          = useAppStore((s) => s.setFilters); // used by error dismiss

  const isLoading = summaryLoading || transactionsLoading || !summary;

  // Insights are derived from the full transaction list — cheap selector call.
  const insights = getInsights();

  // ── Month-over-month deltas (for summary card trends) ─────────────────────
  const moTrends = useMemo(() => {
    if (!summary?.monthlyTrend || summary.monthlyTrend.length < 2) return null;
    const arr  = summary.monthlyTrend;
    const curr = arr[arr.length - 1];
    const prev = arr[arr.length - 2];

    const incomeChange =
      prev.income > 0
        ? ((curr.income - prev.income) / prev.income) * 100
        : null;
    const expenseChange =
      prev.expenses > 0
        ? ((curr.expenses - prev.expenses) / prev.expenses) * 100
        : null;

    return { incomeChange, expenseChange };
  }, [summary]);

  // ── Dismiss error by clearing it from the store (best-effort) ────────────
  const dismissError = () => setFilters({}); // trivial state write → triggers re-render but error is ephemeral

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <PageTransition>
      <div className="space-y-6">

        {/* ── Page header (always visible) ──────────────────────────────── */}
        <PageHeader transactionCount={summary?.transactionCount ?? 0} />

        {/* ── Error banner ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error-banner"
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ErrorBanner message={error} onDismiss={dismissError} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Summary Cards ─────────────────────────────────────────────── */}
        {/*
         * AnimatePresence initial={false}:
         *   - Skeleton appears immediately on first mount (no entrance anim).
         *   - When isLoading flips to false, skeleton exits (fade) and the
         *     real cards enter with their stagger. Best of both worlds.
         */}
        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <motion.div
              key="skeleton-cards"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {[0, 1, 2].map((i) => (
                <SkeletonSummaryCard key={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="real-cards"
              variants={cardStaggerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {/* Total Balance */}
              <motion.div variants={itemVariants}>
                <SummaryCard
                  title="Total Balance"
                  value={summary!.totalBalance}
                  icon={Wallet}
                  accent="blue"
                  trend={summary!.totalBalance >= 0 ? 'up' : 'down'}
                  trendValue={
                    moTrends?.incomeChange != null
                      ? formatPercent(moTrends.incomeChange)
                      : undefined
                  }
                  trendLabel="income vs last month"
                />
              </motion.div>

              {/* Total Income */}
              <motion.div variants={itemVariants}>
                <SummaryCard
                  title="Total Income"
                  value={summary!.totalIncome}
                  icon={TrendingUp}
                  accent="emerald"
                  trend={
                    moTrends?.incomeChange == null
                      ? 'neutral'
                      : moTrends.incomeChange > 0
                      ? 'up'
                      : 'down'
                  }
                  trendValue={
                    moTrends?.incomeChange != null
                      ? formatPercent(moTrends.incomeChange)
                      : undefined
                  }
                  trendLabel="vs last month"
                />
              </motion.div>

              {/* Total Expenses */}
              <motion.div variants={itemVariants}>
                <SummaryCard
                  title="Total Expenses"
                  value={summary!.totalExpenses}
                  icon={TrendingDown}
                  accent="rose"
                  inverseTrend  // up = bad for expenses
                  trend={
                    moTrends?.expenseChange == null
                      ? 'neutral'
                      : moTrends.expenseChange > 0
                      ? 'up'
                      : 'down'
                  }
                  trendValue={
                    moTrends?.expenseChange != null
                      ? formatPercent(moTrends.expenseChange)
                      : undefined
                  }
                  trendLabel="vs last month"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Charts ────────────────────────────────────────────────────── */}
        {/*
         * The trend chart is 3/5 of the grid width on desktop; the pie takes 2/5.
         * chartHeight=288 matches h-72 (288px) so skeleton & real chart are identical height.
         */}
        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <motion.div
              key="skeleton-charts"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="grid grid-cols-1 gap-4 lg:grid-cols-5"
            >
              <div className="lg:col-span-3">
                <SkeletonChartCard chartHeight={288} />
              </div>
              <div className="lg:col-span-2">
                <SkeletonChartCard chartHeight={288} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="real-charts"
              variants={itemVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4 lg:grid-cols-5"
            >
              <div className="lg:col-span-3">
                <BalanceTrendChart data={summary!.monthlyTrend} />
              </div>
              <div className="lg:col-span-2">
                <SpendingPieChart
                  data={summary!.categoryBreakdown}
                  total={summary!.totalExpenses}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Insights Panel ────────────────────────────────────────────── */}
        {/*
         * InsightsPanel manages its own skeleton grid internally,
         * so we don't need AnimatePresence here — it handles the swap itself.
         */}
        <InsightsPanel insights={insights} isLoading={isLoading} />
      </div>
    </PageTransition>
  );
}