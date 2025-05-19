import { Video } from "@prisma/client";
import React from "react";
import EmptyLeftSidebar from "./empty/left-sidebar";
import VideoCard from "./video-card";

interface SidebarRepoListProps {
  videos: Video[];
}

const SidebarRepoList = ({ videos }: SidebarRepoListProps) => {
  if (videos.length === 0) {
    return <EmptyLeftSidebar />;
  }

  return (
    <div className=" flex-1 flex flex-col gap-4 h-full overflow-y-auto px-4">
      {videos.map((video) => {
        return <VideoCard key={video.id} video={video} />;
      })}
    </div>
  );
};

export default SidebarRepoList;
