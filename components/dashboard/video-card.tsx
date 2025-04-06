"use client";

import { convertISO8601ToTime } from "@/lib/utils";
import { Video, VideoProcessingState } from "@prisma/client";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface VideoCardProps {
  video: Video;
}

const getStatusColor = (status: VideoProcessingState) => {
  if (status === "COMPLETED") {
    return "border-green-500 text-green-500";
  }
  if (status.includes("FAILED")) {
    return "border-red-500 text-red-500";
  }
  return "border-yellow-500 text-yellow-500";
};

const VideoCard = ({ video }: VideoCardProps) => {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    toast(message);
    setMessage(null);
  }, [message]);

  const handleVideoCardClick = () => {
    if (video.processingState === VideoProcessingState.COMPLETED) {
      router.push(`/video/${video.id}`);
    }
    if (video.processingState === VideoProcessingState.FAILED) {
      setMessage("Video Processing Failed. Please try again");
    }
    if (
      video.processingState === VideoProcessingState.PENDING ||
      video.processingState === VideoProcessingState.PROCESSING
    ) {
      router.push(`/logs/${video.id}`);
    }
  };

  return (
    <div
      className="p-2 flex gap-2 flex-col rounded-sm group hover:bg-muted/40 border transition-all duration-200 cursor-pointer"
      onClick={handleVideoCardClick}
    >
      <div className="relative w-full h-[200px] rounded-sm overflow-hidden">
        <Image
          src={video.videoThumbnail}
          alt={video.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-sm object-cover "
        />
        {video.processingState !== "COMPLETED" && (
          <>
            <div className="absolute inset-0 bg-muted/80"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Badge
                variant={"outline"}
                className={`border ${getStatusColor(
                  video.processingState
                )} backdrop-blur-sm`}
              >
                {video.processingState}
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

export default VideoCard;
