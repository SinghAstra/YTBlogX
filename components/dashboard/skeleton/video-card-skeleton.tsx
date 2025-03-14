import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const VideoCardSkeleton = () => {
  return (
    <div className="p-2 flex gap-2 flex-col rounded-sm border">
      {/* Thumbnail skeleton */}
      <div className="relative w-full h-[200px]">
        <Skeleton className="w-full h-full rounded-sm" />
      </div>

      {/* Bottom section with avatar and text */}
      <div className="flex gap-2 items-center">
        {/* Avatar skeleton */}
        <div className="relative w-8 h-8">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Text content skeleton */}
        <div className="space-y-1 flex-1">
          {/* Title skeleton - two lines */}
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5 mt-1" />

          {/* Channel name skeleton */}
          <Skeleton className="h-2 w-2/3 mt-2" />
        </div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;
