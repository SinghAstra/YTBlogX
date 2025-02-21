import he from "he";
import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json({ message: "Missing videoId" }, { status: 400 });
  }

  try {
    const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
    const transcript = transcriptData
      .map((entry) => he.decode(entry.text))
      .join(" ");
    const decodedTranscript = he.decode(transcript);
    return NextResponse.json({ transcript: decodedTranscript });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json(
      { message: "Failed to fetch transcript" },
      { status: 500 }
    );
  }
}
