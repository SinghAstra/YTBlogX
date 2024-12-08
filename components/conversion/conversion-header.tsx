"use client";
import { VideoIcon } from "lucide-react";

export function ConversionHeader() {
  return (
    <header className="border-b border-border/40 bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-card/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <VideoIcon className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">YTBlogX</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Step 1 of 3: Video Details
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
