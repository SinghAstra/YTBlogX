"use server";

import { VideoInfo } from "@/interfaces/video";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { createCleanJobsToken } from "@/lib/service-auth";
import { getServerSession } from "next-auth";

const EXPRESS_API_URL = process.env.EXPRESS_API_URl;

export async function fetchVideos() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { message: "Authentication required", videos: [] };
    }

    const videos = await prisma.video.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { videos };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return { message: "Failed to Fetch Videos", videos: [] };
  }
}

export async function activateBackendServer() {
  try {
    if (!EXPRESS_API_URL) {
      throw new Error("EXPRESS_API_URL is required.");
    }
    const response = await fetch(EXPRESS_API_URL);
    const data = await response.json();
    console.log("activateBackendServer data:", data);
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
  }
}

export async function fetchProcessingVideos() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return [];
    }

    const response = await prisma.video.findMany({
      where: {
        status: {
          in: ["PENDING", "PROCESSING"],
        },
        userId: session.user.id,
      },
    });
    console.log("response is ", response);

    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return [];
  }
}

export async function stopVideoProcessing() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return;
    }

    const serviceToken = createCleanJobsToken({
      userId: session.user.id,
    });

    const response = await fetch(`${EXPRESS_API_URL}/api/clean/user-jobs`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceToken}`,
      },
    });

    const data = await response.json();

    console.log("stopVideoProcessing data : ", data);

    await prisma.video.updateMany({
      where: {
        userId: session.user.id,
        status: {
          in: ["PENDING", "PROCESSING"],
        },
      },
      data: {
        status: "FAILED",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
  }
}

export async function getVideoInfo(videoId: string) {
  try {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    if (!YOUTUBE_API_KEY) {
      throw new Error("YOUTUBE_API_KEY is required.");
    }
    const session = await getServerSession(authOptions);

    if (!session) {
      return null;
    }

    const ytVideoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    const ytVideoData = await ytVideoResponse.json();
    if (!ytVideoData.items || ytVideoData.items.length === 0) {
      return;
    }

    const videoData = ytVideoData.items[0];
    const {
      title,
      channelTitle: channelName,
      thumbnails,
      channelId,
    } = videoData.snippet;
    const videoThumbnail = thumbnails.maxres.url;
    const duration = videoData.contentDetails.duration;

    const ytChannelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );

    const ytChannelData = await ytChannelResponse.json();
    const channelData = ytChannelData.items[0];

    const channelThumbnail = channelData.snippet.thumbnails.high.url;

    const videoDetails = {
      title,
      channelName,
      videoThumbnail,
      channelThumbnail,
      duration,
    };

    return videoDetails as VideoInfo;
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
  }
}
