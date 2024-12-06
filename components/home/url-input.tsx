"use client";

import { Sparkles, Video } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function UrlInput() {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted URL:", url);
  };

  return (
    <div className="w-full max-w-3xl relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-lg blur-xl" />
      <form
        onSubmit={handleSubmit}
        className="relative bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-primary/20"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Input
              type="url"
              placeholder="Paste your YouTube video URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 pl-12 bg-background/50 border-muted-foreground/20"
            />
            <Video className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-12 px-8 bg-primary hover:bg-primary/90"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Blog
          </Button>
        </div>
      </form>
    </div>
  );
}
