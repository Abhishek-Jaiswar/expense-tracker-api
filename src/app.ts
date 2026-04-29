import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import { Env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { requestLogger } from "./middleware/request-logger.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";
import expenseRouter from "./modules/expenses/expense.routes.js";

export const app: Express = express();

app.use(
  cors({
    origin: Env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "expense-tracker-api",
  });
});

app.use("/api/v1/expenses", expenseRouter);
app.use("/api/v1/auth", authRouter);

app.use(notFoundHandler);
app.use(errorHandler);
