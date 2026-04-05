import { useState, useEffect, useId } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { ALL_CATEGORIES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types';
import type { TransactionType, TransactionCategory, TransactionFormPayload } from '@/types';
import { todayAsInputValue } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';

// ─── Form State ───────────────────────────────────────────────────────────────

interface FormState {
  type:        TransactionType;
  date:        string;
  description: string;
  category:    TransactionCategory | '';
  amount:      string;
}

interface FormErrors {
  description?: string;
  amount?:      string;
  date?:        string;
  category?:    string;
}

const DEFAULT_FORM: FormState = {
  type:        'expense',
  date:        todayAsInputValue(),
  description: '',
  category:    '',
  amount:      '',
};

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(state: FormState): FormErrors {
  const errs: FormErrors = {};
  if (!state.description.trim() || state.description.trim().length < 2) {
    errs.description = 'Description must be at least 2 characters.';
  }
  if (!state.date) {
    errs.date = 'Please select a date.';
  }
  if (!state.category) {
    errs.category = 'Please select a category.';
  }
  const parsed = parseFloat(state.amount);
  if (!state.amount || isNaN(parsed) || parsed <= 0) {
    errs.amount = 'Amount must be a positive number.';
  } else if (parsed > 1_000_000) {
    errs.amount = 'Amount seems too large. Please check.';
  }
  return errs;
}

// ─── Input wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label:    string;
  htmlFor:  string;
  error?:   string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[11px] font-medium text-rose-500 dark:text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError?: boolean) =>
  cn(
    'w-full rounded-lg border px-3 py-2.5 text-sm transition-colors',
    'bg-white text-slate-900 placeholder:text-slate-400',
    'dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-600',
    'focus:outline-none focus:ring-2',
    hasError
      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-400/20 dark:border-rose-700/60'
      : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20 dark:border-slate-700/80 dark:focus:border-emerald-500'
  );

// ─── Transaction Form ─────────────────────────────────────────────────────────

export default function TransactionForm() {
  const modal          = useAppStore((s) => s.modal);
  const mutationLoading = useAppStore((s) => s.mutationLoading);
  const addTransaction  = useAppStore((s) => s.addTransaction);
  const updateTransaction = useAppStore((s) => s.updateTransaction);
  const closeModal      = useAppStore((s) => s.closeModal);

  const isEdit = modal.mode === 'edit' && modal.editingTransaction !== null;
  const uid    = useId();

  // ── Form initialisation ────────────────────────────────────────────────────

  const [form, setForm] = useState<FormState>(() => {
    if (isEdit && modal.editingTransaction) {
      const tx = modal.editingTransaction;
      return {
        type:        tx.type,
        date:        tx.date,
        description: tx.description,
        category:    tx.category,
        amount:      String(tx.amount),
      };
    }
    return DEFAULT_FORM;
  });

  const [errors, setErrors]         = useState<FormErrors>({});
  const [submitted, setSubmitted]   = useState(false);

  // Re-initialise when the modal opens for a different transaction
  useEffect(() => {
    if (modal.isOpen) {
      if (isEdit && modal.editingTransaction) {
        const tx = modal.editingTransaction;
        setForm({
          type:        tx.type,
          date:        tx.date,
          description: tx.description,
          category:    tx.category,
          amount:      String(tx.amount),
        });
      } else {
        setForm(DEFAULT_FORM);
      }
      setErrors({});
      setSubmitted(false);
    }
  }, [modal.isOpen, modal.editingTransaction, isEdit]);

  // ── Derived ───────────────────────────────────────────────────────────────

  const categoryOptions =
    form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Re-validate on every change once the user has submitted once
  useEffect(() => {
    if (submitted) setErrors(validate(form));
  }, [form, submitted]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleTypeChange = (type: TransactionType) => {
    // Reset category if it doesn't belong to the new type
    const validCategories: readonly string[] =
      type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setForm((prev) => ({
      ...prev,
      type,
      category: validCategories.includes(prev.category) ? prev.category : '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload: TransactionFormPayload = {
      type:        form.type,
      date:        form.date,
      description: form.description.trim(),
      category:    form.category as TransactionCategory,
      amount:      parseFloat(form.amount),
    };

    if (isEdit && modal.editingTransaction) {
      await updateTransaction(modal.editingTransaction.id, payload);
    } else {
      await addTransaction(payload);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      {/* ── Type toggle ───────────────────────────────────────────────────── */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Transaction Type
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(['income', 'expense'] as const).map((t) => {
            const active = form.type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  t === 'income'
                    ? active
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-emerald-500 dark:border-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'border-slate-200 bg-white text-slate-400 hover:border-emerald-300 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-emerald-700'
                    : active
                    ? 'border-rose-400 bg-rose-50 text-rose-700 ring-rose-400 dark:border-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                    : 'border-slate-200 bg-white text-slate-400 hover:border-rose-300 hover:text-rose-500 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-rose-700'
                )}
                aria-pressed={active}
              >
                <span className="text-base">{t === 'income' ? '↑' : '↓'}</span>
                {t === 'income' ? 'Income' : 'Expense'}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Date + Description ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date" htmlFor={`${uid}-date`} error={errors.date}>
          <input
            id={`${uid}-date`}
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            className={cn(inputClass(!!errors.date), '[color-scheme:light] dark:[color-scheme:dark]')}
            required
          />
        </Field>
        <Field label="Description" htmlFor={`${uid}-desc`} error={errors.description}>
          <input
            id={`${uid}-desc`}
            type="text"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="e.g. Whole Foods"
            className={inputClass(!!errors.description)}
            maxLength={80}
            required
          />
        </Field>
      </div>

      {/* ── Category + Amount ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category" htmlFor={`${uid}-cat`} error={errors.category}>
          <select
            id={`${uid}-cat`}
            value={form.category}
            onChange={(e) => set('category', e.target.value as TransactionCategory)}
            className={inputClass(!!errors.category)}
            required
          >
            <option value="" disabled>Select…</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </Field>
        <Field label="Amount (USD)" htmlFor={`${uid}-amt`} error={errors.amount}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500">
              $
            </span>
            <input
              id={`${uid}-amt`}
              type="number"
              inputMode="decimal"
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className={cn(inputClass(!!errors.amount), 'pl-7')}
              required
            />
          </div>
        </Field>
      </div>

      {/* ── Store error ───────────────────────────────────────────────────── */}
      {/* (API-level errors from the store, e.g. network failure) */}
      {useAppStore.getState().error && !mutationLoading && (
        <p className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
          {useAppStore.getState().error}
        </p>
      )}

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={closeModal}
          disabled={mutationLoading}
          className={[
            'rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
            'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
            'dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800',
            'disabled:cursor-not-allowed disabled:opacity-50',
          ].join(' ')}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={mutationLoading}
          className={[
            'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors',
            'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700',
            'dark:bg-emerald-500 dark:hover:bg-emerald-600',
            'disabled:cursor-not-allowed disabled:opacity-60',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
          ].join(' ')}
        >
          {mutationLoading && (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          )}
          {mutationLoading
            ? isEdit ? 'Saving…' : 'Adding…'
            : isEdit ? 'Save Changes' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
}