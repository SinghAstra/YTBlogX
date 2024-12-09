import { redis } from "../redis";

export async function updateJobInRedis(
  jobId: string,
  updates: Record<string, string>
) {
  try {
    await redis.hset(`job:${jobId}`, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Failed to update job ${jobId}:`, error);
    throw error;
  }
}
