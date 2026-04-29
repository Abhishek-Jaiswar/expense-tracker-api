import { app } from "./app.js";
import { connectToDatabase } from "./config/db.js";
import { Env } from "./config/env.js";
import { connectRedis } from "./config/redis.js";

const startServer = async () => {
  try {
    console.log("Starting expense-tracker-api...");
    await connectToDatabase();
    await connectRedis();

    app.listen(Env.PORT, () => {
      console.log(`API listening on http://localhost:${Env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

void startServer();
