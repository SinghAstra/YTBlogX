import { ConversionStatusData } from "@/types/conversion";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export class ConversionStore {
  // Store conversion status
  static async set(conversionId: string, data: ConversionStatusData) {
    await redis.set(`conversion:${conversionId}`, JSON.stringify(data));

    // Optional: Set expiration to prevent stale data (e.g., 24 hours)
    await redis.expire(`conversion:${conversionId}`, 24 * 60 * 60);
  }

  // Retrieve conversion status
  static async get(conversionId: string): Promise<ConversionStatusData | null> {
    const data = (await redis.get(
      `conversion:${conversionId}`
    )) as ConversionStatusData;
    return data;
  }

  // Update specific status
  static async updateStatus(
    conversionId: string,
    conversionStatusData: ConversionStatusData
  ) {
    const existingData = await this.get(conversionId);
    if (existingData) {
      await this.set(conversionId, conversionStatusData);
    }
  }

  static async delete(conversionId: string) {
    await redis.del(`conversion:${conversionId}`);
  }
}
