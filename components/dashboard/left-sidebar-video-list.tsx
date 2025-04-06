import React from "react";
import { useVideo } from "../context/video";
import EmptyLeftSidebar from "./empty/left-sidebar";
import VideoCard from "./video-card";

const SidebarRepoList = () => {
  const { state } = useVideo();

  if (!state.userVideos || state.userVideos.length === 0) {
    return <EmptyLeftSidebar />;
  }

  return (
    <div className=" flex-1 flex flex-col gap-4 h-full overflow-y-auto px-4">
      {state.userVideos.map((video) => {
        return <VideoCard key={video.id} video={video} />;
      })}
    </div>
  );
};

export default SidebarRepoList;
