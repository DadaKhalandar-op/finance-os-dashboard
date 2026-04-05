import type {
    Transaction,
    DashboardSummary,
    MonthlySummary,
    CategoryBreakdown,
    TransactionCategory,
  } from '../../types';
  
  // ─── Category Color Map ───────────────────────────────────────────────────────
  // Colors chosen to look crisp on both light and dark Recharts canvases.
  
  export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
    Salary:        '#10b981',   // emerald-500
    Investment:    '#6366f1',   // indigo-500
    Food:          '#f59e0b',   // amber-500
    Transport:     '#3b82f6',   // blue-500
    Shopping:      '#ec4899',   // pink-500
    Entertainment: '#8b5cf6',   // violet-500
    Health:        '#ef4444',   // red-500
    Housing:       '#0ea5e9',   // sky-500
    Other:         '#6b7280',   // gray-500
  };
  
  // ─── Core Computation ─────────────────────────────────────────────────────────
  
  export function computeSummary(transactions: Transaction[]): DashboardSummary {
    // ── Totals ────────────────────────────────────────────────────────────────
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  
    const totalBalance = totalIncome - totalExpenses;
  
    // ── Monthly Trend (last 12 months, relative to today) ────────────────────
    const now = new Date();
  
    // Build an ordered map keyed by "YYYY-MM" for the last 12 months
    const monthlyMap = new Map<string, { income: number; expenses: number }>();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap.set(key, { income: 0, expenses: 0 });
    }
  
    // Accumulate transactions into their month buckets
    for (const t of transactions) {
      const key = t.date.substring(0, 7); // "YYYY-MM"
      if (monthlyMap.has(key)) {
        const bucket = monthlyMap.get(key)!;
        if (t.type === 'income') bucket.income += t.amount;
        else bucket.expenses += t.amount;
      }
    }
  
    const monthlyTrend: MonthlySummary[] = Array.from(monthlyMap.entries()).map(
      ([key, data]) => {
        const [year, month] = key.split('-').map(Number);
        const label = new Date(year, month - 1, 1).toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        });
        return {
          month: label,
          income: data.income,
          expenses: data.expenses,
          balance: data.income - data.expenses,
        };
      }
    );
  
    // ── Category Breakdown (expenses only) ───────────────────────────────────
    const expenseTotals = new Map<TransactionCategory, number>();
  
    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      expenseTotals.set(t.category, (expenseTotals.get(t.category) ?? 0) + t.amount);
    }
  
    const categoryBreakdown: CategoryBreakdown[] = Array.from(expenseTotals.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        color: CATEGORY_COLORS[category],
      }))
      .sort((a, b) => b.amount - a.amount);
  
    return {
      totalBalance,
      totalIncome,
      totalExpenses,
      monthlyTrend,
      categoryBreakdown,
      transactionCount: transactions.length,
    };
  }