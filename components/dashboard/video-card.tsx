import { Video, VideoProcessingState } from "@prisma/client";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

export function convertISO8601ToTime(duration: string) {
  const hoursMatch = duration.match(/(\d+)H/);
  const minutesMatch = duration.match(/(\d+)M/);
  const secondsMatch = duration.match(/(\d+)S/);

  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;

  // Format as "H:MM:SS" or "MM:SS" if no hours
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

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
  return (
    <Link
      href={
        video.processingState === VideoProcessingState.COMPLETED
          ? `/video/${video.id}`
          : `/logs/${video.id}`
      }
    >
      <div className="p-2 flex gap-2 flex-col rounded-sm group hover:bg-muted/40 border transition-all duration-200">
        <div className="relative w-full h-[200px] ">
          <Image
            src={video.videoThumbnail}
            alt={video.title}
            fill
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
            <h3 className="text-sm  line-clamp-2 leading-tight">
              {video.title}
            </h3>
            <p className="text-xs text-muted-foreground">{video.channelName}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
