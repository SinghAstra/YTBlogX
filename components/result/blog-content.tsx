"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ConversionStatus, ConversionStatusData } from "@/types/conversion";
import { AlertCircle, Copy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";
import MarkdownRenderer from "./markdown-renderer";

interface BlogContentProps {
  conversionData: ConversionStatusData;
}

export function Blog({ conversionData }: BlogContentProps) {
  const { toast } = useToast();

  // Loading state
  if (!conversionData.result) {
    return (
      <Card className="flex flex-col">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <Separator />
        <div className="p-6">
          <Skeleton className="h-96 w-full" />
        </div>
      </Card>
    );
  }

  // Error state
  if (
    conversionData.status !== ConversionStatus.COMPLETED ||
    !conversionData.result.blogContent
  ) {
    return (
      <Card className="flex flex-col">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Blog Generation Failed</AlertTitle>
          <AlertDescription>
            Unable to generate blog content. Please try again.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      conversionData.result?.blogContent.content ?? ""
    );
    toast({
      description: "Blog content copied to clipboard",
      variant: "default",
    });
  };

  return (
    <Card className="flex flex-col">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {conversionData.result.blogContent.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {conversionData.result.blogContent.summary}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>
      </div>
      <Separator />
      <div className="prose prose-invert p-6">
        <MarkdownRenderer content={conversionData.result.blogContent.content} />
      </div>
    </Card>
  );
}
