"use client";

import { Video } from "@prisma/client";
import React, { useEffect } from "react";
import { setUserVideos, useVideo } from "../context/video";
import SidebarRepoHeader from "./left-sidebar-repo-header";
import LeftSidebarVideoList from "./left-sidebar-video-list";

interface LeftSidebarProps {
  videos: Video[];
}

export function LeftSidebar({ videos }: LeftSidebarProps) {
  const { state, dispatch } = useVideo();

  useEffect(() => {
    if (videos && state.userVideos.length === 0) {
      dispatch(setUserVideos(videos));
    }
  }, [dispatch, videos, state.userVideos.length]);

  return (
    <div className="w-full md:fixed md:inset-y-0 md:left-0 md:w-96 bg-background md:border-r md:border-dashed md:pt-16">
      <SidebarRepoHeader />
      <LeftSidebarVideoList />
    </div>
  );
}

export default LeftSidebar;
