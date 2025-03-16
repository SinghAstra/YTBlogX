import { authOptions } from "@/lib/auth-options";
import {
  generateBlogContent,
  generateVideoOverview,
  processBatchTranscriptSummariesAndTitle,
} from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { splitTranscript } from "@/lib/split-transcript";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

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

    const transcriptData = await YoutubeTranscript.fetchTranscript(youtubeId);
    const transcript = transcriptData.map((entry) => entry.text).join(" ");
    const transcriptChunks = splitTranscript(transcript);
    const createTranscript = transcriptChunks.map((chunk, index) => {
      return prisma.blog.create({
        data: {
          transcript: chunk,
          videoId: video.id,
          part: index + 1,
        },
      });
    });

    await prisma.$transaction(createTranscript);

    await processBatchTranscriptSummariesAndTitle(video.id);

    await generateVideoOverview(video.id);

    const videoWithBlogs = await prisma.video.findUnique({
      where: { id: video.id },
      select: {
        overview: true,
        blogs: {
          select: {
            id: true,
            summary: true,
            transcript: true,
          },
        },
      },
    });

    if (!videoWithBlogs || !videoWithBlogs.overview) {
      return NextResponse.json(
        { message: "Video or overview not found" },
        { status: 404 }
      );
    }

    const overview = videoWithBlogs.overview;
    const blogs = videoWithBlogs.blogs;

    // Create a combined string of all summaries for context
    const allSummaries = blogs
      .filter((blog) => blog.summary) // Only include blogs with summaries
      .map((blog) => `${blog.summary}`)
      .join("\n\n");

    for (const blog of blogs) {
      if (blog.transcript) {
        const blogData = await generateBlogContent(
          overview,
          allSummaries,
          blog.transcript
        );

        // Update the blog with both title and content
        await prisma.blog.update({
          where: { id: blog.id },
          data: {
            content: blogData,
          },
        });
      }
    }

    const updatedBlogs = await prisma.blog.findMany({
      where: {
        videoId: video.id,
      },
    });

    console.log("updatedBlogs is ", updatedBlogs);

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
