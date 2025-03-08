import * as schema from "./schema";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;
let pg: ReturnType<typeof postgres>;

const databaseUrl = process.env.DATABASE_URL!;

if (process.env.NODE_ENV === "production") {
  pg = postgres(databaseUrl);
  db = drizzle(pg, { schema });
} else {
  if (!global.db) {
    pg = postgres(databaseUrl);
    global.db = drizzle(pg, { schema });
  }
  db = global.db;
}

export { db, pg };
