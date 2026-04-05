import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { CategoryBadge, TypeBadge } from '@/components/ui/TransactionBadge';
import EmptyState from './EmptyState';
import { formatDate, formatCurrencyDecimal } from '@/lib/utils/formatters';
import type {
  Transaction,
  TransactionSortKey,
  SortDir,
  GroupBy,
} from '@/types';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GroupedSection {
  key:          string;
  label:        string;
  transactions: Transaction[];
  netAmount:    number;
}

// ─── Grouping ─────────────────────────────────────────────────────────────────

function buildGroups(
  transactions: Transaction[],
  groupBy: GroupBy
): GroupedSection[] {
  if (groupBy === 'none') {
    return [{ key: '__all', label: '', transactions, netAmount: 0 }];
  }

  const map = new Map<string, Transaction[]>();

  for (const tx of transactions) {
    const key =
      groupBy === 'month'
        ? tx.date.substring(0, 7)
        : groupBy === 'category'
        ? tx.category
        : tx.type;

    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(tx);
  }

  return Array.from(map.entries()).map(([key, txs]) => {
    const income   = txs.filter((t) => t.type === 'income').reduce((s, t)  => s + t.amount, 0);
    const expenses = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    let label: string;
    if (groupBy === 'month') {
      const [y, m] = key.split('-').map(Number);
      label = new Date(y, m - 1, 1).toLocaleDateString('en-US', {
        month: 'long',
        year:  'numeric',
      });
    } else if (groupBy === 'type') {
      label = key === 'income' ? 'Income' : 'Expenses';
    } else {
      label = key;
    }

    return { key, label, transactions: txs, netAmount: income - expenses };
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SortIcon({
  column,
  active,
  dir,
}: {
  column: TransactionSortKey;
  active: TransactionSortKey;
  dir: SortDir;
}) {
  if (column !== active) {
    return <ChevronsUpDown className="h-3 w-3 text-slate-300 dark:text-slate-600" />;
  }
  return dir === 'asc'
    ? <ChevronUp className="h-3 w-3 text-emerald-500" />
    : <ChevronDown className="h-3 w-3 text-emerald-500" />;
}

function GroupHeader({
  label,
  transactions,
  netAmount,
  colSpan,
}: {
  label:        string;
  transactions: Transaction[];
  netAmount:    number;
  colSpan:      number;
}) {
  const isPositive = netAmount >= 0;

  return (
    <tr>
      <td
        colSpan={colSpan}
        className={[
          'border-b border-t border-slate-100 bg-slate-50/80 px-5 py-2.5',
          'dark:border-slate-800/60 dark:bg-slate-800/30',
        ].join(' ')}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-400 dark:text-slate-500">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </span>
            <span
              className={cn(
                'font-semibold tabular-nums',
                isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-500   dark:text-rose-400'
              )}
            >
              {isPositive ? '+' : ''}
              {formatCurrencyDecimal(netAmount)}
            </span>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── Row animation variants ───────────────────────────────────────────────────

const rowVariants = {
  hidden: { opacity: 0, y: -8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration:   0.22,
      delay:      Math.min(i * 0.03, 0.3),
      ease:       [0.25, 0.1, 0.25, 1] as const,
    },
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.14 },
  },
};

// ─── Transaction Row ──────────────────────────────────────────────────────────

const TransactionRow = ({
  tx,
  index,
  isAdmin,
  onEdit,
  onDelete,
}: {
  tx:       Transaction;
  index:    number;
  isAdmin:  boolean;
  onEdit:   (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}) => {
  const isIncome = tx.type === 'income';

  return (
    <motion.tr
      key={tx.id}
      custom={index}
      variants={rowVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      layout="position"
      className={[
        'group border-b border-slate-50 transition-colors last:border-0',
        'dark:border-slate-800/40',
        'hover:bg-slate-50/80 dark:hover:bg-slate-800/30',
      ].join(' ')}
    >
      {/* Date */}
      <td className="w-[110px] whitespace-nowrap px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
        {formatDate(tx.date)}
      </td>

      {/* Description */}
      <td className="px-3 py-3.5">
        <p className="max-w-xs truncate text-sm font-medium text-slate-800 dark:text-slate-200">
          {tx.description}
        </p>
      </td>

      {/* Category */}
      <td className="w-[130px] px-3 py-3.5">
        <CategoryBadge category={tx.category} />
      </td>

      {/* Type */}
      <td className="w-[100px] px-3 py-3.5">
        <TypeBadge type={tx.type} />
      </td>

      {/* Amount */}
      <td className="w-[120px] px-3 py-3.5 pr-5 text-right">
        <span
          className={cn(
            'text-sm font-semibold tabular-nums',
            isIncome
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-900   dark:text-slate-100'
          )}
        >
          {isIncome ? '+' : '-'}
          {formatCurrencyDecimal(tx.amount)}
        </span>
      </td>

      {/* Admin actions */}
      {isAdmin && (
        <td className="w-[72px] py-3.5 pr-4 text-right">
          <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <button
              onClick={() => onEdit(tx)}
              className={[
                'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                'text-slate-400 hover:bg-blue-50 hover:text-blue-600',
                'dark:text-slate-500 dark:hover:bg-blue-900/30 dark:hover:text-blue-400',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
              ].join(' ')}
              aria-label={`Edit ${tx.description}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(tx)}
              className={[
                'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                'text-slate-400 hover:bg-rose-50 hover:text-rose-600',
                'dark:text-slate-500 dark:hover:bg-rose-900/30 dark:hover:text-rose-400',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400',
              ].join(' ')}
              aria-label={`Delete ${tx.description}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </td>
      )}
    </motion.tr>
  );
};

// ─── Transaction Table ────────────────────────────────────────────────────────

export default function TransactionTable() {
  const role                 = useAppStore((s) => s.role);
  const filters              = useAppStore((s) => s.filters);
  const transactions         = useAppStore((s) => s.transactions);
  const getFilteredTransactions = useAppStore((s) => s.getFilteredTransactions);
  const setFilters           = useAppStore((s) => s.setFilters);
  const openModal            = useAppStore((s) => s.openModal);
  const openDeleteConfirm    = useAppStore((s) => s.openDeleteConfirm);

  const isAdmin    = role === 'admin';
  const colSpan    = isAdmin ? 6 : 5;

  // Track sort changes for a brief fade effect on re-sort
  const [sortVersion, setSortVersion] = useState(0);

  const filtered = getFilteredTransactions();
  const grouped  = useMemo(
    () => buildGroups(filtered, filters.groupBy),
    [filtered, filters.groupBy]
  );
  const hasTransactions = transactions.length > 0;

  // ── Sort handler ─────────────────────────────────────────────────────────

  const handleSort = useCallback(
    (key: TransactionSortKey) => {
      const newDir: SortDir =
        filters.sortBy === key && filters.sortDir === 'desc' ? 'asc' : 'desc';
      setFilters({ sortBy: key, sortDir: newDir });
      setSortVersion((v) => v + 1);
    },
    [filters.sortBy, filters.sortDir, setFilters]
  );

  // ── RBAC handlers ─────────────────────────────────────────────────────────

  const handleEdit = useCallback(
    (tx: Transaction) => { if (isAdmin) openModal('edit', tx); },
    [isAdmin, openModal]
  );

  const handleDelete = useCallback(
    (tx: Transaction) => {
      if (isAdmin) openDeleteConfirm(tx.id, tx.description);
    },
    [isAdmin, openDeleteConfirm]
  );

  // ── Sortable column header ────────────────────────────────────────────────

  const Th = ({
    colKey,
    label,
    className,
  }: {
    colKey?: TransactionSortKey;
    label:   string;
    className?: string;
  }) => (
    <th
      scope="col"
      onClick={colKey ? () => handleSort(colKey) : undefined}
      className={cn(
        'px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider',
        'text-slate-400 dark:text-slate-500',
        colKey && 'cursor-pointer select-none hover:text-slate-600 dark:hover:text-slate-300',
        className
      )}
    >
      <div className="flex items-center gap-1">
        {label}
        {colKey && (
          <SortIcon column={colKey} active={filters.sortBy} dir={filters.sortDir} />
        )}
      </div>
    </th>
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      className={[
        'overflow-hidden rounded-2xl border border-slate-200 bg-white',
        'shadow-sm shadow-slate-200/50',
        'dark:border-slate-800/80 dark:bg-slate-900/60 dark:shadow-none',
      ].join(' ')}
    >
      {/* ── Empty states ──────────────────────────────────────────────────── */}
      {!hasTransactions ? (
        <EmptyState variant="no-data" />
      ) : filtered.length === 0 ? (
        <EmptyState variant="no-results" />
      ) : (
        /* ── Table ──────────────────────────────────────────────────────── */
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/60">
                <Th colKey="date"        label="Date"        className="pl-5 w-[110px]" />
                <Th colKey="description" label="Description"                            />
                <Th colKey="category"    label="Category"    className="w-[130px]"      />
                <Th                      label="Type"         className="w-[100px]"      />
                <Th colKey="amount"      label="Amount"      className="w-[120px] pr-5 text-right" />
                {isAdmin && (
                  <th scope="col" className="w-[72px] py-3 pr-4 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody
              key={sortVersion}  /* Re-key on sort → triggers staggered re-enter */
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {grouped.length === 1 && grouped[0].key === '__all'
                  ? /* No grouping — flat row list */
                    filtered.map((tx, i) => (
                      <TransactionRow
                        key={tx.id}
                        tx={tx}
                        index={i}
                        isAdmin={isAdmin}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))
                  : /* Grouped sections */
                    grouped.flatMap((section) => [
                      <GroupHeader
                        key={`group-${section.key}`}
                        label={section.label}
                        transactions={section.transactions}
                        netAmount={section.netAmount}
                        colSpan={colSpan}
                      />,
                      ...section.transactions.map((tx, i) => (
                        <TransactionRow
                          key={tx.id}
                          tx={tx}
                          index={i}
                          isAdmin={isAdmin}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      )),
                    ])}
              </AnimatePresence>
            </tbody>

            {/* Footer: total row */}
            {filtered.length > 0 && (
              <tfoot>
                <tr className="border-t border-slate-100 bg-slate-50/80 dark:border-slate-800/60 dark:bg-slate-800/20">
                  <td
                    colSpan={colSpan - 1}
                    className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                  >
                    {filtered.length.toLocaleString()} transaction{filtered.length !== 1 ? 's' : ''}
                  </td>
                  <td className="pr-5 py-3 text-right">
                    {(() => {
                      const net =
                        filtered.reduce((s, t) =>
                          t.type === 'income' ? s + t.amount : s - t.amount, 0);
                      const isPos = net >= 0;
                      return (
                        <span className={cn(
                          'text-sm font-bold tabular-nums',
                          isPos ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-500   dark:text-rose-400'
                        )}>
                          {isPos ? '+' : ''}{formatCurrencyDecimal(net)}
                        </span>
                      );
                    })()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}