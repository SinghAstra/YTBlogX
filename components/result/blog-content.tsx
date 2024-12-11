"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { BlogContent } from "@/types/blog";
import { Copy } from "lucide-react";
import MarkdownRenderer from "./markdown-renderer";

interface BlogContentProps {
  blog: BlogContent;
}

export function Blog({ blog }: BlogContentProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(blog.content);
    toast({
      description: "Blog content copied to clipboard",
    });
  };

  return (
    <Card className="flex flex-col">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">Blog Content</h3>
            <p className="text-sm text-muted-foreground mt-1">{blog.summary}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>
      </div>
      <Separator />
      <div className="prose prose-invert p-6">
        <MarkdownRenderer content={blog.content} />
      </div>
    </Card>
  );
}
