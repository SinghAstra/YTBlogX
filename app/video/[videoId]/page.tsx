import { UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { convertISO8601ToTime } from "@/lib/utils";
import { Blog } from "@prisma/client";
import { getServerSession } from "next-auth";
import OverviewSection from "./overview-section";

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
      openGraph: {
        title: video.title,
        description: video.overview || `Video notes for ${video.title}`,
        images: [{ url: video.videoThumbnail }],
      },
      twitter: {
        card: "summary_large_image",
        title: video.title,
        description: video.overview || `Video notes for ${video.title}`,
        images: [video.videoThumbnail],
      },
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

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="lg:w-1/3 lg:max-w-md lg:fixed lg:h-[calc(100vh-4rem)] p-4 overflow-y-auto lg:border-dotted lg:border-r">
        <div className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={video.videoThumbnail}
              alt={video.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-2 right-2 rounded-sm bg-muted/80 tracking-wider text-xs py-1 px-2  ">
              {convertISO8601ToTime(video.duration)}
            </div>
          </div>

          {/* Video title */}
          <h1 className="text-md font-normal leading-tight">{video.title}</h1>

          {/* Channel info */}
          <div className="flex items-center gap-2 border-b border-dotted pb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={video.channelThumbnail}
                alt={video.channelName || "Channel"}
              />
              <AvatarFallback>
                <UserIcon className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{video.channelName}</span>
          </div>

          {/* Video overview */}
          <OverviewSection overview={video.overview} />
        </div>
      </div>

      {/* Right side - Blog segments */}
      <div className="lg:w-2/3 lg:ml-[33vw] p-4 ">
        <div className="max-w-3xl mx-auto">
          {video.blogs && video.blogs.length > 0 && (
            <div className="flex flex-col gap-4">
              {video.blogs.map((blog: Blog, index: number) => (
                <Link href={`/video/${video.id}/blog/${blog.id}`} key={blog.id}>
                  <div className="flex flex-col md:flex-row border border-dotted rounded-md overflow-hidden transition-all duration-200 hover:bg-secondary/50">
                    {/* Part banner */}
                    <div className="relative h-32 md:h-auto md:w-1/3">
                      <Image
                        src={video.videoThumbnail}
                        alt={video.title}
                        fill
                        className="object-cover opacity-50"
                        priority
                      />
                      {/* Overlay for better contrast */}
                      <div className="absolute inset-0 bg-muted/40"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-normal bg-muted/30 px-4 py-1 rounded">
                          Part {blog.part}
                        </span>
                      </div>
                    </div>

                    {/* Blog info */}
                    <div className="px-3 py-4 md:w-2/3">
                      <h3 className="font-normal mb-2 line-clamp-2">
                        {blog.title || `Part ${index + 1} of "${video.title}"`}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {blog.summary ||
                          "No summary available for this segment."}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
