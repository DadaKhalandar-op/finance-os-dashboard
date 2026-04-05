import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface EmptyStateProps {
  variant: 'no-data' | 'no-results';
}

// ─── SVG Illustrations ────────────────────────────────────────────────────────

function NoResultsIllustration() {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-28 w-auto text-slate-200 dark:text-slate-800"
      aria-hidden
    >
      {/* Receipt shape */}
      <rect x="36" y="14" width="88" height="92" rx="6" fill="currentColor" />
      {/* Lines on receipt */}
      <rect x="50" y="30" width="60" height="6" rx="3" fill="white" fillOpacity=".5" />
      <rect x="50" y="44" width="44" height="5" rx="2.5" fill="white" fillOpacity=".35" />
      <rect x="50" y="57" width="52" height="5" rx="2.5" fill="white" fillOpacity=".35" />
      <rect x="50" y="70" width="36" height="5" rx="2.5" fill="white" fillOpacity=".35" />
      {/* Magnifying glass */}
      <circle cx="108" cy="84" r="20" fill="white" className="dark:fill-slate-900" />
      <circle
        cx="108"
        cy="84"
        r="14"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
        className="text-slate-300 dark:text-slate-700"
      />
      <line
        x1="118"
        y1="95"
        x2="130"
        y2="107"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        className="text-slate-300 dark:text-slate-700"
      />
    </svg>
  );
}

function NoDataIllustration() {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-28 w-auto text-slate-200 dark:text-slate-800"
      aria-hidden
    >
      {/* Folder shape */}
      <path
        d="M20 45C20 41.7 22.7 39 26 39H68L80 51H134C137.3 51 140 53.7 140 57V99C140 102.3 137.3 105 134 105H26C22.7 105 20 102.3 20 99V45Z"
        fill="currentColor"
      />
      {/* Plus icon inside */}
      <line
        x1="80" y1="68" x2="80" y2="86"
        stroke="white" strokeWidth="4" strokeLinecap="round" strokeOpacity=".5"
      />
      <line
        x1="71" y1="77" x2="89" y2="77"
        stroke="white" strokeWidth="4" strokeLinecap="round" strokeOpacity=".5"
      />
    </svg>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

export default function EmptyState({ variant }: EmptyStateProps) {
  const resetFilters = useAppStore((s) => s.resetFilters);
  const openModal    = useAppStore((s) => s.openModal);
  const role         = useAppStore((s) => s.role);
  const isAdmin      = role === 'admin';

  const config =
    variant === 'no-results'
      ? {
          illustration: <NoResultsIllustration />,
          title:        'No matching transactions',
          subtitle:     'Try adjusting your filters or search term.',
          cta: (
            <button
              onClick={resetFilters}
              className={[
                'inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium',
                'bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200',
                'dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
              ].join(' ')}
            >
              <Search className="h-3.5 w-3.5" />
              Clear Filters
            </button>
          ),
        }
      : {
          illustration: <NoDataIllustration />,
          title:        'No transactions yet',
          subtitle: isAdmin
            ? 'Add your first transaction to get started.'
            : 'Switch to Admin role to start adding transactions.',
          cta: isAdmin ? (
            <button
              onClick={() => openModal('add')}
              className={[
                'inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium',
                'bg-emerald-600 text-white shadow-sm transition-colors hover:bg-emerald-700',
                'dark:bg-emerald-500 dark:hover:bg-emerald-600',
              ].join(' ')}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Transaction
            </button>
          ) : null,
        };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center gap-4 py-20 text-center"
    >
      {config.illustration}

      <div className="space-y-1.5">
        <h3 className="font-syne text-base font-semibold text-slate-700 dark:text-slate-300">
          {config.title}
        </h3>
        <p className="text-sm text-slate-400 dark:text-slate-500">{config.subtitle}</p>
      </div>

      {config.cta && <div className="pt-1">{config.cta}</div>}
    </motion.div>
  );
}