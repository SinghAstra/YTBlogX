import { YoutubeTranscript } from "youtube-transcript";

export async function extractYouTubeTranscript(videoId: string) {
  try {
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
    console.log(
      "transcriptData --extractYouTubeTranscript is ",
      transcriptData
    );
    return transcriptData.map((entry) => entry.text).join(" ");
  } catch (error) {
    console.log("Transcript extraction error:", error);
    throw new Error("Failed to extract transcript");
  }
}
