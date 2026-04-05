import type { Transaction, Insight, TransactionCategory } from '../../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isoMonth = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

const fmt = (n: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);

const pct = (n: number): string =>
  `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;

// ─── Engine ───────────────────────────────────────────────────────────────────

export function computeInsights(transactions: Transaction[]): Insight[] {
  if (transactions.length === 0) return [];

  const now = new Date();
  const currentMonthKey = isoMonth(now);
  const lastMonthKey = isoMonth(
    new Date(now.getFullYear(), now.getMonth() - 1, 1)
  );

  const currentMonthTx = transactions.filter((t) =>
    t.date.startsWith(currentMonthKey)
  );
  const lastMonthTx = transactions.filter((t) =>
    t.date.startsWith(lastMonthKey)
  );

  const currentExpenses = currentMonthTx
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const lastExpenses = lastMonthTx
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const allIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const allExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const insights: Insight[] = [];

  // ── 1. Top spending category ───────────────────────────────────────────────
  const refTx = currentExpenses > 0 ? currentMonthTx : lastMonthTx;
  const categoryMap = new Map<TransactionCategory, number>();
  for (const t of refTx) {
    if (t.type !== 'expense') continue;
    categoryMap.set(t.category, (categoryMap.get(t.category) ?? 0) + t.amount);
  }

  if (categoryMap.size > 0) {
    const [topCategory, topAmount] = [...categoryMap.entries()].sort(
      (a, b) => b[1] - a[1]
    )[0];
    const label = currentExpenses > 0 ? 'this month' : 'last month';
    insights.push({
      id: 'top-category',
      title: 'Top Spending Category',
      value: topCategory,
      subtext: `${fmt(topAmount)} ${label}`,
      trend: 'neutral',
      sentiment: 'neutral',
      iconName: 'Tag',
    });
  }

  // ── 2. Month-over-month expense change ────────────────────────────────────
  if (lastExpenses > 0) {
    const change = ((currentExpenses - lastExpenses) / lastExpenses) * 100;
    // Spending UP is negative (bad); spending DOWN is positive (good).
    const sentiment =
      change > 5 ? 'negative' : change < -5 ? 'positive' : 'neutral';

    insights.push({
      id: 'mom-change',
      title: 'Spending vs Last Month',
      value: pct(change),
      subtext: `Last month: ${fmt(lastExpenses)}`,
      trend: change > 5 ? 'up' : change < -5 ? 'down' : 'neutral',
      sentiment,
      iconName: change >= 0 ? 'TrendingUp' : 'TrendingDown',
    });
  }

  // ── 3. Overall savings rate ───────────────────────────────────────────────
  if (allIncome > 0) {
    const savingsRate = ((allIncome - allExpenses) / allIncome) * 100;
    const netSaved = allIncome - allExpenses;
    const sentiment =
      savingsRate > 20 ? 'positive' : savingsRate > 0 ? 'neutral' : 'negative';

    insights.push({
      id: 'savings-rate',
      title: 'Overall Savings Rate',
      value: `${Math.max(0, savingsRate).toFixed(1)}%`,
      subtext: `${fmt(netSaved)} net accumulated`,
      trend: savingsRate > 20 ? 'up' : savingsRate > 0 ? 'neutral' : 'down',
      sentiment,
      iconName: 'PiggyBank',
    });
  }

  // ── 4. Largest single expense ─────────────────────────────────────────────
  const allExpenseTx = transactions.filter((t) => t.type === 'expense');
  if (allExpenseTx.length > 0) {
    const biggest = allExpenseTx.reduce((max, t) =>
      t.amount > max.amount ? t : max
    );
    insights.push({
      id: 'largest-expense',
      title: 'Largest Single Expense',
      value: fmt(biggest.amount),
      subtext: biggest.description,
      trend: 'neutral',
      sentiment: 'neutral',
      iconName: 'AlertCircle',
    });
  }

  return insights;
}