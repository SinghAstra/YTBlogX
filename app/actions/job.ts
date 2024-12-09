import { JobErrorType, JobStatus } from "@/lib/jobs/job-status";
import { redis } from "@/lib/redis";

interface VideoMetadata {
  id: string;
  title: string;
  thumbnail: string;
}

// Define the full job structure
interface ConversionJob {
  id: string;
  videoUrl: string;
  status: JobStatus;
  createdAt: string;
  metadata?: VideoMetadata;
  errorType?: JobErrorType;
}

export async function getJob(jobId: string): Promise<ConversionJob | null> {
  const jobData = await redis.hgetall(`job:${jobId}`);

  if (!jobData) return null;

  return {
    id: jobData.id as string,
    videoUrl: jobData.videoUrl as string,
    status: jobData.status as JobStatus,
    createdAt: jobData.createdAt as string,
    metadata: jobData.metadata
      ? JSON.parse(jobData.metadata as string)
      : undefined,
    errorType: jobData.errorType as JobErrorType | undefined,
  };
}
