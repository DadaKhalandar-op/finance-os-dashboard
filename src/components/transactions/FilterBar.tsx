import { useState, useEffect, useCallback } from 'react';
import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAppStore, DEFAULT_FILTERS } from '@/store/useAppStore';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { CategoryBadge } from '@/components/ui/TransactionBadge';
import { ALL_CATEGORIES } from '@/types';
import type { TransactionType, GroupBy, TransactionCategory } from '@/types';
import { cn } from '@/lib/utils';

// ─── Type filter button group ─────────────────────────────────────────────────

const TYPE_OPTIONS: { value: TransactionType | 'all'; label: string }[] = [
  { value: 'all',     label: 'All'     },
  { value: 'income',  label: 'Income'  },
  { value: 'expense', label: 'Expense' },
];

// ─── Group-by options ─────────────────────────────────────────────────────────

const GROUP_OPTIONS: { value: GroupBy; label: string }[] = [
  { value: 'none',     label: 'No grouping'   },
  { value: 'month',    label: 'By month'      },
  { value: 'category', label: 'By category'   },
  { value: 'type',     label: 'By type'       },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Counts active filters (excludes default sort) */
function countActiveFilters(filters: typeof DEFAULT_FILTERS): number {
  let count = 0;
  if (filters.search)               count++;
  if (filters.type !== 'all')       count++;
  if (filters.categories.length)    count++;
  if (filters.dateFrom)             count++;
  if (filters.dateTo)               count++;
  if (filters.groupBy !== 'none')   count++;
  return count;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ActiveBadge({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key="active-badge"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          exit={{   scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={[
            'ml-1.5 inline-flex h-4 w-4 items-center justify-center',
            'rounded-full bg-emerald-500 text-[10px] font-bold text-white',
          ].join(' ')}
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// ─── Main FilterBar ───────────────────────────────────────────────────────────

export default function FilterBar() {
  const filters     = useAppStore((s) => s.filters);
  const setFilters  = useAppStore((s) => s.setFilters);
  const resetFilters = useAppStore((s) => s.resetFilters);

  // Local search state — debounced before syncing to store
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ search: debouncedSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep local search in sync when filters are reset externally
  useEffect(() => {
    if (filters.search !== localSearch && filters.search === '') {
      setLocalSearch('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  const toggleCategory = useCallback(
    (cat: TransactionCategory) => {
      const next = filters.categories.includes(cat)
        ? filters.categories.filter((c) => c !== cat)
        : [...filters.categories, cat];
      setFilters({ categories: next });
    },
    [filters.categories, setFilters]
  );

  const activeCount = countActiveFilters({ ...filters, search: localSearch });

  // ── Shared class helpers ───────────────────────────────────────────────────

  const inputBase = [
    'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors',
    'border-slate-200 bg-white text-slate-700',
    'dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-200',
    'hover:border-slate-300 dark:hover:border-slate-600',
    'focus-within:border-emerald-400 dark:focus-within:border-emerald-500',
    'focus-within:ring-2 focus-within:ring-emerald-400/20',
  ].join(' ');

  return (
    <div className="space-y-3">
      {/* ── Row 1: Search + Reset ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className={cn('flex-1', inputBase)}>
          <Search className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by description or category…"
            className={[
              'flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400',
              'dark:placeholder:text-slate-600',
            ].join(' ')}
            aria-label="Search transactions"
          />
          <AnimatePresence>
            {localSearch && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{   opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.1 }}
                onClick={() => setLocalSearch('')}
                className="ml-auto flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Filters label + active count */}
        <div className="hidden items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 sm:flex">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          <ActiveBadge count={activeCount} />
        </div>

        {/* Reset */}
        <AnimatePresence>
          {activeCount > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{   opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              onClick={() => { resetFilters(); setLocalSearch(''); }}
              className={[
                'flex items-center gap-1 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors',
                'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100',
                'dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/30',
              ].join(' ')}
              aria-label="Reset all filters"
            >
              <X className="h-3 w-3" />
              Reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Row 2: Type | Categories | Date Range | Group By ──────────────── */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Type toggle */}
        <div
          className={[
            'flex overflow-hidden rounded-lg border',
            'border-slate-200 dark:border-slate-700/80',
          ].join(' ')}
          role="group"
          aria-label="Filter by type"
        >
          {TYPE_OPTIONS.map((opt) => {
            const isActive = filters.type === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setFilters({ type: opt.value })}
                className={cn(
                  'relative px-3 py-2 text-xs font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500',
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white text-slate-500 hover:bg-slate-50 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-800'
                )}
                aria-pressed={isActive}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Category multi-select */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                filters.categories.length > 0
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-800'
              )}
              aria-label="Filter by categories"
            >
              Categories
              {filters.categories.length > 0 && (
                <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                  {filters.categories.length}
                </span>
              )}
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            className={[
              'w-52 p-2',
              'border-slate-200 bg-white shadow-lg',
              'dark:border-slate-700/80 dark:bg-slate-800',
            ].join(' ')}
            align="start"
          >
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Filter by category
            </p>
            <div className="space-y-0.5">
              {ALL_CATEGORIES.map((cat) => {
                const checked = filters.categories.includes(cat);
                return (
                  <label
                    key={cat}
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors',
                      'hover:bg-slate-50 dark:hover:bg-slate-700/50',
                      checked && 'bg-slate-50 dark:bg-slate-700/30'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(cat)}
                      className="h-3.5 w-3.5 rounded border-slate-300 accent-emerald-500 dark:border-slate-600"
                    />
                    <CategoryBadge category={cat} />
                  </label>
                );
              })}
            </div>
            {filters.categories.length > 0 && (
              <button
                onClick={() => setFilters({ categories: [] })}
                className="mt-2 w-full rounded-md px-2 py-1.5 text-center text-[11px] font-medium text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-900/20"
              >
                Clear selection
              </button>
            )}
          </PopoverContent>
        </Popover>

        {/* Date range */}
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={filters.dateFrom ?? ''}
            onChange={(e) => setFilters({ dateFrom: e.target.value || null })}
            className={cn(
              'rounded-lg border px-2.5 py-2 text-xs transition-colors',
              'border-slate-200 bg-white text-slate-600',
              'dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-300',
              '[color-scheme:light] dark:[color-scheme:dark]',
              'hover:border-slate-300 dark:hover:border-slate-600',
              'focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20',
              filters.dateFrom && 'border-emerald-300 dark:border-emerald-700/60'
            )}
            aria-label="Filter from date"
            max={filters.dateTo ?? undefined}
          />
          <span className="text-xs text-slate-400 dark:text-slate-600">–</span>
          <input
            type="date"
            value={filters.dateTo ?? ''}
            onChange={(e) => setFilters({ dateTo: e.target.value || null })}
            className={cn(
              'rounded-lg border px-2.5 py-2 text-xs transition-colors',
              'border-slate-200 bg-white text-slate-600',
              'dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-300',
              '[color-scheme:light] dark:[color-scheme:dark]',
              'hover:border-slate-300 dark:hover:border-slate-600',
              'focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20',
              filters.dateTo && 'border-emerald-300 dark:border-emerald-700/60'
            )}
            aria-label="Filter to date"
            min={filters.dateFrom ?? undefined}
          />
        </div>

        {/* Group by */}
        <select
          value={filters.groupBy}
          onChange={(e) => setFilters({ groupBy: e.target.value as GroupBy })}
          className={cn(
            'rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors',
            'border-slate-200 bg-white text-slate-600',
            'dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-300',
            'hover:border-slate-300 dark:hover:border-slate-600',
            'focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20',
            filters.groupBy !== 'none' && 'border-emerald-300 dark:border-emerald-700/60'
          )}
          aria-label="Group transactions by"
        >
          {GROUP_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}