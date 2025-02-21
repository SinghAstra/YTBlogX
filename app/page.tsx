"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function HomePage() {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+$/;
    if (!youtubeRegex.test(url)) {
      setError("Invalid YouTube URL");
      return;
    }
    setError("");
    console.log("Valid URL submitted:", url);
    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-96 p-4 shadow-xl">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter YouTube video URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default HomePage;
