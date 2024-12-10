import { Job, JobErrorType, JobResult, JobStatus } from "@/lib/jobs/job-status";
import { redis } from "@/lib/redis";
import { VideoMetadata } from "@/lib/youtube/types";

export async function getJob(jobId: string): Promise<Job | null> {
  console.log("jobId --getJob is ", jobId);
  const jobData = await redis.hgetall(`job:${jobId}`);
  console.log("jobData --getJob is ", jobData);

  if (!jobData) return null;

  return {
    id: jobData.id as string,
    videoUrl: jobData.videoUrl as string,
    status: jobData.status as JobStatus,
    createdAt: jobData.createdAt as Date,
    metadata: jobData.metadata
      ? (jobData.metadata as VideoMetadata)
      : undefined,
    errorType: jobData.errorType as JobErrorType | undefined,
    result: jobData.result ? (jobData.result as JobResult) : undefined,
  };
}
