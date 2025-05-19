"use client";

import { fetchAllUserVideos } from "@/lib/api";
import { Video } from "@prisma/client";
import React from "react";
import useSWR from "swr";
import SidebarRepoHeader from "./left-sidebar-repo-header";
import LeftSidebarVideoList from "./left-sidebar-video-list";

interface LeftSidebarProps {
  initialVideos: Video[];
}

export function LeftSidebar({ initialVideos }: LeftSidebarProps) {
  const { data: videos } = useSWR<Video[]>(fetchAllUserVideos, {
    fallbackData: initialVideos,
  });

  return (
    <div className="w-full md:fixed md:inset-y-0 md:left-0 md:w-96 bg-background md:border-r md:border-dashed md:pt-16">
      <SidebarRepoHeader />
      {videos && <LeftSidebarVideoList videos={videos} />}
    </div>
  );
}

export default LeftSidebar;
