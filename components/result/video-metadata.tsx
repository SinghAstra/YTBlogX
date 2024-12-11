"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VideoMetaData } from "@/types/youtube";
import { ExternalLink, Share2 } from "lucide-react";
import Image from "next/image";

interface VideoMetadataProps {
  videoMetaData: VideoMetaData;
}

export function VideoMetadata({ videoMetaData }: VideoMetadataProps) {
  if (
    !videoMetaData.thumbnail ||
    !videoMetaData.title ||
    !videoMetaData.description
  ) {
    return;
  }
  // TODO:Fix the watch Video Url Fetch the same metadata and entire metadata every time

  return (
    <Card className="p-6">
      <div className="flex gap-6">
        <div className="relative w-48 h-28 rounded-lg overflow-hidden">
          <Image
            src={videoMetaData.thumbnail}
            alt={videoMetaData.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold line-clamp-2">
            {videoMetaData.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {videoMetaData.description}
          </p>
          <div className="flex gap-3 mt-4">
            <Button size="sm" variant="outline" asChild>
              {/* <a href={videoMetaData.videoUrl} target="_blank" rel="noopener noreferrer"> */}
              <ExternalLink className="w-4 h-4 mr-2" />
              Watch Video
              {/* </a> */}
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share Blog
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
