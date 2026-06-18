import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * BrandonOS schema.
 *
 * Single-user personal data store covering the three v1 domains: finances,
 * fitness, and goals. Money is stored as REAL (dollars) for simplicity — this
 * is a personal tool, not an accounting ledger. Dates are stored as ISO-8601
 * text (YYYY-MM-DD) so they sort lexically and stay human-readable.
 */

const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
};

// --- Finances -------------------------------------------------------------

/** Cash/asset accounts. The dashboard's "current cash balance" is the sum. */
export const accounts = sqliteTable("accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  // checking | savings | cash | other
  type: text("type").notNull().default("checking"),
  balance: real("balance").notNull().default(0),
  ...timestamps,
});

/** Individual spending/income transactions. Positive = income, negative = spend. */
export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(), // YYYY-MM-DD
  description: text("description").notNull(),
  category: text("category").notNull().default("uncategorized"),
  amount: real("amount").notNull(), // negative for spending
  accountId: integer("account_id").references(() => accounts.id),
  ...timestamps,
});

/** Outstanding debts (credit cards, loans, etc.). */
export const debts = sqliteTable("debts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  balance: real("balance").notNull().default(0),
  apr: real("apr").notNull().default(0), // annual percentage rate, e.g. 19.99
  minimumPayment: real("minimum_payment").notNull().default(0),
  ...timestamps,
});

/** Savings goals (e.g. "PC Build Fund") tracked toward a target amount. */
export const savingsGoals = sqliteTable("savings_goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  targetAmount: real("target_amount").notNull(),
  currentAmount: real("current_amount").notNull().default(0),
  targetDate: text("target_date"), // YYYY-MM-DD, optional
  ...timestamps,
});

// --- Fitness --------------------------------------------------------------

/** A single weigh-in. Trend is derived from the series. */
export const weightEntries = sqliteTable("weight_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(), // YYYY-MM-DD
  weightLbs: real("weight_lbs").notNull(),
  ...timestamps,
});

/** A logged workout session. */
export const workouts = sqliteTable("workouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(), // YYYY-MM-DD
  type: text("type").notNull().default("general"), // strength | cardio | ...
  durationMin: integer("duration_min").notNull().default(0),
  notes: text("notes"),
  ...timestamps,
});

// --- Goals ----------------------------------------------------------------

/** General life goals with a 0-100 completion percentage. */
export const goals = sqliteTable("goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category").notNull().default("general"),
  progress: integer("progress").notNull().default(0), // 0-100
  targetDate: text("target_date"), // YYYY-MM-DD, optional
  status: text("status").notNull().default("active"), // active | done | paused
  notes: text("notes"),
  ...timestamps,
});

export type Account = typeof accounts.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Debt = typeof debts.$inferSelect;
export type SavingsGoal = typeof savingsGoals.$inferSelect;
export type WeightEntry = typeof weightEntries.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type Goal = typeof goals.$inferSelect;
