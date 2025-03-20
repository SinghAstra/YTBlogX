"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Terminal from "@/components/ui/terminal";
import { ProcessingUpdate } from "@/interfaces/processing";
import pusherClient from "@/lib/pusher/client";
import { Video } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const RepoProcessingLogs = () => {
  const params = useParams();
  const router = useRouter();
  const [isFetchingVideo, setIsFetchingVideo] = useState(true);
  const videoId = params.videoId as string;
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
        setVideo(data.video);

        if (data.video.processingState === "COMPLETED") {
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
  }, [video, videoId, setMessage, router]);

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
    <div className=" p-2 container mx-auto max-w-2xl w-full ">
      {isFetchingVideo ? <TerminalSkeleton /> : <Terminal logs={logs} />}
    </div>
  );
};

export default RepoProcessingLogs;
