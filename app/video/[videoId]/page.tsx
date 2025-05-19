import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import VideoDetail from "./video-detail";

export async function generateMetadata({
  params,
}: {
  params: { videoId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      title: "Sign In Required",
      description: "Please sign in to view this content",
    };
  }

  try {
    const video = await prisma.video.findUnique({
      where: { id: params.videoId, userId: session.user.id },
    });

    if (!video) {
      return {
        title: "Video Not Found",
        description: "The requested video could not be found",
      };
    }

    return {
      title: `${video.title} | Video Notes`,
      description: video.overview || `Video notes for ${video.title}`,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return {
      title: "Error Loading Video",
      description: "There was an error loading the video information",
    };
  }
}

export default async function VideoPage({
  params,
}: {
  params: { videoId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in");
  }

  const video = await prisma.video.findUnique({
    where: { id: params.videoId, userId: session.user.id },
    include: {
      blogs: {
        orderBy: {
          part: "asc",
        },
      },
    },
  });

  if (!video) {
    notFound();
  }

  return <VideoDetail video={video} />;
}
