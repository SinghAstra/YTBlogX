"use client";

import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Terminal from "@/components/ui/terminal";
import { ProcessingUpdate } from "@/interfaces/processing";
import pusherClient from "@/lib/pusher/client";
import { Video } from "@prisma/client";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface RepoProcessingLogsProps {
  video: Video;
}

const RepoProcessingLogs = ({ video }: RepoProcessingLogsProps) => {
  const router = useRouter();
  const [logs, setLogs] = useState<ProcessingUpdate[]>([]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`video-${video.id}`);

    channel.bind("processing-update", (update: ProcessingUpdate) => {
      // Add log line
      setLogs((prevLogs) => [...prevLogs, update]);

      if (update.status === "COMPLETED") {
        console.log("-----------------------------------");
        console.log("Inside update.status === COMPLETED");
        console.log("update is ", update);
        console.log("-----------------------------------");
        router.replace(`/video/${video.id}`);
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`video-${video.id}`);
    };
  }, [video, router]);

  return (
    <MaxWidthWrapper>
      <div className="flex border py-2 pl-2 rounded-md">
        <div className="max-w-lg w-full ">
          <div className="relative w-full h-[400px] ">
            <Image
              src={video.videoThumbnail}
              alt={video.title}
              fill
              className="rounded-l-md object-cover "
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
        </div>
        <div className="flex-1 w-full ">{<Terminal logs={logs} />}</div>
      </div>
    </MaxWidthWrapper>
  );
};

export default RepoProcessingLogs;
