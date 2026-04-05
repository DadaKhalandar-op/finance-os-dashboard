import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-slate-100 dark:bg-slate-800/80',
        className
      )}
    />
  );
}

// Column widths mirror TransactionTable exactly — prevents CLS.
const COL_WIDTHS = ['w-[110px]', 'flex-1', 'w-[130px]', 'w-[100px]', 'w-[120px]'];
const ACTION_COL  = 'w-[72px]';
const ROW_COUNT   = 9;

export default function SkeletonTable() {
  const isAdmin = useAppStore((s) => s.role === 'admin');

  return (
    <div
      className={[
        'rounded-2xl border border-slate-200 bg-white overflow-hidden',
        'shadow-sm shadow-slate-200/50',
        'dark:border-slate-800/80 dark:bg-slate-900/60 dark:shadow-none',
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5 dark:border-slate-800/60">
        {COL_WIDTHS.map((w, i) => (
          <Bone key={i} className={cn('h-3', i === 1 ? 'flex-1 min-w-0' : w)} />
        ))}
        {isAdmin && <Bone className={cn('h-3', ACTION_COL)} />}
      </div>

      {/* Rows */}
      {Array.from({ length: ROW_COUNT }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className={[
            'flex items-center gap-3 px-5 py-4',
            'border-b border-slate-50 last:border-0',
            'dark:border-slate-800/40',
          ].join(' ')}
        >
          {/* Date */}
          <Bone className={cn('h-3 w-20', COL_WIDTHS[0])} />
          {/* Description */}
          <Bone className={cn('h-3 min-w-0 flex-1', rowIdx % 3 === 0 ? 'w-3/5' : rowIdx % 3 === 1 ? 'w-4/5' : 'w-2/5')} />
          {/* Category pill */}
          <div className={cn('flex', COL_WIDTHS[2])}>
            <Bone className="h-5 w-20 rounded-full" />
          </div>
          {/* Type pill */}
          <div className={cn('flex', COL_WIDTHS[3])}>
            <Bone className="h-5 w-16 rounded-full" />
          </div>
          {/* Amount */}
          <div className={cn('flex justify-end', COL_WIDTHS[4])}>
            <Bone className="h-3.5 w-16" />
          </div>
          {/* Actions */}
          {isAdmin && (
            <div className={cn('flex items-center justify-end gap-1', ACTION_COL)}>
              <Bone className="h-7 w-7 rounded-md" />
              <Bone className="h-7 w-7 rounded-md" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}