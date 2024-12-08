import React from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const VideoPreviewSkeleton = () => {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-card/50 via-card/30 to-card/50">
      <div className="relative w-full aspect-video">
        <Skeleton className="absolute inset-0" />
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </Card>
  );
};

export default VideoPreviewSkeleton;
