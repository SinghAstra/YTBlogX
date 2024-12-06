"use client";

import { UrlInput } from "./url-input";

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">
      <div className="text-center mb-8 space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Transform{" "}
          <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient">
            YouTube Videos
          </span>{" "}
          into
          <br />
          Professional Blog Posts
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Generate engaging blog content from YouTube videos instantly using AI
          technology. Just paste a URL and let our tool do the rest.
        </p>
      </div>
      <UrlInput />
    </div>
  );
}
