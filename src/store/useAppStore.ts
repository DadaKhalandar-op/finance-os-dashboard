import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type {
  Role,
  Theme,
  Transaction,
  DashboardSummary,
  FilterState,
  ModalState,
  DeleteConfirmState,
  TransactionFormPayload,
  Insight,
  TransactionSortKey,
} from '../types';
import { mockApi } from '../services/mockApi';
import { computeInsights } from '../lib/utils/insightEngine';

// ─── Default State Shapes ─────────────────────────────────────────────────────

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  dateFrom: null,
  dateTo: null,
  categories: [],
  type: 'all',
  groupBy: 'none',
  sortBy: 'date' as TransactionSortKey,
  sortDir: 'desc',
};

const DEFAULT_MODAL: ModalState = {
  isOpen: false,
  mode: 'add',
  editingTransaction: null,
};

const DEFAULT_DELETE_CONFIRM: DeleteConfirmState = {
  isOpen: false,
  transactionId: null,
  transactionDescription: null,
};

// ─── Pure Filter / Sort Logic ─────────────────────────────────────────────────

/**
 * Applies all active filters and sort order to a transaction list.
 * Pure function — safe to memoize in selectors.
 */
function applyFilters(
  transactions: Transaction[],
  filters: FilterState
): Transaction[] {
  let result = [...transactions];

  // Text search across description and category
  const query = filters.search.trim().toLowerCase();
  if (query) {
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
    );
  }

  // Date range
  if (filters.dateFrom) {
    result = result.filter((t) => t.date >= filters.dateFrom!);
  }
  if (filters.dateTo) {
    result = result.filter((t) => t.date <= filters.dateTo!);
  }

  // Category multi-select
  if (filters.categories.length > 0) {
    result = result.filter((t) => filters.categories.includes(t.category));
  }

  // Transaction type
  if (filters.type !== 'all') {
    result = result.filter((t) => t.type === filters.type);
  }

  // Sort
  const dir = filters.sortDir === 'asc' ? 1 : -1;
  result.sort((a, b) => {
    const aVal = a[filters.sortBy] as string | number;
    const bVal = b[filters.sortBy] as string | number;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * dir;
    }
    return String(aVal).localeCompare(String(bVal)) * dir;
  });

  return result;
}

// ─── Store Interface ──────────────────────────────────────────────────────────

interface AppStore {
  // ── Persisted across sessions (via localStorage) ──────────────────────────
  role: Role;
  theme: Theme;
  transactions: Transaction[];

  // ── Ephemeral async states ────────────────────────────────────────────────
  summary: DashboardSummary | null;
  summaryLoading: boolean;
  transactionsLoading: boolean;
  mutationLoading: boolean;
  error: string | null;

  // ── UI state ──────────────────────────────────────────────────────────────
  filters: FilterState;
  modal: ModalState;
  deleteConfirm: DeleteConfirmState;
  sidebarOpen: boolean;

  // ── Lifecycle ────────────────────────────────────────────────────────────
  /** Called once on application mount. Fetches seed data on first visit;
   *  hydrates from localStorage on subsequent visits. Always recomputes summary. */
  initializeData: () => Promise<void>;
  /** Recomputes the dashboard summary from the current transaction list. */
  refreshSummary: () => Promise<void>;

  // ── Identity / Preferences ────────────────────────────────────────────────
  setRole: (role: Role) => void;
  toggleTheme: () => void;

  // ── CRUD (Admin-gated) ────────────────────────────────────────────────────
  addTransaction: (payload: TransactionFormPayload) => Promise<void>;
  updateTransaction: (
    id: string,
    payload: Partial<TransactionFormPayload>
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // ── Filters ───────────────────────────────────────────────────────────────
  setFilters: (partial: Partial<FilterState>) => void;
  resetFilters: () => void;

  // ── Modal ─────────────────────────────────────────────────────────────────
  openModal: (mode: 'add' | 'edit', transaction?: Transaction) => void;
  closeModal: () => void;

  // ── Delete Confirmation ───────────────────────────────────────────────────
  openDeleteConfirm: (id: string, description: string) => void;
  closeDeleteConfirm: () => void;

  // ── Layout ────────────────────────────────────────────────────────────────
  setSidebarOpen: (open: boolean) => void;

  // ── Selectors ─────────────────────────────────────────────────────────────
  /** Returns the filtered + sorted transaction list. Cheap to call repeatedly. */
  getFilteredTransactions: () => Transaction[];
  /** Returns dynamic insights derived from the full transaction list. */
  getInsights: () => Insight[];
}

// ─── Persisted slice type ─────────────────────────────────────────────────────

type PersistedState = Pick<AppStore, 'role' | 'theme' | 'transactions'>;

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ── Initial State ───────────────────────────────────────────────────────
      role: 'viewer',
      theme: 'light',
      transactions: [],
      summary: null,
      summaryLoading: false,
      transactionsLoading: false,
      mutationLoading: false,
      error: null,
      filters: DEFAULT_FILTERS,
      modal: DEFAULT_MODAL,
      deleteConfirm: DEFAULT_DELETE_CONFIRM,
      sidebarOpen: false,

