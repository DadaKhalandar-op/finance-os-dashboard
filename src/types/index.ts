// ─── Primitive Types ──────────────────────────────────────────────────────────

export type Role = 'viewer' | 'admin';
export type Theme = 'light' | 'dark';
export type TransactionType = 'income' | 'expense';
export type SortDir = 'asc' | 'desc';
export type GroupBy = 'none' | 'category' | 'month' | 'type';
export type TransactionSortKey = 'date' | 'amount' | 'description' | 'category';

export type TransactionCategory =
  | 'Salary'
  | 'Investment'
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Health'
  | 'Housing'
  | 'Other';

// ─── Constants ────────────────────────────────────────────────────────────────

export const ALL_CATEGORIES: TransactionCategory[] = [
  'Salary', 'Investment', 'Food', 'Transport',
  'Shopping', 'Entertainment', 'Health', 'Housing', 'Other',
];

export const INCOME_CATEGORIES: TransactionCategory[] = ['Salary', 'Investment'];

export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  'Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Housing', 'Other',
];

// ─── Core Entity ──────────────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  date: string;         // "YYYY-MM-DD"
  description: string;
  amount: number;       // Always positive; type field determines sign
  category: TransactionCategory;
  type: TransactionType;
  createdAt: string;    // ISO 8601 timestamp
}

/**
 * The shape used when submitting the Add/Edit form.
 * id and createdAt are generated server-side (mock API).
 */
export type TransactionFormPayload = Omit<Transaction, 'id' | 'createdAt'>;

// ─── Dashboard / Derived Shapes ───────────────────────────────────────────────

export interface MonthlySummary {
  month: string;    // e.g. "Apr '25"
  income: number;
  expenses: number;
  balance: number;
}

export interface CategoryBreakdown {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  color: string;    // Hex for Recharts
}

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyTrend: MonthlySummary[];
  categoryBreakdown: CategoryBreakdown[];
  transactionCount: number;
}

export interface Insight {
  id: string;
  title: string;
  value: string;
  subtext: string;
  trend: 'up' | 'down' | 'neutral';
  /** Semantic color signal — decoupled from direction so "expenses up" can be 'negative'
   *  while "savings rate up" is 'positive', even though both have trend: 'up'. */
  sentiment: 'positive' | 'negative' | 'neutral';
  iconName: string;
}

// ─── UI / Filter State ────────────────────────────────────────────────────────

export interface FilterState {
  search: string;
  dateFrom: string | null;    // "YYYY-MM-DD" or null
  dateTo: string | null;      // "YYYY-MM-DD" or null
  categories: TransactionCategory[];
  type: TransactionType | 'all';
  groupBy: GroupBy;
  sortBy: TransactionSortKey;
  sortDir: SortDir;
}

export interface ModalState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  editingTransaction: Transaction | null;
}

export interface DeleteConfirmState {
  isOpen: boolean;
  transactionId: string | null;
  transactionDescription: string | null;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  code?: string;
}