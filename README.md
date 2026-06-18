# BrandonOS

A personal operating system for tracking **finances, fitness, and goals** in a
single dashboard. Built to feel like a classic desktop productivity tool
(Windows 95/98/XP classic) — fast, information-dense, keyboard-friendly, and
free of modern SaaS clutter.

Single user. No authentication. No engagement mechanics. A tool, not a product.

## Stack

| Layer      | Choice                                  |
| ---------- | --------------------------------------- |
| Framework  | Next.js (App Router) + TypeScript       |
| Styling    | [98.css](https://jdan.github.io/98.css/) + minimal Tailwind (layout only) |
| Database   | SQLite via libSQL + Drizzle ORM         |
| Hosting    | Vercel (with a Turso libSQL database)   |
| Auth       | None (single user)                      |

> **Why libSQL/Turso?** The PRD calls for SQLite, but Vercel's serverless
> filesystem is ephemeral, so a plain `.db` file won't persist there. libSQL is
> SQLite-compatible and works with Drizzle: a local file in development, a hosted
> Turso database in production.

## Getting started

```bash
npm install
cp .env.example .env     # defaults to a local ./local.db file
npm run db:push          # create tables from the schema
npm run db:seed          # load sample data so the dashboard has content
npm run dev              # http://localhost:3000
```

## Database scripts

| Command               | Description                                    |
| --------------------- | ---------------------------------------------- |
| `npm run db:push`     | Sync the schema directly to the database (dev) |
| `npm run db:generate` | Generate SQL migration files from the schema   |
| `npm run db:migrate`  | Apply generated migrations                     |
| `npm run db:seed`     | Reset + load representative sample data         |
| `npm run db:studio`   | Open Drizzle Studio to browse the data         |

## Deploying to Vercel

1. Create a Turso database:
   ```bash
   turso db create brandonos
   turso db show brandonos --url            # -> DATABASE_URL
   turso db tokens create brandonos         # -> DATABASE_AUTH_TOKEN
   ```
2. Set `DATABASE_URL` and `DATABASE_AUTH_TOKEN` in the Vercel project env vars.
3. Run `npm run db:push` against the Turso URL once to create the tables.
4. Deploy.

## Project structure

```
app/
  layout.tsx           Root layout + global styles
  page.tsx             The Dashboard (server component)
  globals.css          98.css import + classic desktop styling
src/
  components/          Retro UI primitives (Window, ProgressBar)
  db/
    schema.ts          Drizzle table definitions
    index.ts           Database client
    seed.ts            Sample data
  lib/
    dashboard.ts       Aggregates raw tables into dashboard summaries
    format.ts          Currency / date / percent formatting helpers
```

## Data model (v1)

- **Finances** — `accounts`, `transactions`, `debts`, `savings_goals`
- **Fitness** — `weight_entries`, `workouts`
- **Goals** — `goals`

## Roadmap

- **v1 (current)** — Dashboard with Financial, Fitness, and Goals summaries.
- **Phase 2** — Personal Intelligence Layer: spending trends, debt payoff
  projections, goal forecasts, weight/workout summaries.

### Not in v1 (intentionally)

AI integrations · automatic bank syncing · mobile app · notifications · meal
planning · habit tracking · authentication · multiple users · budget
forecasting · external API integrations.
