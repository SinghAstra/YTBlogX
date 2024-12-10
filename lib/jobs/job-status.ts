import { VideoMetadata } from "../youtube/types";

export enum JobStatus {
  PENDING = "PENDING",
  METADATA_FETCHING = "METADATA_FETCHING",
  TRANSCRIPT_EXTRACTING = "TRANSCRIPT_EXTRACTING",
  AI_PROCESSING = "AI_PROCESSING",
  FORMATTING = "FORMATTING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum JobErrorType {
  INVALID_URL = "INVALID_URL",
  METADATA_FETCH_FAILED = "METADATA_FETCH_FAILED",
  TRANSCRIPT_EXTRACTION_FAILED = "TRANSCRIPT_EXTRACTION_FAILED",
  AI_PROCESSING_ERROR = "AI_PROCESSING_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface JobResult {
  title: string;
  content: string;
  summary: string;
}

export interface Job {
  id: string;
  status: JobStatus;
  videoUrl: string;
  metadata?: VideoMetadata;
  result?: JobResult;
  errorType?: JobErrorType;
  createdAt: Date;
  updatedAt?: Date;
}
