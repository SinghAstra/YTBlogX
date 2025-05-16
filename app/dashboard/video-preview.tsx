"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { VideoInfo } from "@/interfaces/video";
import Image from "next/image";

interface VideoPreviewProps {
  videoDetails: VideoInfo;
}

export function VideoPreview({ videoDetails }: VideoPreviewProps) {
  const { title, channelName, videoThumbnail, channelThumbnail } = videoDetails;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3 aspect-video relative bg-gray-100 rounded-md overflow-hidden">
            <Image
              src={videoThumbnail}
              alt={title}
              width={320}
              height={180}
              className="object-cover"
            />
          </div>
          <div className="w-full md:w-2/3">
            <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
            <div className=" flex gap-2 items-center ">
              <Avatar>
                <AvatarImage src={channelThumbnail} />
                <AvatarFallback>{channelName[0]}</AvatarFallback>
              </Avatar>

              <p className="text-sm text-muted-foreground mt-1">
                {channelName}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
