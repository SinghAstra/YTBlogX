"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConversionStatusData } from "@/types/conversion";
import { ExternalLink, Share2 } from "lucide-react";
import Image from "next/image";
import { VideoMetadataSkeleton } from "./video-metadata-skeleton";

interface VideoMetadataProps {
  conversionData: ConversionStatusData;
}

export function VideoMetadata({ conversionData }: VideoMetadataProps) {
  const conversionResult = conversionData.result;
  if (!conversionResult) {
    return <VideoMetadataSkeleton />;
  }

  if (!conversionResult?.metadata) {
    return;
  }
  const { thumbnail, videoTitle, videoDescription } =
    conversionResult?.metadata;

  if (!thumbnail || !videoTitle || !videoDescription) {
    return null;
  }
  // TODO:Fix the watch Video Url Fetch the same metadata and entire metadata every time

  return (
    <Card className="p-6">
      <div className="flex gap-6">
        <div className="relative w-48 h-28 rounded-lg overflow-hidden">
          <Image
            src={thumbnail}
            alt={videoTitle}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold line-clamp-2">{videoTitle}</h2>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {videoDescription}
          </p>
          <div className="flex gap-3 mt-4">
            <Button size="sm" variant="outline" asChild>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Watch Video
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href="https://www.youtube.com">
                <Share2 className="w-4 h-4 mr-2" />
                Share Blog
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
