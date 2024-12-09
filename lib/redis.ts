import { Redis } from "@upstash/redis";

// Singleton pattern to ensure only one Redis client is created
class RedisClient {
  private static instance: Redis;

  private constructor() {}

  public static getInstance(): Redis {
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
