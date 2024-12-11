import { fetchVideoMetadata } from "@/app/actions/youtube";

export async function generateUniqueIdFromUrl(videoUrl: string) {
  const videoId = extractVideoId(videoUrl);

  if (!videoId) {
    console.log("videoId not found --generateUniqueIdFromVideoUrl");
    return;
  }

  // Extract video metadata from YouTube API
  const metadata = await fetchVideoMetadata(videoId);

  // Remove special characters and convert to lowercase
  const sanitizeString = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 30);

  // Create slug-like components
  const titleSlug = sanitizeString(metadata.title);
  const channelSlug = sanitizeString(metadata.channelTitle);

  // Generate a short random component
  const randomPart = Math.random().toString(36).substring(2, 6);

  // Combine components
  return `${titleSlug}-${channelSlug}-${randomPart}`;
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
