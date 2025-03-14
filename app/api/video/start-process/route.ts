import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Sign In to Get Started" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { videoUrl } = body;

    if (!videoUrl) {
      return NextResponse.json(
        { message: "Missing videoUrl" },
        { status: 400 }
      );
    }

    // Extract YouTube video ID from URL
    const youtubeId = new URL(videoUrl).searchParams.get("v");
    if (!youtubeId) {
      return NextResponse.json(
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
      return NextResponse.json(
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
    console.log("channelData is ", channelData);

    const channelThumbnail = channelData.snippet.thumbnails.high.url;

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
        processingState: "PENDING",
      },
    });

    console.log("video is ", video);

    return NextResponse.json(
      { message: "Video processing started" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
