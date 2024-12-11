import { YouTubeUrlSchema } from "./types";

export function validateYouTubeUrl(url: string): boolean {
  try {
    YouTubeUrlSchema.parse(url);
    return true;
  } catch {
    return false;
  }
}
