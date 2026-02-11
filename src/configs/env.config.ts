import { getEnv } from "../utils/get-env.js";
import { configDotenv } from "dotenv";
configDotenv();

export const Env = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "8000"),

  DB_USER: getEnv("DB_USER", "postgers"),
  DB_HOST: getEnv("DB_HOST", "localhost"),
  DB_NAME: getEnv("DB_NAME", "expense"),
  DB_PORT: getEnv("DB_PORT", "5432"),
  DB_PASSWORD: getEnv("DB_PASSWORD", "root"),

  CORS_ORIGIN: getEnv("CORS_ORIGIN", "http://localhost:5174"),

  JWT_SECRET: getEnv("JWT_SECRET") as string,
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN") as string,
} as const;
