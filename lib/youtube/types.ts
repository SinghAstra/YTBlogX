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

// Video Metadata Schema
export const VideoMetadataSchema = z.object({
  id: z.string(),
  title: z.string(),
  channelTitle: z.string(),
  thumbnail: z.string(),
  duration: z.string(),
  description: z.string().optional(),
});

export type VideoMetadata = z.infer<typeof VideoMetadataSchema>;
