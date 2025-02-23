"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const CaptureFrame = () => {
  const [url, setUrl] = useState(
    "https://www.youtube.com/watch?v=KzH1ovd4Ots&list=PLoROMvodv4rNH7qL6-efu_q2_bPuy0adh&index=1&t=3620s"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    if (!match) {
      setMessage("Invalid YouTube URL");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/capture-frame?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();

      if (!response.ok)
        setMessage(data.message || "Failed to fetch Video Frame");
      setFrames(data.frames);
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setMessage("Check Your Network Connectivity.");
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!message) return;
    toast({
      title: message,
    });
    setMessage(null);
  }, [toast, message]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="max-w-xl w-full p-6 border rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter YouTube video URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border border-border p-2 rounded-md w-full"
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Fetching...
              </>
            ) : (
              "Get Video Frame"
            )}
          </Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {frames.map((frame, index) => (
            <Image
              key={index}
              src={frame}
              alt={`Frame ${index}`}
              width="192"
              height="192"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaptureFrame;
