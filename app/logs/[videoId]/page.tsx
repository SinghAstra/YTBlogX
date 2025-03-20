"use client";

import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Terminal from "@/components/ui/terminal";
import { ProcessingUpdate } from "@/interfaces/processing";
import pusherClient from "@/lib/pusher/client";
import { Video } from "@prisma/client";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const RepoProcessingLogs = () => {
  const params = useParams();
  const router = useRouter();
  const [isFetchingVideo, setIsFetchingVideo] = useState(true);
  const videoId = params.videoId as string;
  console.log("videoId is ", videoId);
  const [video, setVideo] = useState<Video>();
  const [logs, setLogs] = useState<ProcessingUpdate[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsFetchingVideo(true);
        const response = await fetch(`/api/video/${videoId}`);
        const data = await response.json();
        if (!response.ok) {
          setMessage(data.message);
          return;
        }
        setVideo(data);

        console.log("data is ", data);

        if (data.processingState === "COMPLETED") {
          console.log("data.repository.status is ", data.repository.status);
          router.replace(`/video/${videoId}`);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error message:", error.message);
          console.log("Error stack:", error.stack);
        }
        setMessage("Network Connectivity Problem. Please try again.");
      } finally {
        setIsFetchingVideo(false);
      }
    };
    fetchVideo();
  }, [videoId, setMessage, router]);

  useEffect(() => {
    if (!message) return;
    toast(message);
    setMessage(null);
  }, [message, setMessage]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`video-${videoId}`);

    channel.bind("processing-update", (update: ProcessingUpdate) => {
      // Add log line
      setLogs((prevLogs) => [...prevLogs, update]);

      if (update.status === "COMPLETED") {
        console.log("-----------------------------------");
        console.log("Inside update.status === SUCCESS");
        console.log("update is ", update);
        console.log("-----------------------------------");
        router.replace(`/video/${videoId}`);
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`video-${videoId}`);
    };
  }, [videoId, router]);

  const TerminalSkeleton = () => {
    // Create an array of 5 fake log entries for the skeleton
    const skeletonLogs = Array(5).fill(null);

    return (
      <div className="w-full bg-background">
        <div className="relative">
          <div className="bg-card rounded-lg border border-border">
            <div
              className="rounded-md p-4 font-mono text-sm space-y-4"
              style={{ height: "400px" }}
            >
              {skeletonLogs.map((_, index) => (
                <div key={index} className="flex items-start space-x-3">
                  {/* Time skeleton */}
                  <Skeleton className="h-4 w-16" />

                  {/* Message skeleton - varying widths for more natural look */}
                  <Skeleton
                    className={`h-4 ${index % 2 === 0 ? "w-3/4" : "w-1/2"}`}
                  />

                  {/* Status skeleton - show on some entries */}
                  {index % 3 === 0 && <Skeleton className="h-4 w-16" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MaxWidthWrapper>
      <div className="flex border p-2 rounded-md">
        <div className="max-w-lg w-full ">
          {video && (
            <div className="relative w-full h-[400px] ">
              <Image
                src={video.videoThumbnail}
                alt={video.title}
                fill
                className="rounded-l-md object-cover "
              />
              {/* <div className="absolute inset-0 bg-muted/80"></div> */}
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
          )}
        </div>
        <div className="flex-1 w-full ">
          {isFetchingVideo ? <TerminalSkeleton /> : <Terminal logs={logs} />}
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default RepoProcessingLogs;
