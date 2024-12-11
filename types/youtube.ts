import { z } from "zod";

// YouTube URL Validation Schema
export const YouTubeUrlSchema = z.string().refine(
  (url: string) => {
    const youtubeUrlRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeUrlRegex.test(url);
  },
  { message: "Invalid YouTube URL" }
);

export interface VideoMetaData {
  channelId?: string;
  videoTitle?: string;
  videoDescription?: string;
  thumbnail?: string;
  channelTitle?: string;
  videoDuration?: string;
  viewCount?: number;
  likeCount?: number;
}
