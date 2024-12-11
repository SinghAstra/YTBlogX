import { YouTubeUrlSchema } from "../../types/youtube";

export function validateYouTubeUrl(url: string): boolean {
  try {
    YouTubeUrlSchema.parse(url);
    return true;
  } catch {
    return false;
  }
}
