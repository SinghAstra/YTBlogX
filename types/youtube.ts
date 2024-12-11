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
  id?: string;
  title?: string;
  channelTitle?: string;
  thumbnail?: string;
  duration?: string;
  description?: string;
}
