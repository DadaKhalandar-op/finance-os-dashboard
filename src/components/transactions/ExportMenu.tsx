import { Download, FileText, FileJson, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/store/useAppStore';
import { exportToCSV, exportToJSON } from '@/lib/utils/exportUtils';
import { cn } from '@/lib/utils';

export default function ExportMenu() {
  const getFiltered = useAppStore((s) => s.getFilteredTransactions);

  const handleExport = (format: 'csv' | 'json') => {
    const transactions = getFiltered();
    const timestamp    = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const filename     = `transactions-${timestamp}`;
    if (format === 'csv')  exportToCSV(transactions,  filename);
    if (format === 'json') exportToJSON(transactions, filename);
  };

  const count = getFiltered().length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
            'border-slate-200 bg-white text-slate-600',
            'dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-300',
            'hover:border-slate-300 hover:text-slate-800',
            'dark:hover:border-slate-600 dark:hover:text-slate-100',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'
          )}
          aria-label="Export transactions"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={[
          'w-52 border-slate-200 bg-white shadow-lg',
          'dark:border-slate-700/80 dark:bg-slate-800',
        ].join(' ')}
      >
        <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {count.toLocaleString()} record{count !== 1 ? 's' : ''}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-700/60" />

        <DropdownMenuItem
          onClick={() => handleExport('csv')}
          className={[
            'flex cursor-pointer items-center gap-2.5 rounded-md',
            'text-slate-700 dark:text-slate-200',
            'focus:bg-slate-50 dark:focus:bg-slate-700/50',
          ].join(' ')}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 dark:bg-emerald-900/30">
            <FileText className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Export as CSV</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              For Excel / spreadsheets
            </p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleExport('json')}
          className={[
            'flex cursor-pointer items-center gap-2.5 rounded-md',
            'text-slate-700 dark:text-slate-200',
            'focus:bg-slate-50 dark:focus:bg-slate-700/50',
          ].join(' ')}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 dark:bg-indigo-900/30">
            <FileJson className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Export as JSON</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              With metadata & signed amounts
            </p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}