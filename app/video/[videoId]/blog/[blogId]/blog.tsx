"use client";

import { Blog, Video } from "@prisma/client";
import { Clock } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
// import BlogNavigation from "./blog-navigation";

interface BlogWithVideo extends Blog {
  video: Video;
}

interface BlogContentProps {
  blog: BlogWithVideo;
}

function calculateReadingTime(
  text: string,
  wordsPerMinute: number = 200
): number {
  // Remove HTML tags if present
  const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");

  // Count words by splitting on whitespace
  const wordCount = cleanText.trim().split(/\s+/).length;

  // Calculate reading time
  const readingTime = wordCount / wordsPerMinute;

  // Round to nearest minute, with a minimum of 1 minute
  return Math.max(1, Math.round(readingTime));
}

const BlogContent = ({ blog }: BlogContentProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const readingTime = calculateReadingTime(blog.content ?? "No Content Found");

  return (
    <main className="flex-1 px-4 py-6 md:px-8 lg:px-12 mx-auto xl:ml-[20rem] xl:w-[calc(100%-20rem)] ">
      <article className="space-y-8">
        <div className="relative aspect-video w-full overflow-hidden rounded-sm">
          <div className="w-full h-full relative rounded-sm overflow-hidden">
            {!isImageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted/20 via-muted/40 to-muted/60" />
            )}
            <Image
              src={blog.video.videoThumbnail}
              alt={blog.video.title}
              fill
              onLoad={() => setIsImageLoaded(true)}
              className={`object-cover transition-opacity duration-700 ${
                isImageLoaded ? "opacity-50" : "opacity-0"
              }`}
            />
          </div>
          {/* <div className="absolute inset-0 bg-black/50"></div> */}
          <div className="absolute inset-0  flex items-center justify-center">
            <div className="text-center flex flex-col gap-1 py-2 max-w-[80%] bg-muted/80 rounded">
              <span className="text-3xl font-normal  px-4 py-1">
                Part {blog.part}
              </span>
              <h1 className="text-2xl font-normal px-4 py-1 md:text-3xl ">
                {blog.title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 absolute left-2 bottom-2 font-normal bg-muted/80 px-4 py-1 rounded">
            <div className="relative h-10 w-10 rounded-full overflow-hidden">
              <Image
                src={blog.video.channelThumbnail}
                alt={blog.video.channelName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-normal">{blog.video.channelName}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>
                  {readingTime} {readingTime > 1 ? "mins read" : "min read"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* {content} */}
        {/* <BlogNavigation part={blog.part} videoId={blog.video.id} /> */}
      </article>
    </main>
  );
};

export default BlogContent;
