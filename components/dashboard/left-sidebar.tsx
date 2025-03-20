import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { setUserVideos, useVideo } from "../context/video";
import EmptyLeftSidebar from "./empty/left-sidebar";
import SidebarRepoHeader from "./left-sidebar-repo-header";
import VideoCardSkeleton from "./skeleton/video-card-skeleton";
import VideoCard from "./video-card";

export function LeftSidebar() {
  const [isFetchingVideos, setIsFetchingVideos] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);
  const { state, dispatch } = useVideo();
  const videos = state.userVideos;

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("/api/video");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        dispatch(setUserVideos(data.videos));
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
    <div className="fixed inset-y-0 left-0 w-96 bg-background border-r border-dotted pt-16 flex flex-col h-screen">
      <SidebarRepoHeader />
      {isFetchingVideos ? (
        <div className="flex flex-col gap-2 flex-1 overflow-auto p-2">
          {[1, 2, 3, 4].map((i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : videos && videos.length > 0 ? (
        <div className="flex flex-col gap-2 flex-1 overflow-auto p-2">
          {videos.map((video) => {
            return <VideoCard key={video.id} video={video} />;
          })}
        </div>
      ) : (
        <EmptyLeftSidebar />
      )}
    </div>
  );
}

export default LeftSidebar;
