import { Window } from "@/components/Window";
import { ProgressBar } from "@/components/ProgressBar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import {
  getFinancialSummary,
  getFitnessSummary,
  getGoalsSummary,
} from "@/lib/dashboard";
import { currency, percent, shortDate, signedCurrency } from "@/lib/format";

// Always read fresh data — this is a single-user tool with no caching needs.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [finance, fitness, goals] = await Promise.all([
    getFinancialSummary(),
    getFitnessSummary(),
    getGoalsSummary(),
  ]);

  const now = new Date();
  const trendLabel =
    fitness.weightTrend === null
      ? "—"
      : fitness.weightTrend === 0
        ? "no change"
        : `${fitness.weightTrend > 0 ? "+" : ""}${fitness.weightTrend} lbs`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Menu bar */}
      <div role="menubar" className="menubar flex items-center gap-4 px-2 py-1">
        <div className="flex gap-4">
          {["File", "Edit", "View", "Tools", "Help"].map((m) => (
            <span key={m} className="menuitem">
              <u>{m[0]}</u>
              {m.slice(1)}
            </span>
          ))}
        </div>
        <div className="ml-auto">
          <ThemeSwitcher />
        </div>
      </div>

      {/* Title strip */}
      <div className="titlestrip px-2 py-1 font-bold">
        BrandonOS — Daily Snapshot
      </div>

      {/* Dashboard grid */}
      <div className="flex-1 p-2">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
        >
          {/* --- Financial Summary --- */}
          <Window title="Financial Summary">
            <div className="well mb-2">
              <table className="dense">
                <tbody>
                  <tr>
                    <td>Cash Balance</td>
                    <td className="num pos">{currency(finance.cashBalance)}</td>
                  </tr>
                  <tr>
                    <td>Spending (This Month)</td>
                    <td className="num neg">
                      {signedCurrency(-finance.monthlySpending)}
                    </td>
                  </tr>
                  <tr>
                    <td>Total Debt</td>
                    <td className="num neg">{currency(finance.totalDebt)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <fieldset>
              <legend>Debts</legend>
              <table className="dense">
                <thead>
                  <tr>
                    <th>Account</th>
                    <th className="num">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {finance.debts.map((d) => (
                    <tr key={d.name}>
                      <td>{d.name}</td>
                      <td className="num">{currency(d.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </fieldset>

            <fieldset className="mt-2">
              <legend>Savings Goals</legend>
              {finance.savingsGoals.map((s) => (
                <div key={s.name} className="mb-2">
                  <table className="dense">
                    <tbody>
                      <tr>
                        <td>{s.name}</td>
                        <td className="num">
                          {currency(s.current)} / {currency(s.target)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <ProgressBar value={s.progress} />
                </div>
              ))}
            </fieldset>
          </Window>

          {/* --- Fitness Summary --- */}
          <Window title="Fitness Summary">
            <div className="well">
              <table className="dense">
                <tbody>
                  <tr>
                    <td>Current Weight</td>
                    <td className="num">
                      {fitness.currentWeight !== null
                        ? `${fitness.currentWeight} lbs`
                        : "—"}
                    </td>
                  </tr>
                  <tr>
                    <td>Weight Trend (4 wks)</td>
                    <td
                      className={`num ${
                        fitness.weightTrend && fitness.weightTrend < 0
                          ? "pos"
                          : fitness.weightTrend && fitness.weightTrend > 0
                            ? "neg"
                            : ""
                      }`}
                    >
                      {trendLabel}
                    </td>
                  </tr>
                  <tr>
                    <td>Workouts (This Week)</td>
                    <td className="num">{fitness.workoutsThisWeek}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Window>

          {/* --- Goals Summary --- */}
          <Window title="Goals Summary">
            <fieldset>
              <legend>Active Goals</legend>
              <table className="dense">
                <thead>
                  <tr>
                    <th>Goal</th>
                    <th className="num">Done</th>
                    <th className="num">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {goals.goals.map((g) => (
                    <tr key={g.title}>
                      <td>{g.title}</td>
                      <td className="num">{percent(g.progress)}</td>
                      <td className="num">{shortDate(g.targetDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </fieldset>
          </Window>
        </div>
      </div>

      {/* Status bar */}
      <div className="status-bar">
        <p className="status-bar-field">Ready</p>
        <p className="status-bar-field">
          {goals.goals.length} active goals
        </p>
        <p className="status-bar-field">
          {now.toLocaleDateString("en-US")}{" "}
          {now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
