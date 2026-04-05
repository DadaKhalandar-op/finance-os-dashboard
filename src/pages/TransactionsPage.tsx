import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import PageTransition from '@/components/ui/PageTransition';
import FilterBar from '@/components/transactions/FilterBar';
import ExportMenu from '@/components/transactions/ExportMenu';
import TransactionTable from '@/components/transactions/TransactionTable';
import SkeletonTable from '@/components/ui/SkeletonTable';
import { TransactionModal, DeleteConfirmDialog } from '@/components/modals/TransactionModal';

// ─── Transactions Page ────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const role                = useAppStore((s) => s.role);
  const transactionsLoading = useAppStore((s) => s.transactionsLoading);
  const totalCount          = useAppStore((s) => s.transactions.length);
  const openModal           = useAppStore((s) => s.openModal);

  const isAdmin = role === 'admin';

  return (
    <PageTransition>
      <div className="space-y-5">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-syne text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Transactions
            </h1>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              {totalCount > 0
                ? `${totalCount.toLocaleString()} records · full history`
                : 'Your transaction history'}
            </p>
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-2">
            <ExportMenu />

            {/* Add button — admin only */}
            <AnimatePresence>
              {isAdmin && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{   opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => openModal('add')}
                  className={[
                    'inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold',
                    'bg-emerald-600 text-white shadow-sm transition-colors hover:bg-emerald-700',
                    'dark:bg-emerald-500 dark:hover:bg-emerald-600',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
                  ].join(' ')}
                  aria-label="Add new transaction"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                  Add Transaction
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Filter Bar ───────────────────────────────────────────────────── */}
        <FilterBar />

        {/* ── Table / Skeleton ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait" initial={false}>
          {transactionsLoading ? (
            <motion.div
              key="skeleton"
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
            >
              <SkeletonTable />
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2 } }}
            >
              <TransactionTable />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Role hint for viewers ─────────────────────────────────────────── */}
        <AnimatePresence>
          {!isAdmin && totalCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{   opacity: 0 }}
              className="text-center text-xs text-slate-400 dark:text-slate-600"
            >
              Switch to <span className="font-semibold">Admin</span> in the sidebar to add, edit, or delete transactions.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Portalled Modals ───────────────────────────────────────────────── */}
      {/*
       * Rendered outside the main content flow so they sit above everything.
       * shadcn Dialog/AlertDialog portals to document.body automatically.
       */}
      <TransactionModal />
      <DeleteConfirmDialog />
    </PageTransition>
  );
}