import { Video } from "@prisma/client";
import Image from "next/image";
import React from "react";

function convertISO8601ToTime(duration: string) {
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

const VideoCard = ({ video }: VideoCardProps) => {
  return (
    <div className="p-2 flex gap-2 flex-col border rounded-sm">
      <div className="relative w-full h-[200px] group">
        <Image
          src={video.videoThumbnail}
          alt={video.title}
          fill
          className="rounded-sm "
        />
        <div className="absolute bottom-2 right-2 rounded-sm bg-black tracking-wider text-xs p-1 transition-all duration-150 opacity-0 group-hover:opacity-100">
          {convertISO8601ToTime(video.duration)}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="relative w-8 h-8">
          <Image
            src={video.channelThumbnail}
            alt={video.title}
            fill
            className="rounded-full"
          />
        </div>
        <h3 className="text-sm tracking-wide">{video.title}</h3>
      </div>
    </div>
  );
};

export default VideoCard;
