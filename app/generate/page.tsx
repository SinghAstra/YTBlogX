"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Video, Wand2 } from "lucide-react";
import { useState } from "react";

export default function GeneratePage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    // TODO: Implement generation logic
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <main className="min-h-screen w-full py-6 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 animate-gradient">
            Generate Blog Post
          </h1>
          <p className="text-muted-foreground">
            Transform any YouTube video into a professional blog post with AI
          </p>
        </div>

        {/* URL Input Card */}
        <Card className="p-6 border border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold">YouTube URL</h2>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Paste your YouTube video URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-background/50"
              />
              <Button
                onClick={handleGenerate}
                disabled={!url || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Generate
              </Button>
            </div>
          </div>
        </Card>

        {/* Preview Section */}
        <div className="space-y-4">
          <Separator className="bg-border/50" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border border-border/50 bg-card/50">
              <h3 className="text-lg font-semibold mb-4">Video Preview</h3>
              <div className="aspect-video bg-background/80 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  Video thumbnail will appear here
                </p>
              </div>
            </Card>
            <Card className="p-6 border border-border/50 bg-card/50">
              <h3 className="text-lg font-semibold mb-4">Metadata</h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Title: Not loaded</p>
                <p className="text-muted-foreground">Duration: --:--</p>
                <p className="text-muted-foreground">Channel: Unknown</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Generated Content Section (Initially Hidden) */}
        {false && (
          <Card className="p-6 border border-border/50 bg-card/50">
            <h3 className="text-lg font-semibold mb-4">Generated Blog Post</h3>
            <div className="prose prose-invert max-w-none">
              {/* Generated content will go here */}
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
