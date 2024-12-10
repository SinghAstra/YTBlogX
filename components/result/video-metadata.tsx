"use client";

import { fetchVideoMetadata } from "@/app/actions/youtube";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Job } from "@/lib/jobs/job-status";
import { extractVideoId } from "@/lib/youtube";
import { ExternalLink, Share2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { VideoMetadataSkeleton } from "./video-metadata-skeleton";

interface VideoData {
  title: string;
  thumbnail: string;
  description: string;
}

interface VideoMetadataProps {
  job: Job;
}

export function VideoMetadata({ job }: VideoMetadataProps) {
  console.log("job --VideoMetadata is ", job);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setIsLoading(true);
        const videoId = extractVideoId(job.videoUrl);
        if (!videoId) {
          console.log("No videoId found. --fetchVideoData");
          return;
        }
        const data = await fetchVideoMetadata(videoId);
        setVideoData({
          title: data.items[0].snippet.title,
          thumbnail: data.items[0].snippet.thumbnails.medium.url,
          description: data.items[0].snippet.description,
        });
      } catch (error) {
        console.log("error --fetchedVideoData is ", error);
        toast({
          title: "Error fetching video data",
          description: "fetchVideoData",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideoData();
  }, [job.videoUrl, toast]);

  if (!job.metadata) return null;

  if (isLoading) {
    return <VideoMetadataSkeleton />;
  }

  if (!videoData) {
    return;
  }

  return (
    <Card className="p-6">
      <div className="flex gap-6">
        <div className="relative w-48 h-28 rounded-lg overflow-hidden">
          <Image
            src={videoData.thumbnail}
            alt={videoData.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold line-clamp-2">
            {videoData.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {videoData.description}
          </p>
          <div className="flex gap-3 mt-4">
            <Button size="sm" variant="outline" asChild>
              <a href={job.videoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Watch Video
              </a>
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
