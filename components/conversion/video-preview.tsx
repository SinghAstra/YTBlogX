"use client";

import { fetchVideoMetadata } from "@/app/actions/youtube";
import { Card } from "@/components/ui/card";
import {
  extractVideoId,
  formatDuration,
  formatViewCount,
} from "@/lib/youtube/utils";
import { VideoMetaData } from "@/types/youtube";
import { Clock, ExternalLink, Eye } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import VideoPreviewSkeleton from "./video-preview-skeleton";

interface VideoPreviewProps {
  url: string;
}

export function VideoPreview({ url }: VideoPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [videoDetails, setVideoDetails] = useState<VideoMetaData>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideoDetails() {
      try {
        setIsLoading(true);
        setError(null);

        const videoId = extractVideoId(url);
        if (!videoId) {
          throw new Error("Invalid YouTube URL");
        }

        const videoMetaData = await fetchVideoMetadata(videoId);
        setVideoDetails(videoMetaData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load video details"
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (url) {
      loadVideoDetails();
    }
  }, [url]);

  if (error) {
    return (
      <Card className="p-4 bg-destructive/10 text-destructive">
        <p>{error}</p>
      </Card>
    );
  }

  if (isLoading) {
    return <VideoPreviewSkeleton />;
  }

  if (!videoDetails) return <h1>Building...</h1>;

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-card/50 via-card/30 to-card/50 backdrop-blur-sm border-border/50">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/0 z-10" />
        <div className="relative w-full aspect-video">
          {videoDetails.thumbnail && (
            <Image
              src={videoDetails.thumbnail}
              alt="Video thumbnail"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          )}
        </div>
        <div className="absolute bottom-4 right-4 z-20">
          <Button
            size="sm"
            className="bg-primary/90 hover:bg-primary/100 backdrop-blur-sm"
            onClick={() => window.open(url, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Watch on YouTube
          </Button>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold leading-tight mb-2">
            {videoDetails.videoTitle}
          </h3>
          <p className="text-muted-foreground">{videoDetails.channelTitle}</p>
        </div>
        <div className="flex items-center gap-6">
          {videoDetails.viewCount && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{formatViewCount(videoDetails.viewCount)} views</span>
            </div>
          )}
          {videoDetails.videoDuration && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(videoDetails.videoDuration)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
