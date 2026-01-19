import { createClient } from "redis";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), "config.env") });

console.log("Current Directory:", process.cwd());
console.log("Host Check:", `'${process.env.REDIS_HOST}'`);

const password = process.env.REDIS_PASSWORD;

const redisClient = createClient({
  username: "default",
  ...(password && { password: password }),
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    connectionTimeout: 5000,
  } as any,
});

redisClient.on("error", (err) => {
  console.warn(
    "Redis Client Error (System will rely on DB only): ",
    err.message
  );
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      console.log("Successfully connected to Redis");
    } catch (error) {
      console.warn("Could not connect to Redis. Caching is disabled.");
    }
  }
}

connectRedis();

export default redisClient;
