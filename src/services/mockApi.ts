import type { Transaction, DashboardSummary, TransactionFormPayload } from '../types';
import { seedTransactions } from '../lib/data/seedData';
import { computeSummary } from '../lib/utils/summaryUtils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Simulates network latency. Returns a Promise that resolves after a
 * randomised delay between [min, max] milliseconds.
 */
const delay = (min = 350, max = 950): Promise<void> =>
  new Promise((resolve) =>
    setTimeout(
      resolve,
      Math.floor(Math.random() * (max - min + 1)) + min
    )
  );

/**
 * Generates a unique ID for new transactions.
 * Prefers the native crypto API; falls back gracefully.
 */
const generateId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// ─── Mock API ─────────────────────────────────────────────────────────────────

/**
 * A stateless mock service layer that simulates a REST API with artificial
 * network delays. All persistent state lives in the Zustand store — this
 * service's role is to validate payloads, simulate async behaviour, and
 * return derived results (like the dashboard summary).
 *
 * Each method mirrors a real endpoint contract:
 *   GET    /transactions           → fetchTransactions
 *   POST   /summary                → computeSummary
 *   POST   /transactions           → createTransaction
 *   PATCH  /transactions/:id       → patchTransaction
 *   DELETE /transactions/:id       → removeTransaction
 */
export const mockApi = {
  /**
   * Returns a date-sorted copy of the seed transaction data.
   * On subsequent visits the store will already be hydrated from localStorage,
   * so this is only called once on the very first session.
   */
  async fetchTransactions(): Promise<Transaction[]> {
    await delay(500, 1000);
    return [...seedTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  /**
   * Simulates a server-side aggregation endpoint.
   * Accepts the caller's current transaction list and returns computed
   * dashboard metrics, allowing us to show realistic loading skeletons
   * on every summary re-fetch (e.g. after a mutation).
   */
  async computeSummary(transactions: Transaction[]): Promise<DashboardSummary> {
    await delay(350, 750);
    return computeSummary(transactions);
  },

  /**
   * Validates a new transaction payload and returns the created record.
   * The store is responsible for appending it to its own list.
   */
  async createTransaction(
    payload: TransactionFormPayload
  ): Promise<Transaction> {
    await delay(500, 1050);

    if (!payload.description?.trim()) {
      throw new Error('Description is required.');
    }
    if (!payload.amount || payload.amount <= 0) {
      throw new Error('Amount must be a positive number.');
    }
    if (!payload.date) {
      throw new Error('Date is required.');
    }

    return {
      ...payload,
      description: payload.description.trim(),
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Merges partial changes onto an existing transaction record.
   * Receiving the full `existing` record avoids a server round-trip
   * to look it up — a common optimisation pattern in mock services.
   */
  async patchTransaction(
    existing: Transaction,
    changes: Partial<TransactionFormPayload>
  ): Promise<Transaction> {
    await delay(400, 850);
    return { ...existing, ...changes };
  },

  /**
   * Simulates the network round-trip for a DELETE request.
   * The store performs the actual in-memory removal after this resolves.
   */
  async removeTransaction(_id: string): Promise<void> {
    await delay(300, 650);
    // Server-side deletion acknowledged; store handles state update.
  },
};