import type { Transaction } from '../../types';

// ─── Internal Helpers ─────────────────────────────────────────────────────────

function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href:     url,
    download: filename,
    style:    'display:none',
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 150);
}

/**
 * Wraps a value in double-quotes if it contains a comma, quote, or newline.
 * Inner quotes are doubled per RFC 4180.
 */
function csvField(value: string | number): string {
  const str = String(value);
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Exports a transaction list to a UTF-8 CSV file with a BOM so Excel
 * opens it without a "convert text" prompt.
 * Signed amounts: income is positive, expenses are negative.
 */
export function exportToCSV(
  transactions: Transaction[],
  filename = 'transactions'
): void {
  const BOM     = '\uFEFF';
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (USD)', 'ID'];

  const rows = transactions.map((t) => [
    csvField(t.date),
    csvField(t.description),
    csvField(t.category),
    csvField(t.type),
    csvField(t.type === 'expense' ? -t.amount : t.amount),
    csvField(t.id),
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  downloadBlob(BOM + csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Exports a transaction list to a formatted JSON file.
 * Includes metadata (exportedAt, count) and signed amounts.
 */
export function exportToJSON(
  transactions: Transaction[],
  filename = 'transactions'
): void {
  const payload = {
    exportedAt:   new Date().toISOString(),
    count:        transactions.length,
    transactions: transactions.map((t) => ({
      id:           t.id,
      date:         t.date,
      description:  t.description,
      category:     t.category,
      type:         t.type,
      amount:       t.amount,
      signedAmount: t.type === 'expense' ? -t.amount : t.amount,
      createdAt:    t.createdAt,
    })),
  };

  downloadBlob(
    JSON.stringify(payload, null, 2),
    `${filename}.json`,
    'application/json'
  );
}