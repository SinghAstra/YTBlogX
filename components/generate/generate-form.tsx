"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Video, Wand2 } from "lucide-react";
import { useState } from "react";
import { GenerateOptions } from "./generate-options";

interface GenerateFormProps {
  onGenerate: (url: string) => void;
  isGenerating: boolean;
}

export function GenerateForm({ onGenerate, isGenerating }: GenerateFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onGenerate(url);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10" />
      <div className="relative p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Video Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="url"
                placeholder="Enter YouTube URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 focus:border-primary"
              />
              <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:opacity-90 transition-opacity"
              disabled={isGenerating || !url.trim()}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Blog Post"}
            </Button>
          </form>
        </div>

        <GenerateOptions />
      </div>
    </Card>
  );
}
