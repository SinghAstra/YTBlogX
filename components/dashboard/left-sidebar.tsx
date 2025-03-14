import { Video } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export function LeftSidebar() {
  const [videos, setVideos] = useState<Video[]>();
  const [isFetchingVideos, setIsFetchingVideos] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("/api/video");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        setVideos(data.videos);
      } catch (error) {
        if (error instanceof Error) {
          console.log("error.stack is ", error.stack);
          console.log("error.message is ", error.message);
        }
        setMessage("Check Your Network Connection");
      } finally {
        setIsFetchingVideos(false);
      }
    }
    fetchVideos();
  }, []);

  useEffect(() => {
    if (!message) return;
    toast(message);
    setMessage(null);
  }, [message]);
  return (
    <div className="fixed inset-y-0 left-0 w-96 bg-background border-r pt-16 flex flex-col h-screen">
      {isFetchingVideos ? (
        <p>Fetching Videos</p>
      ) : videos && videos.length > 0 ? (
        videos.map((video) => {
          return (
            <div key={video.id} className="border-b border-dotted py-4">
              <h3>{video.title}</h3>
            </div>
          );
        })
      ) : (
        <p>You have no videos Get Started.</p>
      )}
    </div>
  );
}

export default LeftSidebar;
