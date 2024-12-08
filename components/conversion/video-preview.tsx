"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoPreviewProps {
  url: string;
}

export function VideoPreview({ url }: VideoPreviewProps) {
  // In a real app, we'd fetch video details from YouTube API
  // For now, showing a mock preview
  console.log("url is ", url);
  return (
    <Card className="p-4 bg-card/50">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-64 aspect-video rounded-lg overflow-hidden">
          <Skeleton className="absolute inset-0" />
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-4 mt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </Card>
  );
}
