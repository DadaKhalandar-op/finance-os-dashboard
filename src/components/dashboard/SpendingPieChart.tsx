import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { CategoryBreakdown } from '@/types';
import {
  formatCurrency,
  formatCurrencyCompact,
  formatPercentAbs,
} from '@/lib/utils/formatters';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SpendingPieChartProps {
  data: CategoryBreakdown[];
  total: number;
}

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CategoryBreakdown }>;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function PieTooltip({ active, payload }: PieTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div
      className={[
        'rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-lg',
        'dark:border-slate-700/80 dark:bg-slate-800',
      ].join(' ')}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: item.color }}
        />
        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
          {item.category}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-base font-bold tabular-nums text-slate-900 dark:text-slate-100">
          {formatCurrency(item.amount)}
        </span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          {formatPercentAbs(item.percentage)}
        </span>
      </div>
    </div>
  );
}

// ─── Legend Row ───────────────────────────────────────────────────────────────

function LegendRow({ item }: { item: CategoryBreakdown }) {
  return (
    <div className="flex items-center gap-2.5 py-[3px]">
      <span
        className="h-2 w-2 flex-shrink-0 rounded-full"
        style={{ backgroundColor: item.color }}
      />
      <span className="min-w-0 flex-1 truncate text-xs text-slate-600 dark:text-slate-300">
        {item.category}
      </span>
      <span className="flex-shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
        {formatPercentAbs(item.percentage)}
      </span>
      <span className="w-16 flex-shrink-0 text-right text-xs font-semibold tabular-nums text-slate-900 dark:text-slate-100">
        {formatCurrencyCompact(item.amount)}
      </span>
    </div>
  );
}

// ─── Spending Pie Chart ───────────────────────────────────────────────────────

// Show at most 7 categories in the chart/legend — keeps the donut readable.
const MAX_SLICES = 7;

export default function SpendingPieChart({ data, total }: SpendingPieChartProps) {
  const displayData = data.slice(0, MAX_SLICES);

  return (
    <div
      className={[
        'rounded-2xl border border-slate-200 bg-white p-5',
        'shadow-sm shadow-slate-200/50',
        'dark:border-slate-800/80 dark:bg-slate-900/60 dark:shadow-none',
      ].join(' ')}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <h3 className="font-syne text-sm font-semibold text-slate-900 dark:text-slate-100">
          Spending Breakdown
        </h3>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
          By category · all time
        </p>
      </div>

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {displayData.length === 0 ? (
        <div className="flex h-52 items-center justify-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            No expense data yet.
          </p>
        </div>
      ) : (
        /* ── Chart + Legend layout ────────────────────────────────────────── */
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">

          {/* Donut — fixed square so the chart never squishes */}
          <div className="relative h-[176px] w-[176px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayData}
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="82%"
                  dataKey="amount"
                  stroke="none"
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                >
                  {displayData.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label — positioned absolute so it's unaffected by chart redraw */}
            <div
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
              aria-hidden
            >
              <span className="font-syne text-[1.1rem] font-semibold leading-none tabular-nums text-slate-900 dark:text-slate-100">
                {formatCurrencyCompact(total)}
              </span>
              <span className="mt-1.5 text-[10px] font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Total
              </span>
            </div>
          </div>

          {/* Legend list */}
          <div className="w-full flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
            {displayData.map((item) => (
              <LegendRow key={item.category} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}