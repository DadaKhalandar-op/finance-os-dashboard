import { type ReactNode } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    /**
     * Root layout: full viewport height, no outer scroll.
     * Flex row — sidebar (desktop) + content column.
     */
    <div className="flex h-screen overflow-hidden bg-background font-sans ">
      {/* ── Desktop sidebar ────────────────────────────────────────────────── */}
      {/*
       * Sidebar is `hidden` on mobile (lg:flex handles visibility).
       * It is rendered here always so Framer Motion can animate its mount.
       */}
      <Sidebar />

      {/* ── Content column (mobile header + scrollable main) ──────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile top bar — hidden at lg breakpoint */}
        <MobileHeader />

        {/* Scrollable page area */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
        >
          {/*
           * Inner wrapper provides consistent padding and a max-width
           * so content doesn't stretch too wide on ultra-wide screens.
           */}
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}