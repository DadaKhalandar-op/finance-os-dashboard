import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from 'recharts';
  import { useAppStore } from '@/store/useAppStore';
  import type { MonthlySummary } from '@/types';
  import { formatCurrency, formatCurrencyCompact } from '@/lib/utils/formatters';
  
  // ─── Types ────────────────────────────────────────────────────────────────────
  
  interface BalanceTrendChartProps {
    data: MonthlySummary[];
  }
  
  interface TooltipEntry {
    color: string;
    name: string;
    value: number;
    dataKey: string;
  }
  
  interface TooltipProps {
    active?: boolean;
    payload?: TooltipEntry[];
    label?: string;
  }
  
  // ─── Custom Tooltip ───────────────────────────────────────────────────────────
  // Rendered in the DOM under <html class="dark">, so Tailwind dark: works normally.
  
  function ChartTooltip({ active, payload, label }: TooltipProps) {
    if (!active || !payload?.length) return null;
  
    return (
      <div
        className={[
          'rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-lg',
          'dark:border-slate-700/80 dark:bg-slate-800',
        ].join(' ')}
      >
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {label}
        </p>
        {payload.map((entry) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-8 py-[3px]"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 flex-shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {entry.name}
              </span>
            </div>
            <span className="text-xs font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  
  // ─── Balance Trend Chart ──────────────────────────────────────────────────────
  
  export default function BalanceTrendChart({ data }: BalanceTrendChartProps) {
    const theme   = useAppStore((s) => s.theme);
    const isDark  = theme === 'dark';
  
    // Chart chrome colors — must be explicit values (not CSS vars) for Recharts SVG props.
    const gridColor = isDark ? '#1e293b' : '#f1f5f9';
    const axisColor = isDark ? '#475569' : '#94a3b8';
  
    const hasData = data.some((m) => m.income > 0 || m.expenses > 0);
  
    return (
      <div
        className={[
          'rounded-2xl border border-slate-200 bg-white p-5',
          'shadow-sm shadow-slate-200/50',
          'dark:border-slate-800/80 dark:bg-slate-900/60 dark:shadow-none',
        ].join(' ')}
      >
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-syne text-sm font-semibold text-slate-900 dark:text-slate-100">
              Balance Trend
            </h3>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              Income vs. expenses — last 12 months
            </p>
          </div>
  
          {/* Inline legend */}
          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              Expenses
            </span>
          </div>
        </div>
  
        {/* ── Chart area — h-56 mobile → h-72 sm+ ──────────────────────────── */}
        <div className="h-56 sm:h-72">
          {!hasData ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-slate-400 dark:text-slate-500">
                No data to display yet.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 4, right: 2, left: 0, bottom: 0 }}
              >
                {/* Gradient fills */}
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#10b981"
                      stopOpacity={isDark ? 0.28 : 0.2}
                    />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#fb7185"
                      stopOpacity={isDark ? 0.28 : 0.2}
                    />
                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                  </linearGradient>
                </defs>
  
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                  vertical={false}
                />
  
                <XAxis
                  dataKey="month"
                  tick={{
                    fill: axisColor,
                    fontSize: 11,
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                  }}
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                  interval="preserveStartEnd"
                />
  
                <YAxis
                  tickFormatter={(v: number) => formatCurrencyCompact(v)}
                  tick={{
                    fill: axisColor,
                    fontSize: 11,
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={54}
                />
  
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{
                    stroke: isDark ? '#334155' : '#e2e8f0',
                    strokeWidth: 1,
                    strokeDasharray: '4 4',
                  }}
                />
  
                {/* Income area */}
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#incomeGrad)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    strokeWidth: 0,
                    fill: '#10b981',
                  }}
                />
  
                {/* Expenses area */}
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#fb7185"
                  strokeWidth={2}
                  fill="url(#expensesGrad)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    strokeWidth: 0,
                    fill: '#fb7185',
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    );
  }