import { YouTubeUrlSchema } from "./types";

export function validateYouTubeUrl(url: string): boolean {
  try {
    YouTubeUrlSchema.parse(url);
    return true;
  } catch {
    return false;
  }
}

export function extractYouTubeVideoId(url: string): string | null {
  const urlRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(urlRegex);
  return match ? match[1] : null;
}
