import { Pool } from "pg";
import { Env } from "./env.config.js";

export const pool = new Pool({
  user: Env.DB_USER,
  host: Env.DB_HOST,
  database: Env.DB_NAME,
  port: Number(Env.DB_PORT),
  password: Env.DB_PASSWORD,
});

pool.on("connect", () => {
  console.log("Postgres pool has been connected");
});

pool.on("error", (error) => {
  console.log(
    "An unexpected error has been occured while connecting to pool: ",
    error,
  );
  process.exit(1);
});

export const connectToPool = async () => {
  const client = await pool.connect();
  try {
    const query = await client.query("SELECT NOW();");
    console.log("Database is connected: ", query.rows[0].now);
  } catch (error) {
    console.log("Failed to connect database");
  }
};
