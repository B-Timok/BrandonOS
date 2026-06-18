import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Database client.
 *
 * Locally this resolves to a libSQL/SQLite file (./local.db by default). In
 * production set DATABASE_URL + DATABASE_AUTH_TOKEN to a Turso database, which
 * gives real persistence on Vercel's ephemeral serverless filesystem.
 */
const client = createClient({
  url: process.env.DATABASE_URL ?? "file:./local.db",
  authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
});

export const db = drizzle(client, { schema });
export { schema };
