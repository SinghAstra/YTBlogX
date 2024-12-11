import { BlogContent } from "./blog";
import { VideoMetaData } from "./youtube";

export enum ConversionStatus {
  PENDING = "PENDING",
  METADATA_FETCHING = "METADATA_FETCHING",
  TRANSCRIPT_EXTRACTING = "TRANSCRIPT_EXTRACTING",
  AI_PROCESSING = "AI_PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface ConversionStatusData {
  status: ConversionStatus;
  conversionId: string;
  result?: {
    metadata: VideoMetaData;
    blogContent: BlogContent;
  };
}
