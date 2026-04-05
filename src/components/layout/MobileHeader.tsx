import { Menu, TrendingUp, X } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAppStore } from '@/store/useAppStore';
import { SidebarContent } from './Sidebar';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function MobileHeader() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  return (
    <>
      {/* ── Top Bar (mobile only) ──────────────────────────────────────────── */}
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 lg:hidden">
        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Centered Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 shadow-md shadow-emerald-500/20">
            <TrendingUp className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-syne text-sm font-semibold tracking-tight text-white">
            FinanceOS
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center">
          <ThemeToggle variant="icon-only" className="!bg-slate-800 !text-slate-400" />
        </div>
      </header>

      {/* ── Mobile Navigation Sheet ───────────────────────────────────────── */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0 border-r border-slate-800 bg-slate-900 [&>button]:hidden"
        >
          {/* Accessible title (visually hidden by shadcn by default) */}
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

          {/* Close button — custom, sits inside the sidebar design */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.15 }}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
            className="absolute right-3 top-3 z-50 flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </motion.button>

          <SidebarContent onNavClick={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}