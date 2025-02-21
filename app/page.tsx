"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

function splitTranscript(transcript: string, chunkSize: number = 10000) {
  const sentences = transcript.split(/(?<=[.!?])\s+/); // Split at sentence boundaries
  const chunks = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize) {
      chunks.push(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk += " " + sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

function HomePage() {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTranscript("");

    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)$/;
    const match = url.match(youtubeRegex);
    if (!match) {
      setError("Invalid YouTube URL");
      setIsSubmitting(false);
      return;
    }

    setError("");
    const videoId = match[4];

    try {
      const response = await fetch(`/api/transcript?videoId=${videoId}`);
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch transcript");

      setTranscript(data.transcript);
      console.log(splitTranscript(data.transcript));
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setError("Failed to fetch transcript");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="max-w-xl w-full p-6 border rounded-lg bg-card shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter YouTube video URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border border-border p-2 rounded-md w-full"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Fetching...
              </>
            ) : (
              "Get Transcript"
            )}
          </Button>
        </form>
        {transcript && (
          <div className="mt-4 p-3 border rounded-md bg-muted text-muted-foreground">
            <h3 className="text-lg font-bold">Transcript:</h3>
            <p className="text-sm whitespace-pre-wrap break-words">
              {transcript}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
