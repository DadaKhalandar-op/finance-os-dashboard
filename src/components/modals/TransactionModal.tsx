import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAppStore } from '@/store/useAppStore';
import TransactionForm from './TransactionForm';

// ─── Transaction Add/Edit Dialog ──────────────────────────────────────────────

export function TransactionModal() {
  const modal      = useAppStore((s) => s.modal);
  const closeModal = useAppStore((s) => s.closeModal);

  const isEdit = modal.mode === 'edit';
  const title  = isEdit ? 'Edit Transaction' : 'Add Transaction';
  const desc   = isEdit
    ? 'Update the details of this transaction.'
    : 'Record a new income or expense transaction.';

  return (
    <Dialog open={modal.isOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
      <DialogContent
  className={[
    'max-w-md rounded-2xl border-slate-200 bg-white p-0 shadow-xl',
    'dark:border-slate-700/80 dark:bg-slate-900',
    // Hide shadcn's auto-generated close button — we render our own in DialogHeader
    '[&>button:last-child]:hidden',
  ].join(' ')}
>
        {/* ── Modal header ──────────────────────────────────────────────── */}
        <DialogHeader className="flex flex-row items-start justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800/60">
          <div>
            <DialogTitle className="font-syne text-base font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
              {desc}
            </DialogDescription>
          </div>
          <button
            onClick={closeModal}
            className={[
              'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
              'text-slate-400 hover:bg-slate-100 hover:text-slate-600',
              'dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
            ].join(' ')}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        {/* ── Form body ─────────────────────────────────────────────────── */}
        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {modal.isOpen && (
              <motion.div
                key={modal.isOpen ? (modal.editingTransaction?.id ?? 'add') : 'closed'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{   opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <TransactionForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirmation AlertDialog ─────────────────────────────────────────

export function DeleteConfirmDialog() {
  const deleteConfirm    = useAppStore((s) => s.deleteConfirm);
  const closeDeleteConfirm = useAppStore((s) => s.closeDeleteConfirm);
  const deleteTransaction  = useAppStore((s) => s.deleteTransaction);
  const mutationLoading    = useAppStore((s) => s.mutationLoading);

  const handleConfirm = async () => {
    if (!deleteConfirm.transactionId) return;
    await deleteTransaction(deleteConfirm.transactionId);
    // Store closes `deleteConfirm` itself after deletion completes.
  };

  return (
    <AlertDialog
      open={deleteConfirm.isOpen}
      onOpenChange={(open) => { if (!open) closeDeleteConfirm(); }}
    >
      <AlertDialogContent
        className={[
          'max-w-sm rounded-2xl border-slate-200 bg-white shadow-xl',
          'dark:border-slate-700/80 dark:bg-slate-900',
        ].join(' ')}
      >
        <AlertDialogHeader>
          {/* Warning icon */}
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
            <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>

          <AlertDialogTitle className="text-center font-syne text-base font-semibold text-slate-900 dark:text-slate-100">
            Delete transaction?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center text-sm text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              &ldquo;{deleteConfirm.transactionDescription}&rdquo;
            </span>{' '}
            will be permanently removed. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2 flex justify-center gap-2">
          <AlertDialogCancel
            onClick={closeDeleteConfirm}
            disabled={mutationLoading}
            className={[
              'rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600',
              'transition-colors hover:bg-slate-50',
              'dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800',
              'disabled:opacity-50',
            ].join(' ')}
          >
            Cancel
          </AlertDialogCancel>

          <button
            onClick={handleConfirm}
            disabled={mutationLoading}
            className={[
              'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold',
              'bg-rose-600 text-white shadow-sm transition-colors hover:bg-rose-700',
              'dark:bg-rose-500 dark:hover:bg-rose-600',
              'disabled:cursor-not-allowed disabled:opacity-60',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2',
            ].join(' ')}
          >
            {mutationLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                Deleting…
              </>
            ) : (
              'Delete'
            )}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}