"use client";

import { convertISO8601ToTime } from "@/lib/utils";
import { Video, VideoStatus } from "@prisma/client";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface VideoCardProps {
  video: Video;
}

const getStatusColor = (status: VideoStatus) => {
  if (status === "COMPLETED") {
    return "border-green-500 text-green-500";
  }
  if (status.includes("FAILED")) {
    return "border-red-500 text-red-500";
  }
  return "border-yellow-500 text-yellow-500";
};

const SidebarVideoCard = ({ video }: VideoCardProps) => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    toast(message);
    setMessage(null);
  }, [message]);

  const getHref = () => {
    if (video.status === VideoStatus.COMPLETED) {
      return `/video/${video.id}`;
    }

    return `/logs/${video.id}`;
  };

  const href = getHref();

  return (
    <Link href={href}>
      <VideoCard video={video} />
    </Link>
  );
};

const VideoCard = ({ video }: VideoCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="p-2 flex gap-2 flex-col rounded-sm group hover:bg-muted/40 border transition-all duration-200 cursor-pointer">
      <div className="relative w-full rounded-sm overflow-hidden">
        <div className="w-full relative  overflow-hidden">
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
        {video.status !== "COMPLETED" && (
          <>
            <div className="absolute inset-0 bg-muted/80"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Badge
                variant={"outline"}
                className={`border ${getStatusColor(
                  video.status
                )} backdrop-blur-sm`}
              >
                {video.status}
              </Badge>
            </div>
          </>
        )}
        <div className="absolute bottom-2 right-2 rounded-sm bg-muted/80 tracking-wider text-xs py-1 px-2  transition-all  opacity-0 group-hover:opacity-100">
          {convertISO8601ToTime(video.duration)}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={video.channelThumbnail}
            alt={video.channelName || "Channel"}
          />
          <AvatarFallback>
            <UserIcon className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="text-sm  line-clamp-2 leading-tight">{video.title}</h3>
          <p className="text-xs text-muted-foreground">{video.channelName}</p>
        </div>
      </div>
    </div>
  );
};

export default SidebarVideoCard;
