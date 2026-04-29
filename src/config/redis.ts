import { createClient, type RedisClientType } from "redis";
import { Env } from "./env.js";

export const redisClient: RedisClientType = createClient({
  socket: {
    host: Env.REDIS_HOST,
    port: Env.REDIS_PORT,
  },
});

redisClient.on("error", (error) => {
  console.error("Redis client error", error);
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis connected:", await redisClient.ping());
  }
};
