import { VideoProcessingState } from "@prisma/client";

export interface ProcessingUpdate {
  id: string;
  timestamp: Date;
  status: VideoProcessingState;
  message: string;
}
