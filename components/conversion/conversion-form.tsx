"use client";

import { ConversionOptions } from "@/components/conversion/conversion-options";
import { VideoPreview } from "@/components/conversion/video-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle, ClipboardIcon, XCircle } from "lucide-react";
import { useState } from "react";

export function ConversionForm() {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const validateYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return regex.test(url);
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    const valid = validateYouTubeUrl(value);
    setIsValid(value ? valid : null);
    setShowPreview(valid);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleUrlChange(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">
            Convert YouTube Video to Blog
          </h2>
          <p className="text-muted-foreground text-center">
            Enter a YouTube URL to start the conversion process
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="url"
              placeholder="Paste YouTube URL here..."
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              className={cn(
                "pr-24 h-12 text-lg",
                isValid === true && "border-green-500",
                isValid === false && "border-red-500"
              )}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handlePaste}
            >
              <ClipboardIcon className="h-4 w-4 mr-2" />
              Paste
            </Button>
          </div>

          {isValid !== null && (
            <div className="flex items-center gap-2 text-sm">
              {isValid ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">Valid YouTube URL</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">Invalid YouTube URL</span>
                </>
              )}
            </div>
          )}
        </div>

        {showPreview && (
          <div className="space-y-8 animate-in fade-in-50 duration-500">
            <VideoPreview url={url} />
            <ConversionOptions />
            <div className="flex justify-center">
              <Button size="lg" className="w-full max-w-sm">
                Start Conversion
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}