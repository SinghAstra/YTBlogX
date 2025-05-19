"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { convertISO8601ToTime } from "@/lib/utils";
import { Blog, Video } from "@prisma/client";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import OverviewSection from "./overview-section";

interface VideoWithBlogs extends Video {
  blogs: Blog[];
}

interface VideoDetailProps {
  video: VideoWithBlogs;
}

const VideoDetail = ({ video }: VideoDetailProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="lg:w-1/3 lg:max-w-md lg:fixed lg:h-[calc(100vh-4rem)] p-4 overflow-y-auto lg:border-dotted lg:border-r space-y-2">
        <Link
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          className="hover:bg-muted/50 transition-all duration-500 rounded-md p-2 flex flex-col gap-4"
          target="_blank"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-sm">
            <div className="w-full relative rounded-sm overflow-hidden">
              {!isImageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted/20 via-muted/40 to-muted/60" />
              )}
              <Image
                src={video.videoThumbnail}
                alt={video.title}
                width={640}
                height={360}
                onLoad={() => setIsImageLoaded(true)}
                className={`object-cover transition-opacity duration-700 ${
                  isImageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
            <div className="absolute bottom-2 right-2 rounded-sm bg-muted/80 tracking-wider text-xs py-1 px-2  ">
              {convertISO8601ToTime(video.duration)}
            </div>
          </div>

          {/* Video title */}
          <h1 className="text-md font-normal leading-tight">{video.title}</h1>

          {/* Channel info */}
          <div className="flex items-center gap-2">
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
        </Link>

        {/* Video overview */}
        <OverviewSection overview={video.overview} />
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
                    <div className=" relative h-32 md:h-auto md:w-1/3">
                      <div className="w-full relative rounded-sm overflow-hidden">
                        {!isImageLoaded && (
                          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted/20 via-muted/40 to-muted/60" />
                        )}
                        <Image
                          src={video.videoThumbnail}
                          alt={video.title}
                          width={640}
                          height={360}
                          onLoad={() => setIsImageLoaded(true)}
                          className={`object-cover transition-opacity duration-700 ${
                            isImageLoaded ? "opacity-50" : "opacity-0"
                          }`}
                        />
                      </div>
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
};

export default VideoDetail;
