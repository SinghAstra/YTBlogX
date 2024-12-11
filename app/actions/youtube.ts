"use server";

export async function fetchVideoMetadata(videoId: string) {
  console.log("In fetchVideoMetaData");
  if (!videoId) {
    console.log("Video Id is required --fetchVideoMetadata");
    return;
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
