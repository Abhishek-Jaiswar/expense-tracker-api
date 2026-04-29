import { Pool } from "pg";
import { Env } from "./env.js";

export const db = new Pool({
  connectionString: Env.DATABASE_URL,
  ssl:
    Env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

db.on("connect", () => {
  console.log("Postgres pool connected");
});

db.on("error", (error) => {
  console.error("Unexpected Postgres pool error", error);
  process.exit(1);
});

export const connectToDatabase = async () => {
  const client = await db.connect();

  try {
    const result = await client.query("SELECT NOW()");
    console.log("Database connected at", result.rows[0]?.now);
  } finally {
    client.release();
  }
};
