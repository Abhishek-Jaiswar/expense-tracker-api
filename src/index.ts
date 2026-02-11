import express, { type Request, type Response } from "express";
import { connectToPool } from "./configs/db.config.js";
import { Env } from "./configs/env.config.js";
import userRoutes from "./routes/user/user.routes.js";
import expenseRoutes from "./routes/expenses/expense.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import { configDotenv } from "dotenv";
configDotenv();

const app = express();

// middlewares

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

const options = {
  origin: Env.CORS_ORIGIN,
  credentials: true,
};

app.use(cors(options));

//routes

app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: "Serving api for expense tracker",
  });
});

// endpoints

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/expense", expenseRoutes);

//server configs

const startServer = async () => {
  try {
    console.log("Server is starting...");
    await connectToPool();

    app.listen(Env.PORT, () => {
      console.log(`Server is listening on port: http://localhost:${Env.PORT}`);
    });
  } catch (error) {
    console.log("An error occured while starting server: ", error);
    process.exit(1);
  }
};

startServer();
