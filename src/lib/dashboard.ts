import { db } from "@/db";
import {
  accounts,
  debts,
  goals,
  savingsGoals,
  transactions,
  weightEntries,
  workouts,
} from "@/db/schema";
import { desc } from "drizzle-orm";

/**
 * Aggregates the raw tables into the three dashboard summaries described in the
 * PRD. All computation happens here so the page stays a thin presentation
 * layer. Runs on the server (React Server Component / API routes).
 */

export type FinancialSummary = {
  cashBalance: number;
  monthlySpending: number;
  totalDebt: number;
  debts: { name: string; balance: number }[];
  savingsGoals: {
    name: string;
    current: number;
    target: number;
    progress: number;
  }[];
};

export type FitnessSummary = {
  currentWeight: number | null;
  weightTrend: number | null; // change vs. earliest entry in window (lbs)
  workoutsThisWeek: number;
};

export type GoalsSummary = {
  goals: {
    title: string;
    progress: number;
    targetDate: string | null;
    status: string;
  }[];
};

function startOfWeek(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay(); // 0 = Sunday
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() - day);
  return copy;
}

export async function getFinancialSummary(): Promise<FinancialSummary> {
  const [accountRows, txRows, debtRows, savingsRows] = await Promise.all([
    db.select().from(accounts),
    db.select().from(transactions),
    db.select().from(debts),
    db.select().from(savingsGoals),
  ]);

  const cashBalance = accountRows.reduce((sum, a) => sum + a.balance, 0);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlySpending = txRows
    .filter((t) => t.amount < 0 && new Date(t.date) >= monthStart)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalDebt = debtRows.reduce((sum, d) => sum + d.balance, 0);

  return {
    cashBalance,
    monthlySpending,
    totalDebt,
    debts: debtRows.map((d) => ({ name: d.name, balance: d.balance })),
    savingsGoals: savingsRows.map((s) => ({
      name: s.name,
      current: s.currentAmount,
      target: s.targetAmount,
      progress: s.targetAmount > 0 ? (s.currentAmount / s.targetAmount) * 100 : 0,
    })),
  };
}

export async function getFitnessSummary(): Promise<FitnessSummary> {
  const [weightRows, workoutRows] = await Promise.all([
    db.select().from(weightEntries).orderBy(desc(weightEntries.date)),
    db.select().from(workouts),
  ]);

  const currentWeight = weightRows[0]?.weightLbs ?? null;
  const earliest = weightRows[weightRows.length - 1]?.weightLbs ?? null;
  const weightTrend =
    currentWeight !== null && earliest !== null
      ? Number((currentWeight - earliest).toFixed(1))
      : null;

  const weekStart = startOfWeek(new Date());
  const workoutsThisWeek = workoutRows.filter(
    (w) => new Date(w.date) >= weekStart
  ).length;

  return { currentWeight, weightTrend, workoutsThisWeek };
}

export async function getGoalsSummary(): Promise<GoalsSummary> {
  const goalRows = await db
    .select()
    .from(goals)
    .orderBy(desc(goals.progress));

  return {
    goals: goalRows.map((g) => ({
      title: g.title,
      progress: g.progress,
      targetDate: g.targetDate,
      status: g.status,
    })),
  };
}
