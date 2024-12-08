"use client";

import { Card } from "@/components/ui/card";
import { FileText, Loader2 } from "lucide-react";

interface BlogPostPreviewProps {
  content: string;
  isGenerating: boolean;
}

export function BlogPostPreview({
  content,
  isGenerating,
}: BlogPostPreviewProps) {
  return (
    <Card className="relative overflow-hidden h-[500px]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
      <div className="relative p-6 h-full">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div className="h-[calc(100%-2rem)] overflow-auto">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Generating your blog post...</p>
            </div>
          ) : content ? (
            <div className="prose prose-invert max-w-none">{content}</div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground">
              <FileText className="h-12 w-12" />
              <p>Your generated blog post will appear here</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
