import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

// Singleton pattern to ensure only one Redis client is created
class RedisClient {
  private static instance: Redis;

  private constructor() {}

  public static getInstance(): Redis {
    console.log(
      "process.env.UPSTASH_REDIS_REST_URL is ",
      process.env.UPSTASH_REDIS_REST_URL
    );
    console.log(
      "process.env.UPSTASH_REDIS_REST_TOKEN is ",
      process.env.UPSTASH_REDIS_REST_TOKEN
    );
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });
    }
    return RedisClient.instance;
  }
}

// Export the singleton instance
export const redis = RedisClient.getInstance();
