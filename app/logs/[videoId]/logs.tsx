"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Terminal from "@/components/ui/terminal";
import pusherClient from "@/lib/pusher/client";
import { Log, Video } from "@prisma/client";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface VideoWithLogs extends Video {
  logs: Log[];
}

interface VideoLogsProps {
  video: VideoWithLogs;
}

const VideoLogs = ({ video }: VideoLogsProps) => {
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>(video.logs);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const channel = pusherClient.subscribe(`video-${video.id}`);

    channel.bind("processing-update", (log: Log) => {
      setLogs((prevLogs) => [...prevLogs, log]);

      if (log.status === "COMPLETED") {
        router.replace(`/video/${video.id}`);
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`video-${video.id}`);
    };
  }, [video, router]);

  return (
    <div className="px-16 w-full">
      <div className="flex border py-2 pl-2 rounded-md h-[calc(100vh-10rem)] ">
        <div className="w-full h-full relative rounded-sm overflow-hidden max-w-lg">
          {!isImageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted/20 via-muted/40 to-muted/60" />
          )}
          <Image
            src={video.videoThumbnail}
            alt={video.title}
            fill
            onLoad={() => setIsImageLoaded(true)}
            className={`object-cover rounded-l-md transition-opacity duration-700 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-b from-black/80 via-black/90 to-black">
            <div className="flex gap-2 items-center">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={video.channelThumbnail}
                  alt={video.channelName || "Channel"}
                />
                <AvatarFallback>
                  <UserIcon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-md  line-clamp-2 leading-tight">
                  {video.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {video.channelName}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 w-full ">{<Terminal logs={logs} />}</div>
      </div>
    </div>
  );
};

export default VideoLogs;
