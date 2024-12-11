"use server";

import { VideoMetaData } from "@/types/youtube";

export async function fetchVideoMetadata(
  videoId: string
): Promise<VideoMetaData> {
  // TODO:Fix the FetchVideoMetaData
  console.log("In fetchVideoMetaData");

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?` +
      new URLSearchParams({
        part: "snippet,contentDetails,statistics",
        id: videoId,
        key: process.env.YOUTUBE_API_KEY ?? "",
      })
  );

  const data = await response.json();
  const snippet = data.items[0].snippet;
  const contentDetails = data.items[0].contentDetails;
  const statistics = data.items[0].statistics;

  return {
    channelId: snippet.channelId,
    videoTitle: snippet.title,
    videoDescription: snippet.description,
    thumbnail: snippet.thumbnails.maxres.url
      ? snippet.thumbnails.maxres.url
      : snippet.thumbnails.high.url,
    channelTitle: snippet.channelTitle,
    videoDuration: contentDetails.duration,
    viewCount: parseInt(statistics.viewCount),
    likeCount: parseInt(statistics.likeCount),
  };
}
