import { User, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { convertISO8601ToTime } from "@/components/dashboard/video-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import OverviewSection from "./overview-section";

async function getVideo(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/video/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch video");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching video:", error);
    return null;
  }
}

export default async function VideoPage({
  params,
}: {
  params: { id: string };
}) {
  const video = await getVideo(params.id);

  if (!video) {
    notFound();
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="lg:w-1/3 lg:max-w-md lg:fixed lg:h-[calc(100vh-4rem)] p-4 overflow-y-auto">
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
          <h1 className="text-xl font-normal leading-tight">{video.title}</h1>

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
      <div className="lg:w-2/3 lg:ml-[33.333333%] p-4 ">
        <div className="max-w-3xl mx-auto">
          {video.blogs && video.blogs.length > 0 ? (
            <div className="flex flex-col gap-4">
              {video.blogs.map((blog: any, index: number) => (
                <Link href={`/video/${video.id}/blog/${blog.id}`} key={blog.id}>
                  <Card className="overflow-hidden transition-all hover:bg-secondary/50">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Part banner */}
                        <div className="relative h-32 md:h-auto md:w-1/3 bg-secondary">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">
                              Part {index + 1}
                            </span>
                          </div>
                        </div>

                        {/* Blog info */}
                        <div className="p-4 md:w-2/3">
                          <h3 className="font-semibold mb-2 line-clamp-2">
                            {blog.title ||
                              `Part ${index + 1} of "${video.title}"`}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {blog.summary ||
                              "No summary available for this segment."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4 text-muted-foreground">
                <User className="h-12 w-12 mx-auto opacity-50" />
              </div>
              <h3 className="text-xl font-medium mb-2">No blog segments yet</h3>
              <p className="text-muted-foreground">
                The video is still being processed or no segments were
                generated.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