      // ── Lifecycle ───────────────────────────────────────────────────────────
      initializeData: async () => {
        const { transactions } = get();

        // First visit — no localStorage data. Fetch seed data from mock API.
        if (transactions.length === 0) {
          set({ transactionsLoading: true, error: null });
          try {
            const fetched = await mockApi.fetchTransactions();
            set({ transactions: fetched, transactionsLoading: false });
          } catch (err) {
            set({
              error:
                err instanceof Error
                  ? err.message
                  : 'Failed to load transactions.',
              transactionsLoading: false,
            });
            return; // Abort — no point computing summary over empty data.
          }
        }

        // Always recompute summary on mount (it is NOT persisted to localStorage).
        await get().refreshSummary();
      },

      refreshSummary: async () => {
        set({ summaryLoading: true });
        try {
          const summary = await mockApi.computeSummary(get().transactions);
          set({ summary, summaryLoading: false });
        } catch (err) {
          set({
            error:
              err instanceof Error
                ? err.message
                : 'Failed to compute summary.',
            summaryLoading: false,
          });
        }
      },

      // ── Role & Theme ────────────────────────────────────────────────────────
      setRole: (role) => set({ role }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      // ── CRUD ────────────────────────────────────────────────────────────────
      addTransaction: async (payload) => {
        if (get().role !== 'admin') {
          set({ error: 'Unauthorized: only admins can add transactions.' });
          return;
        }
        set({ mutationLoading: true, error: null });
        try {
          const newTx = await mockApi.createTransaction(payload);
          set((state) => ({
            transactions: [newTx, ...state.transactions],
            mutationLoading: false,
          }));
          get().closeModal();
          // Fire-and-forget — non-blocking summary refresh after mutation
          void get().refreshSummary();
        } catch (err) {
          set({
            error:
              err instanceof Error
                ? err.message
                : 'Failed to add transaction.',
            mutationLoading: false,
          });
        }
      },

      updateTransaction: async (id, payload) => {
        if (get().role !== 'admin') {
          set({ error: 'Unauthorized: only admins can edit transactions.' });
          return;
        }
        const existing = get().transactions.find((t) => t.id === id);
        if (!existing) {
          set({ error: `Transaction "${id}" not found.` });
          return;
        }
        set({ mutationLoading: true, error: null });
        try {
          const updated = await mockApi.patchTransaction(existing, payload);
          set((state) => ({
            transactions: state.transactions.map((t) =>
              t.id === id ? updated : t
            ),
            mutationLoading: false,
          }));
          get().closeModal();
          void get().refreshSummary();
        } catch (err) {
          set({
            error:
              err instanceof Error
                ? err.message
                : 'Failed to update transaction.',
            mutationLoading: false,
          });
        }
      },

      deleteTransaction: async (id) => {
        if (get().role !== 'admin') {
          set({ error: 'Unauthorized: only admins can delete transactions.' });
          return;
        }
        set({ mutationLoading: true, error: null });
        try {
          await mockApi.removeTransaction(id);
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
            deleteConfirm: DEFAULT_DELETE_CONFIRM,
            mutationLoading: false,
          }));
          void get().refreshSummary();
        } catch (err) {
          set({
            error:
              err instanceof Error
                ? err.message
                : 'Failed to delete transaction.',
            mutationLoading: false,
          });
        }
      },

      // ── Filters ─────────────────────────────────────────────────────────────
      setFilters: (partial) =>
        set((state) => ({ filters: { ...state.filters, ...partial } })),

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      // ── Modal ────────────────────────────────────────────────────────────────
      openModal: (mode, transaction) =>
        set({
          modal: {
            isOpen: true,
            mode,
            editingTransaction: transaction ?? null,
          },
        }),

      closeModal: () => set({ modal: DEFAULT_MODAL }),

      // ── Delete Confirm ───────────────────────────────────────────────────────
      openDeleteConfirm: (id, description) =>
        set({
          deleteConfirm: { isOpen: true, transactionId: id, transactionDescription: description },
        }),

      closeDeleteConfirm: () => set({ deleteConfirm: DEFAULT_DELETE_CONFIRM }),

      // ── Layout ───────────────────────────────────────────────────────────────
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // ── Selectors ────────────────────────────────────────────────────────────
      getFilteredTransactions: () =>
        applyFilters(get().transactions, get().filters),

      getInsights: () => computeInsights(get().transactions),
    }),
    {
      name: 'finance-dashboard-v1',
      storage: createJSONStorage(() => localStorage),
      /**
       * Only persist user-facing preferences and transaction data.
       * Async/loading state, UI state, and derived data (summary, insights)
       * are intentionally excluded — they are always re-derived on mount.
       */
      partialize: (state): PersistedState => ({
        role: state.role,
        theme: state.theme,
        transactions: state.transactions,
      }),
      version: 1,
    }
  )
);