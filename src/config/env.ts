import { configDotenv } from "dotenv";
import { getEnv } from "../shared/utils/get-env.js";

configDotenv();

export const Env = {
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: Number(getEnv("PORT", "8000")),
  DATABASE_URL: getEnv("DATABASE_URL"),
  CORS_ORIGIN: getEnv("CORS_ORIGIN", "http://localhost:3000"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "7d"),
  REDIS_HOST: getEnv("REDIS_HOST", "127.0.0.1"),
  REDIS_PORT: Number(getEnv("REDIS_PORT", "6379")),
  REDIS_TTL_SECONDS: Number(getEnv("REDIS_TTL_SECONDS", "300")),
} as const;
