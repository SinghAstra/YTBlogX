"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VideoInfo } from "@/interfaces/video";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface VideoPreviewProps {
  videoDetails: VideoInfo;
  videoId: string;
}

export function VideoPreview({ videoDetails, videoId }: VideoPreviewProps) {
  const { title, channelName, videoThumbnail, channelThumbnail } = videoDetails;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Link href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank">
      <div className="p-4 bg-muted/20 hover:bg-muted/40 transition rounded ">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3 aspect-video relative rounded overflow-hidden">
            {!isImageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted/20 via-muted/40 to-muted/60" />
            )}
            <Image
              src={videoThumbnail}
              alt={title}
              width={320}
              height={180}
              onLoad={() => setIsImageLoaded(true)}
              className={`object-cover transition-opacity duration-700 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <div className="w-full md:w-2/3 flex flex-col gap-2">
            <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
            <div className=" flex gap-2 items-center ">
              <Avatar>
                <AvatarImage src={channelThumbnail} />
                <AvatarFallback>{channelName[0]}</AvatarFallback>
              </Avatar>

              <p className="text-sm text-muted-foreground mt-1">
                {channelName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
