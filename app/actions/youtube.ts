"use server";

export async function fetchVideoDetails(videoId: string) {
  if (!videoId) {
    throw new Error("Video ID required");
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?` +
      new URLSearchParams({
        part: "snippet,contentDetails,statistics",
        id: videoId,
        key: process.env.YOUTUBE_API_KEY ?? "",
      })
  );

  const data = await response.json();
  return data;
}
