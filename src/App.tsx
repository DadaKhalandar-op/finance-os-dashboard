import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { useAppStore } from '@/store/useAppStore';
import AppShell from '@/components/layout/AppShell';
import DashboardPage from '@/pages/DashboardPage';
import TransactionsPage from '@/pages/TransactionsPage';

// ─── Animated route container ─────────────────────────────────────────────────
//
// Sits inside <BrowserRouter> so useLocation() resolves correctly.
// The key on <Routes> is what signals AnimatePresence to trigger transitions —
// without it, React diffs the tree and reuses the mounted component silently.

function AnimatedRoutes() {
  const location = useLocation();

  return (
    // mode="wait": exit animation completes before the next page enters.
    // initial={false}: on the very first render, pages appear instantly
    //   (no entrance animation on page load — only on subsequent navigations).
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"    element={<DashboardPage />}    />
        <Route path="/transactions" element={<TransactionsPage />} />
        {/* Graceful catch-all — unknown routes land on the dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

// ─── Root Application ─────────────────────────────────────────────────────────

export default function App() {
  const theme          = useAppStore((s) => s.theme);
  const initializeData = useAppStore((s) => s.initializeData);

  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  /**
   * Application data bootstrap.
   *
   * `initializeData` is idempotent:
   *   - First visit:   fetches ~154 seed transactions from the mock API
   *                    (300-900 ms artificial delay → shows loading skeletons).
   *   - Return visits: localStorage is already hydrated by Zustand persist;
   *                    skips the fetch, only recomputes the dashboard summary.
   *
   * `void` suppresses the "unhandled promise" lint warning — errors are
   * caught inside the store action and written to `state.error`.
   */
  useEffect(() => {
    void initializeData();
  }, [initializeData]);

  return (
    <BrowserRouter>
      <AppShell>
        <AnimatedRoutes />
      </AppShell>
    </BrowserRouter>
  );
}