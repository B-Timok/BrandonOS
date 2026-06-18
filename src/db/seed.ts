import "dotenv/config";
import { db } from "./index";
import {
  accounts,
  debts,
  goals,
  savingsGoals,
  transactions,
  weightEntries,
  workouts,
} from "./schema";

/**
 * Seeds the database with representative sample data so the dashboard has
 * something to render during development. Safe to re-run: it clears existing
 * rows first.
 */

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

async function seed() {
  console.log("Clearing existing data...");
  await db.delete(transactions);
  await db.delete(accounts);
  await db.delete(debts);
  await db.delete(savingsGoals);
  await db.delete(weightEntries);
  await db.delete(workouts);
  await db.delete(goals);

  console.log("Seeding accounts...");
  const [checking] = await db
    .insert(accounts)
    .values([
      { name: "Checking", type: "checking", balance: 4250.75 },
      { name: "Savings", type: "savings", balance: 9800.0 },
      { name: "Wallet", type: "cash", balance: 120.0 },
    ])
    .returning();

  console.log("Seeding transactions...");
  await db.insert(transactions).values([
    { date: isoDaysAgo(2), description: "Groceries", category: "food", amount: -86.42, accountId: checking.id },
    { date: isoDaysAgo(3), description: "Gas", category: "transport", amount: -52.1, accountId: checking.id },
    { date: isoDaysAgo(5), description: "Paycheck", category: "income", amount: 2400.0, accountId: checking.id },
    { date: isoDaysAgo(8), description: "Internet", category: "utilities", amount: -75.0, accountId: checking.id },
    { date: isoDaysAgo(12), description: "Dining out", category: "food", amount: -43.5, accountId: checking.id },
    { date: isoDaysAgo(18), description: "Electric bill", category: "utilities", amount: -110.25, accountId: checking.id },
    { date: isoDaysAgo(22), description: "Gym membership", category: "health", amount: -35.0, accountId: checking.id },
  ]);

  console.log("Seeding debts...");
  await db.insert(debts).values([
    { name: "Visa Credit Card", balance: 1850.32, apr: 19.99, minimumPayment: 55.0 },
    { name: "Car Loan", balance: 8200.0, apr: 4.5, minimumPayment: 310.0 },
  ]);

  console.log("Seeding savings goals...");
  await db.insert(savingsGoals).values([
    { name: "PC Build Fund", targetAmount: 2000.0, currentAmount: 1200.0, targetDate: isoDaysAgo(-120) },
    { name: "Emergency Fund", targetAmount: 10000.0, currentAmount: 6500.0, targetDate: isoDaysAgo(-300) },
  ]);

  console.log("Seeding weight entries...");
  await db.insert(weightEntries).values([
    { date: isoDaysAgo(28), weightLbs: 192.4 },
    { date: isoDaysAgo(21), weightLbs: 191.1 },
    { date: isoDaysAgo(14), weightLbs: 190.0 },
    { date: isoDaysAgo(7), weightLbs: 189.2 },
    { date: isoDaysAgo(0), weightLbs: 188.5 },
  ]);

  console.log("Seeding workouts...");
  await db.insert(workouts).values([
    { date: isoDaysAgo(1), type: "strength", durationMin: 55, notes: "Push day" },
    { date: isoDaysAgo(2), type: "cardio", durationMin: 30, notes: "Run" },
    { date: isoDaysAgo(4), type: "strength", durationMin: 60, notes: "Pull day" },
    { date: isoDaysAgo(6), type: "strength", durationMin: 50, notes: "Legs" },
  ]);

  console.log("Seeding goals...");
  await db.insert(goals).values([
    { title: "Read 12 books this year", category: "personal", progress: 50, targetDate: isoDaysAgo(-195), status: "active" },
    { title: "Pay off Visa card", category: "finance", progress: 35, targetDate: isoDaysAgo(-150), status: "active" },
    { title: "Reach 180 lbs", category: "fitness", progress: 60, targetDate: isoDaysAgo(-90), status: "active" },
    { title: "Launch BrandonOS v1", category: "project", progress: 20, targetDate: isoDaysAgo(-30), status: "active" },
  ]);

  console.log("Seed complete.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
