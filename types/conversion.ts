import { BlogContent } from "./blog";

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
    metadata: {
      title: string;
      thumbnail: string;
      description: string;
    };
    blogContent: BlogContent;
  };
}
