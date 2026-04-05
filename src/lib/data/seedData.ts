import type { Transaction, TransactionCategory, TransactionType } from '../../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface RawEntry {
  date: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
}

const buildTransactions = (raw: readonly RawEntry[]): Transaction[] =>
  raw.map((entry, i) => ({
    ...entry,
    id: `seed_${String(i + 1).padStart(4, '0')}`,
    createdAt: new Date(`${entry.date}T09:00:00.000Z`).toISOString(),
  }));

// ─── Raw Seed Data (~154 Transactions | Apr 2025 – Apr 2026) ─────────────────

const raw: readonly RawEntry[] = [

  // ── April 2025 ─────────────────────────────────────────────────────────────
  { date: '2025-04-01', description: 'Monthly Salary',           amount: 5400,  category: 'Salary',        type: 'income'  },
  { date: '2025-04-02', description: 'Apartment Rent',           amount: 1450,  category: 'Housing',       type: 'expense' },
  { date: '2025-04-04', description: 'Whole Foods Market',       amount: 78,    category: 'Food',          type: 'expense' },
  { date: '2025-04-06', description: 'Uber Ride',                amount: 24,    category: 'Transport',     type: 'expense' },
  { date: '2025-04-09', description: 'Chipotle Mexican Grill',   amount: 18,    category: 'Food',          type: 'expense' },
  { date: '2025-04-11', description: 'Netflix Subscription',     amount: 15,    category: 'Entertainment', type: 'expense' },
  { date: '2025-04-14', description: "Trader Joe's",             amount: 65,    category: 'Food',          type: 'expense' },
  { date: '2025-04-16', description: 'Amazon Purchase',          amount: 89,    category: 'Shopping',      type: 'expense' },
  { date: '2025-04-19', description: 'Monthly Metro Pass',       amount: 35,    category: 'Transport',     type: 'expense' },
  { date: '2025-04-22', description: 'Blue Bottle Coffee',       amount: 22,    category: 'Food',          type: 'expense' },
  { date: '2025-04-25', description: 'Dividend Payout',          amount: 320,   category: 'Investment',    type: 'income'  },
  { date: '2025-04-28', description: 'Gym Membership',           amount: 45,    category: 'Health',        type: 'expense' },

  // ── May 2025 ───────────────────────────────────────────────────────────────
  { date: '2025-05-01', description: 'Monthly Salary',           amount: 5400,  category: 'Salary',        type: 'income'  },
  { date: '2025-05-02', description: 'Apartment Rent',           amount: 1450,  category: 'Housing',       type: 'expense' },
  { date: '2025-05-04', description: 'Electricity Bill',         amount: 95,    category: 'Housing',       type: 'expense' },
  { date: '2025-05-07', description: 'Whole Foods Market',       amount: 92,    category: 'Food',          type: 'expense' },
  { date: '2025-05-09', description: 'Uber Ride',                amount: 18,    category: 'Transport',     type: 'expense' },
  { date: '2025-05-12', description: 'Zara Clothing',            amount: 125,   category: 'Shopping',      type: 'expense' },
  { date: '2025-05-14', description: 'Italian Restaurant',       amount: 65,    category: 'Food',          type: 'expense' },
  { date: '2025-05-17', description: 'Cinema Tickets',           amount: 28,    category: 'Entertainment', type: 'expense' },
  { date: '2025-05-20', description: 'Gas Station',              amount: 55,    category: 'Transport',     type: 'expense' },
  { date: '2025-05-22', description: "Trader Joe's",             amount: 71,    category: 'Food',          type: 'expense' },
  { date: '2025-05-24', description: 'CVS Pharmacy',             amount: 35,    category: 'Health',        type: 'expense' },
  { date: '2025-05-29', description: 'Stock Dividend',           amount: 450,   category: 'Investment',    type: 'income'  },

  // ── June 2025 ──────────────────────────────────────────────────────────────
  { date: '2025-06-01', description: 'Monthly Salary',           amount: 5400,  category: 'Salary',        type: 'income'  },
  { date: '2025-06-02', description: 'Apartment Rent',           amount: 1450,  category: 'Housing',       type: 'expense' },
  { date: '2025-06-05', description: 'Spotify Premium',          amount: 10,    category: 'Entertainment', type: 'expense' },
  { date: '2025-06-08', description: 'Whole Foods Market',       amount: 84,    category: 'Food',          type: 'expense' },
  { date: '2025-06-10', description: 'Lyft Ride',                amount: 31,    category: 'Transport',     type: 'expense' },
  { date: '2025-06-13', description: 'Summer Wardrobe',          amount: 210,   category: 'Shopping',      type: 'expense' },
  { date: '2025-06-15', description: 'Sushi Restaurant',         amount: 88,    category: 'Food',          type: 'expense' },
  { date: '2025-06-18', description: 'Water Bill',               amount: 40,    category: 'Housing',       type: 'expense' },
  { date: '2025-06-20', description: 'Doctor Visit',             amount: 120,   category: 'Health',        type: 'expense' },
  { date: '2025-06-23', description: 'Farmers Market',           amount: 45,    category: 'Food',          type: 'expense' },
  { date: '2025-06-26', description: 'Concert Tickets',          amount: 95,    category: 'Entertainment', type: 'expense' },
  { date: '2025-06-28', description: 'Freelance Payment',        amount: 800,   category: 'Investment',    type: 'income'  },

  // ── July 2025 ──────────────────────────────────────────────────────────────
  { date: '2025-07-01', description: 'Monthly Salary',           amount: 5400,  category: 'Salary',        type: 'income'  },
  { date: '2025-07-02', description: 'Apartment Rent',           amount: 1450,  category: 'Housing',       type: 'expense' },
  { date: '2025-07-04', description: 'Holiday BBQ Groceries',    amount: 110,   category: 'Food',          type: 'expense' },
  { date: '2025-07-07', description: 'Amazon Purchase',          amount: 145,   category: 'Shopping',      type: 'expense' },
  { date: '2025-07-09', description: 'Monthly Metro Pass',       amount: 35,    category: 'Transport',     type: 'expense' },
  { date: '2025-07-12', description: 'Whole Foods Market',       amount: 76,    category: 'Food',          type: 'expense' },
  { date: '2025-07-14', description: 'Netflix Subscription',     amount: 15,    category: 'Entertainment', type: 'expense' },
  { date: '2025-07-17', description: 'Yoga Studio',              amount: 60,    category: 'Health',        type: 'expense' },
  { date: '2025-07-20', description: 'Coffee Shop',              amount: 28,    category: 'Food',          type: 'expense' },
  { date: '2025-07-23', description: 'Gas Station',              amount: 62,    category: 'Transport',     type: 'expense' },
  { date: '2025-07-26', description: 'Quarterly Dividend',       amount: 285,   category: 'Investment',    type: 'income'  },
  { date: '2025-07-29', description: 'Home Repairs',             amount: 175,   category: 'Housing',       type: 'expense' },

  // ── August 2025 ────────────────────────────────────────────────────────────
  { date: '2025-08-01', description: 'Monthly Salary',           amount: 5800,  category: 'Salary',        type: 'income'  },
  { date: '2025-08-02', description: 'Apartment Rent',           amount: 1500,  category: 'Housing',       type: 'expense' },
  { date: '2025-08-05', description: 'Back-to-School Shopping',  amount: 320,   category: 'Shopping',      type: 'expense' },
  { date: '2025-08-07', description: 'Whole Foods Market',       amount: 88,    category: 'Food',          type: 'expense' },
  { date: '2025-08-09', description: 'Uber Ride',                amount: 19,    category: 'Transport',     type: 'expense' },
  { date: '2025-08-12', description: 'Thai Restaurant',          amount: 52,    category: 'Food',          type: 'expense' },
  { date: '2025-08-14', description: 'Electricity Bill',         amount: 118,   category: 'Housing',       type: 'expense' },
  { date: '2025-08-17', description: 'Sports Equipment',         amount: 180,   category: 'Health',        type: 'expense' },
  { date: '2025-08-20', description: "Trader Joe's",             amount: 67,    category: 'Food',          type: 'expense' },
  { date: '2025-08-23', description: 'Monthly Metro Pass',       amount: 35,    category: 'Transport',     type: 'expense' },
  { date: '2025-08-26', description: 'Investment Return',        amount: 380,   category: 'Investment',    type: 'income'  },
  { date: '2025-08-29', description: 'Online Learning Course',   amount: 99,    category: 'Other',         type: 'expense' },

  // ── September 2025 ─────────────────────────────────────────────────────────
  { date: '2025-09-01', description: 'Monthly Salary',           amount: 5800,  category: 'Salary',        type: 'income'  },
  { date: '2025-09-02', description: 'Apartment Rent',           amount: 1500,  category: 'Housing',       type: 'expense' },
  { date: '2025-09-05', description: 'Whole Foods Market',       amount: 95,    category: 'Food',          type: 'expense' },
  { date: '2025-09-07', description: 'Lyft Ride',                amount: 27,    category: 'Transport',     type: 'expense' },
  { date: '2025-09-10', description: 'Netflix Subscription',     amount: 18,    category: 'Entertainment', type: 'expense' },
  { date: '2025-09-12', description: 'Autumn Clothing Haul',     amount: 155,   category: 'Shopping',      type: 'expense' },
  { date: '2025-09-15', description: 'Mexican Restaurant',       amount: 42,    category: 'Food',          type: 'expense' },
  { date: '2025-09-17', description: 'Internet Bill',            amount: 85,    category: 'Housing',       type: 'expense' },
  { date: '2025-09-19', description: 'Dental Checkup',           amount: 150,   category: 'Health',        type: 'expense' },
  { date: '2025-09-22', description: 'Coffee Subscription',      amount: 32,    category: 'Food',          type: 'expense' },
  { date: '2025-09-25', description: 'Gas Station',              amount: 58,    category: 'Transport',     type: 'expense' },
  { date: '2025-09-28', description: 'Photography Workshop',     amount: 120,   category: 'Other',         type: 'expense' },

  // ── October 2025 ───────────────────────────────────────────────────────────
  { date: '2025-10-01', description: 'Monthly Salary',           amount: 5800,  category: 'Salary',        type: 'income'  },
  { date: '2025-10-02', description: 'Apartment Rent',           amount: 1500,  category: 'Housing',       type: 'expense' },
  { date: '2025-10-05', description: 'Whole Foods Market',       amount: 102,   category: 'Food',          type: 'expense' },
  { date: '2025-10-07', description: 'Amazon Purchase',          amount: 75,    category: 'Shopping',      type: 'expense' },
  { date: '2025-10-09', description: 'Monthly Metro Pass',       amount: 35,    category: 'Transport',     type: 'expense' },
  { date: '2025-10-12', description: 'Halloween Costumes & Decor', amount: 85,  category: 'Shopping',      type: 'expense' },
  { date: '2025-10-14', description: 'Burger Bar',               amount: 23,    category: 'Food',          type: 'expense' },
  { date: '2025-10-16', description: 'Quarterly Dividend',       amount: 310,   category: 'Investment',    type: 'income'  },
  { date: '2025-10-18', description: 'Electricity Bill',         amount: 88,    category: 'Housing',       type: 'expense' },
  { date: '2025-10-21', description: 'Pharmacy',                 amount: 42,    category: 'Health',        type: 'expense' },
  { date: '2025-10-23', description: "Trader Joe's",             amount: 73,    category: 'Food',          type: 'expense' },
  { date: '2025-10-26', description: 'Music Festival Tickets',   amount: 140,   category: 'Entertainment', type: 'expense' },
  { date: '2025-10-29', description: 'Uber Ride',                amount: 22,    category: 'Transport',     type: 'expense' },

  // ── November 2025 ──────────────────────────────────────────────────────────
  { date: '2025-11-01', description: 'Monthly Salary',           amount: 5800,  category: 'Salary',        type: 'income'  },
  { date: '2025-11-02', description: 'Apartment Rent',           amount: 1500,  category: 'Housing',       type: 'expense' },
  { date: '2025-11-05', description: 'Whole Foods Market',       amount: 115,   category: 'Food',          type: 'expense' },
  { date: '2025-11-07', description: 'Gas Station',              amount: 60,    category: 'Transport',     type: 'expense' },
  { date: '2025-11-09', description: 'Netflix Subscription',     amount: 18,    category: 'Entertainment', type: 'expense' },
  { date: '2025-11-14', description: 'Black Friday Electronics', amount: 480,   category: 'Shopping',      type: 'expense' },
  { date: '2025-11-16', description: 'Thanksgiving Groceries',   amount: 145,   category: 'Food',          type: 'expense' },
  { date: '2025-11-18', description: 'Black Friday Fashion',     amount: 230,   category: 'Shopping',      type: 'expense' },
  { date: '2025-11-20', description: 'Gym Membership',           amount: 50,    category: 'Health',        type: 'expense' },
  { date: '2025-11-22', description: 'Coffee Shop',              amount: 19,    category: 'Food',          type: 'expense' },
  { date: '2025-11-25', description: 'Monthly Metro Pass',       amount: 35,    category: 'Transport',     type: 'expense' },
  { date: '2025-11-27', description: 'Freelance Bonus',          amount: 1200,  category: 'Investment',    type: 'income'  },
  { date: '2025-11-28', description: 'Home Decor',               amount: 95,    category: 'Shopping',      type: 'expense' },
  { date: '2025-11-30', description: 'Streaming Bundle',         amount: 35,    category: 'Entertainment', type: 'expense' },

  // ── December 2025 ──────────────────────────────────────────────────────────
  { date: '2025-12-01', description: 'Monthly Salary',           amount: 5800,  category: 'Salary',        type: 'income'  },
  { date: '2025-12-02', description: 'Apartment Rent',           amount: 1500,  category: 'Housing',       type: 'expense' },
  { date: '2025-12-05', description: 'Christmas Gift Shopping',  amount: 380,   category: 'Shopping',      type: 'expense' },
  { date: '2025-12-07', description: 'Whole Foods Market',       amount: 130,   category: 'Food',          type: 'expense' },
  { date: '2025-12-09', description: 'Electricity Bill',         amount: 130,   category: 'Housing',       type: 'expense' },
  { date: '2025-12-11', description: 'Uber Ride',                amount: 28,    category: 'Transport',     type: 'expense' },
  { date: '2025-12-13', description: 'Gift Cards',               amount: 200,   category: 'Shopping',      type: 'expense' },
  { date: '2025-12-15', description: 'Holiday Bonus',            amount: 2000,  category: 'Salary',        type: 'income'  },
  { date: '2025-12-17', description: 'Fine Dining Restaurant',   amount: 155,   category: 'Food',          type: 'expense' },
  { date: '2025-12-19', description: 'Gas Station',              amount: 65,    category: 'Transport',     type: 'expense' },
  { date: '2025-12-22', description: 'Holiday Party',            amount: 85,    category: 'Entertainment', type: 'expense' },
  { date: '2025-12-24', description: 'Christmas Eve Dinner',     amount: 95,    category: 'Food',          type: 'expense' },
  { date: '2025-12-27', description: 'Year-End Dividend',        amount: 550,   category: 'Investment',    type: 'income'  },
  { date: '2025-12-30', description: 'New Year Celebration Prep', amount: 120,  category: 'Entertainment', type: 'expense' },

  // ── January 2026 ───────────────────────────────────────────────────────────
  { date: '2026-01-01', description: 'Monthly Salary',           amount: 6000,  category: 'Salary',        type: 'income'  },
  { date: '2026-01-02', description: 'Apartment Rent',           amount: 1550,  category: 'Housing',       type: 'expense' },
  { date: '2026-01-04', description: 'New Year Sales Shopping',  amount: 195,   category: 'Shopping',      type: 'expense' },
  { date: '2026-01-06', description: 'Whole Foods Market',       amount: 88,    category: 'Food',          type: 'expense' },
  { date: '2026-01-08', description: 'Gym Membership',           amount: 55,    category: 'Health',        type: 'expense' },
  { date: '2026-01-10', description: 'Monthly Metro Pass',       amount: 35,    category: 'Transport',     type: 'expense' },
  { date: '2026-01-13', description: 'Netflix Subscription',     amount: 18,    category: 'Entertainment', type: 'expense' },
  { date: '2026-01-15', description: 'Thai Restaurant',          amount: 48,    category: 'Food',          type: 'expense' },
  { date: '2026-01-17', description: 'Water Bill',               amount: 45,    category: 'Housing',       type: 'expense' },
  { date: '2026-01-20', description: "Trader Joe's",             amount: 82,    category: 'Food',          type: 'expense' },
  { date: '2026-01-22', description: 'Investment Dividend',      amount: 290,   category: 'Investment',    type: 'income'  },
  { date: '2026-01-25', description: 'Pharmacy',                 amount: 38,    category: 'Health',        type: 'expense' },
  { date: '2026-01-28', description: 'Amazon Purchase',          amount: 112,   category: 'Shopping',      type: 'expense' },

  // ── February 2026 ──────────────────────────────────────────────────────────
  { date: '2026-02-01', description: 'Monthly Salary',           amount: 6000,  category: 'Salary',        type: 'income'  },
  { date: '2026-02-02', description: 'Apartment Rent',           amount: 1550,  category: 'Housing',       type: 'expense' },
  { date: '2026-02-05', description: 'Whole Foods Market',       amount: 79,    category: 'Food',          type: 'expense' },
  { date: '2026-02-09', description: "Valentine's Day Dinner",   amount: 185,   category: 'Food',          type: 'expense' },
  { date: '2026-02-10', description: "Valentine's Gifts",        amount: 145,   category: 'Shopping',      type: 'expense' },
  { date: '2026-02-12', description: 'Uber Ride',                amount: 21,    category: 'Transport',     type: 'expense' },
  { date: '2026-02-14', description: 'Electricity Bill',         amount: 98,    category: 'Housing',       type: 'expense' },
  { date: '2026-02-17', description: 'Coffee Shop',              amount: 24,    category: 'Food',          type: 'expense' },
  { date: '2026-02-19', description: 'Movie Tickets',            amount: 32,    category: 'Entertainment', type: 'expense' },
  { date: '2026-02-21', description: "Trader Joe's",             amount: 68,    category: 'Food',          type: 'expense' },
  { date: '2026-02-23', description: 'Gas Station',              amount: 56,    category: 'Transport',     type: 'expense' },
  { date: '2026-02-25', description: 'Doctor Visit',             amount: 100,   category: 'Health',        type: 'expense' },
  { date: '2026-02-27', description: 'Investment Return',        amount: 620,   category: 'Investment',    type: 'income'  },

  // ── March 2026 ─────────────────────────────────────────────────────────────
  { date: '2026-03-01', description: 'Monthly Salary',           amount: 6000,  category: 'Salary',        type: 'income'  },
  { date: '2026-03-02', description: 'Apartment Rent',           amount: 1550,  category: 'Housing',       type: 'expense' },
  { date: '2026-03-05', description: 'Whole Foods Market',       amount: 91,    category: 'Food',          type: 'expense' },
  { date: '2026-03-07', description: 'Monthly Metro Pass',       amount: 35,    category: 'Transport',     type: 'expense' },
  { date: '2026-03-10', description: 'Spring Wardrobe Refresh',  amount: 240,   category: 'Shopping',      type: 'expense' },
  { date: '2026-03-12', description: 'Netflix Subscription',     amount: 18,    category: 'Entertainment', type: 'expense' },
  { date: '2026-03-14', description: 'Italian Restaurant',       amount: 72,    category: 'Food',          type: 'expense' },
  { date: '2026-03-16', description: 'Pharmacy',                 amount: 29,    category: 'Health',        type: 'expense' },
  { date: '2026-03-19', description: 'Gym Membership',           amount: 55,    category: 'Health',        type: 'expense' },
  { date: '2026-03-21', description: 'Coffee Shop',              amount: 26,    category: 'Food',          type: 'expense' },
  { date: '2026-03-24', description: 'Quarterly Dividend',       amount: 410,   category: 'Investment',    type: 'income'  },
  { date: '2026-03-27', description: 'Home Decor',               amount: 165,   category: 'Shopping',      type: 'expense' },
  { date: '2026-03-29', description: 'Concert Tickets',          amount: 110,   category: 'Entertainment', type: 'expense' },

  // ── April 2026 (partial — current month) ───────────────────────────────────
  { date: '2026-04-01', description: 'Monthly Salary',           amount: 6000,  category: 'Salary',        type: 'income'  },
  { date: '2026-04-02', description: 'Apartment Rent',           amount: 1550,  category: 'Housing',       type: 'expense' },
  { date: '2026-04-03', description: 'Grocery Store',            amount: 67,    category: 'Food',          type: 'expense' },

] as const;

// ─── Export ───────────────────────────────────────────────────────────────────

export const seedTransactions: Transaction[] = buildTransactions(raw);