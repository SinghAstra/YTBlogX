import { google } from "googleapis";

export async function extractYouTubeTranscript(
  videoId: string
): Promise<string> {
  // Initialize YouTube API client
  const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
  });

  try {
    // Fetch captions
    const captionsResponse = await youtube.captions.list({
      part: ["snippet"],
      videoId: videoId,
    });

    // Find the most suitable caption
    const captions = captionsResponse.data.items;
    if (!captions || captions.length === 0) {
      throw new Error("No captions found for the video");
    }

    // Prefer English captions
    const englishCaption =
      captions.find(
        (caption) =>
          caption.snippet?.language === "en" ||
          caption.snippet?.language === "en-US"
      ) || captions[0];

    if (!englishCaption.id) {
      throw new Error("Unable to find caption track");
    }

    // Fetch the actual caption text
    const captionResponse = await youtube.captions.download({
      id: englishCaption.id,
      tfmt: "sbv", // SubRip format
    });

    // Process and clean transcript
    return processTranscript(captionResponse.data as string);
  } catch (error) {
    console.error("Transcript extraction error:", error);
    throw new Error("Failed to extract transcript");
  }
}

function processTranscript(rawTranscript: string): string {
  // Remove timestamp information
  const cleanedTranscript = rawTranscript
    .replace(/\d+:\d+:\d+\.\d+ --> \d+:\d+:\d+\.\d+/g, "")
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join(" ");

  return cleanedTranscript;
}
