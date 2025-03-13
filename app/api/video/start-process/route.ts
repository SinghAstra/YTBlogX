import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json(
    //     { message: "Sign In to Get Started" },
    //     { status: 401 }
    //   );
    // }

    const videoUrl = searchParams.get("videoUrl");

    if (!videoUrl) {
      return NextResponse.json(
        { message: "Missing videoUrl" },
        { status: 400 }
      );
    }

    // Extract YouTube video ID from URL
    const youtubeId = new URL(videoUrl).searchParams.get("v");
    console.log(`YouTube video ID: ${youtubeId}`);
    if (!youtubeId) {
      return NextResponse.json(
        { message: "Invalid YouTube video URL" },
        { status: 400 }
      );
    }

    console.log("YOUTUBE_API_KEY is ", YOUTUBE_API_KEY);

    // Fetch video data from YouTube API
    const ytResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&key=${YOUTUBE_API_KEY}`
    );

    const ytData = await ytResponse.json();

    console.log("ytData is", ytData);

    if (!ytData.items || ytData.items.length === 0) {
      return NextResponse.json(
        { error: "Video not found on YouTube" },
        { status: 404 }
      );
    }

    const videoData = ytData.items[0];
    const {
      title,
      channelTitle: channelName,
      thumbnails,
      contentDetails,
    } = videoData.snippet;
    const thumbnailUrl = thumbnails.high.url;
    const duration = contentDetails.duration;

    const obj = {
      youtubeId,
      title,
      channelName,
      thumbnailUrl,
      duration,
      processingState: "PENDING",
    };

    console.log("obj is ", obj);

    // Save new video to DB
    // const video = await prisma.video.create({
    //   data: {
    //     youtubeId,
    //     userId: session.user.id,
    //     title,
    //     channelName,
    //     thumbnailUrl,
    //     duration,
    //     processingState: "PENDING",
    //   },
    // });

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
