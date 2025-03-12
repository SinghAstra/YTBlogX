"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateBlogContent, splitTranscript } from "@/lib/ai-processor";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

function DemoPage() {
  const [url, setUrl] = useState(
    "https://www.youtube.com/watch?v=KzH1ovd4Ots&list=PLoROMvodv4rNH7qL6-efu_q2_bPuy0adh&index=1&t=3620s"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [transcriptChunks, setTranscriptChunks] = useState<string[]>([]);
  const [blogPostChunks, setBlogPostChunks] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTranscriptChunks([]);
    setBlogPostChunks([]);

    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    if (!match) {
      setMessage("Invalid YouTube URL");
      setIsSubmitting(false);
      return;
    }

    const videoId = match[4];

    try {
      const response = await fetch(`/api/transcript?videoId=${videoId}`);
      const data = await response.json();
      setTranscriptChunks(splitTranscript(data.transcript, 8000));

      if (!response.ok)
        setMessage(data.message || "Failed to fetch transcript");

      const blogContent = await generateBlogContent(data.transcript);
      setBlogPostChunks(blogContent);
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
    toast(message);
    setMessage(null);
  }, [message]);

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
              "Get Blog Post"
            )}
          </Button>
        </form>
      </div>
      <div className=" p-3 flex gap-4">
        <div className="flex flex-col gap-4">
          {transcriptChunks &&
            transcriptChunks.map((chunk, index) => {
              return (
                <div key={index}>
                  <div className="p-3 border rounded-md bg-muted text-muted-foreground max-w-xl">
                    <h3 className="text-lg font-medium">Part {index}:</h3>
                    <pre className="text-sm whitespace-pre-wrap break-words">
                      {chunk}
                    </pre>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="flex flex-col gap-4">
          {blogPostChunks &&
            blogPostChunks.map((chunk, index) => {
              return (
                <div key={index}>
                  <div className="p-3 border rounded-md bg-muted text-muted-foreground max-w-xl">
                    <h3 className="text-lg font-medium">Part {index}:</h3>
                    <pre className="text-sm whitespace-pre-wrap break-words">
                      {chunk}
                    </pre>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default DemoPage;
