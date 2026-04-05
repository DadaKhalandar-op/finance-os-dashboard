// ─── Currency ────────────────────────────────────────────────────────────────

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  
  const currencyFormatterDecimal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  export const formatCurrency = (amount: number): string =>
    currencyFormatter.format(amount);
  
  export const formatCurrencyDecimal = (amount: number): string =>
    currencyFormatterDecimal.format(amount);
  
  export const formatCurrencyCompact = (amount: number): string => {
    if (Math.abs(amount) >= 1_000_000)
      return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (Math.abs(amount) >= 1_000)
      return `$${(amount / 1_000).toFixed(1)}K`;
    return currencyFormatter.format(amount);
  };
  
  // ─── Dates ───────────────────────────────────────────────────────────────────
  
  /**
   * Parses a "YYYY-MM-DD" string as local time (avoids UTC midnight shift).
   */
  export const parseLocalDate = (dateStr: string): Date => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  
  export const formatDate = (dateStr: string): string =>
    parseLocalDate(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  
  export const formatDateShort = (dateStr: string): string =>
    parseLocalDate(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  
  export const formatDateInput = (dateStr: string): string => dateStr; // Already "YYYY-MM-DD"
  
  export const todayAsInputValue = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };
  
  // ─── Numbers ─────────────────────────────────────────────────────────────────
  
  export const formatPercent = (value: number, decimals = 1): string =>
    `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
  
  export const formatPercentAbs = (value: number, decimals = 1): string =>
    `${value.toFixed(decimals)}%`;