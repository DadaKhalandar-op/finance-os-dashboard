import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '@/components/ui/ThemeToggle';
import RoleToggle from '@/components/ui/RoleToggle';

// ─── Nav Configuration ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview & insights',
  },
  {
    label: 'Transactions',
    path: '/transactions',
    icon: ArrowLeftRight,
    description: 'History & records',
  },
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavItem({
  item,
  isActive,
}: {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className="relative block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      aria-label={item.label}
    >
      <div
        className={[
          'relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150',
          isActive
            ? 'text-emerald-400'
            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200',
        ].join(' ')}
      >
        {/* Animated background pill */}
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.span
              layoutId="nav-active-bg"
              className="absolute inset-0 rounded-lg bg-emerald-500/[0.08]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}
        </AnimatePresence>

        {/* Left accent bar */}
        <AnimatePresence initial={false}>
          {isActive && (
            <motion.span
              className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-emerald-400"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        <Icon
          className={[
            'relative h-4 w-4 flex-shrink-0 transition-colors duration-150',
            isActive ? 'text-emerald-400' : '',
          ].join(' ')}
        />

        <div className="relative min-w-0">
          <p className="text-sm font-medium leading-none">{item.label}</p>
          <p
            className={[
              'mt-0.5 text-[11px] leading-none transition-colors duration-150',
              isActive ? 'text-emerald-500/70' : 'text-slate-600',
            ].join(' ')}
          >
            {item.description}
          </p>
        </div>
      </div>
    </NavLink>
  );
}

// ─── Sidebar Content (shared between desktop + mobile Sheet) ─────────────────

export function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { pathname } = useLocation();

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-900">
      {/* ── Brand / Logo ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 border-b border-slate-800/80 px-5 py-[18px]">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/20">
          <TrendingUp className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-syne text-[15px] font-semibold leading-none tracking-tight text-white">
            FinanceOS
          </h1>
          <p className="mt-0.5 text-[10px] leading-none text-slate-500">
            Personal Finance
          </p>
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Overview
        </p>
        <ul className="space-y-0.5" onClick={onNavClick}>
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavItem
                item={item}
                isActive={pathname.startsWith(item.path)}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Bottom Controls ───────────────────────────────────────────────── */}
      <div className="border-t border-slate-800/80 px-4 pb-5 pt-4 space-y-4">
        <RoleToggle />

        <Separator className="bg-slate-800" />

        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Appearance
          </p>
          <ThemeToggle variant="with-label" />
        </div>

        {/* App info footer */}
        <div className="rounded-lg bg-slate-800/40 px-3 py-2.5">
          <p className="text-[10px] text-slate-600 leading-relaxed">
            <span className="text-slate-500 font-medium">FinanceOS</span>
            {' · '}v1.0.0
          </p>
          <p className="text-[10px] text-slate-700 mt-0.5">
            Data synced to local storage
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Desktop Sidebar Wrapper ──────────────────────────────────────────────────

export default function Sidebar() {
  return (
    <motion.aside
      className="hidden h-full w-64 flex-shrink-0 lg:flex lg:flex-col"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <SidebarContent />
    </motion.aside>
  );
}