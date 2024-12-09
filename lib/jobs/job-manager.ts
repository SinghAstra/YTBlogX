import { VideoMetadata } from "../youtube/types";
import { validateYouTubeUrl } from "../youtube/validation";
import { ConversionJob, JobErrorType, JobStatus } from "./job-status";

export function generateUniqueJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36)}`;
}

export function createConversionJob(videoUrl: string): ConversionJob {
  if (!validateYouTubeUrl(videoUrl)) {
    throw new Error(JobErrorType.INVALID_URL);
  }

  return {
    id: generateUniqueJobId(),
    videoUrl,
    status: JobStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function updateJobStatus(
  job: ConversionJob,
  status: JobStatus,
  metadata?: VideoMetadata,
  errorType?: JobErrorType
): ConversionJob {
  return {
    ...job,
    status,
    metadata: metadata ?? job.metadata,
    errorType,
    updatedAt: new Date(),
  };
}
