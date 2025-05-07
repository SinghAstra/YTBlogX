import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { createServiceToken } from "@/lib/service-auth";
import { getServerSession } from "next-auth";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const EXPRESS_API_URL = process.env.EXPRESS_API_URL;

if (!YOUTUBE_API_KEY) {
  throw new Error("YOUTUBE_API_KEY is required.");
}

if (!EXPRESS_API_URL) {
  throw new Error("EXPRESS_API_URL is required.");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
        { message: "Sign In to Get Started" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { videoUrl } = body;

    if (!videoUrl) {
      return Response.json({ message: "Missing videoUrl" }, { status: 400 });
    }

    // Extract YouTube video ID from URL
    const youtubeId = new URL(videoUrl).searchParams.get("v");
    if (!youtubeId) {
      return Response.json(
        { message: "Invalid YouTube video URL" },
        { status: 400 }
      );
    }

    // Fetch video data from YouTube API
    const ytVideoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${youtubeId}&key=${YOUTUBE_API_KEY}`
    );

    const ytVideoData = await ytVideoResponse.json();
    if (!ytVideoData.items || ytVideoData.items.length === 0) {
      return Response.json(
        { message: "Video not found on YouTube" },
        { status: 404 }
      );
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

    console.log("About to created Video");
    console.log("session.user.id is ", session.user.id);

    // Save new video to DB
    const video = await prisma.video.create({
      data: {
        youtubeId,
        userId: session.user.id,
        title,
        channelName,
        videoThumbnail,
        channelThumbnail,
        duration,
        status: "PENDING",
      },
    });

    console.log("video is ", video);

    const serviceToken = createServiceToken({
      videoId: video.id,
      userId: session.user.id,
    });

    const response = await fetch(`${EXPRESS_API_URL}/api/queue/video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceToken}`,
      },
    });

    const data = await response.json();

    console.log("data --express api is ", data);

    return Response.json({ video }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return Response.json(
      { message: "Failed to start video processing" },
      { status: 500 }
    );
  }
}
