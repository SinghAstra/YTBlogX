"use client";

import { Blog } from "@/components/result/blog-content";
import { VideoMetadata } from "@/components/result/video-metadata";
import { useConversionStatus } from "@/hooks/use-conversion-status";
import { ConversionStatus } from "@/types/conversion";
import { useParams } from "next/navigation";

export default function ResultPage() {
  const { conversionId } = useParams();
  const conversionResult = useConversionStatus(conversionId as string);

  if (
    !conversionResult ||
    !conversionResult.result?.metadata ||
    !conversionResult.result
  ) {
    // TODO: Build Custom 404 Page
    return <p>Page not found</p>;
  }

  if (conversionResult.status !== ConversionStatus.COMPLETED) {
    //TODO: Redirect to /convert/processing
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Processing your blog... Current status: {conversionResult.status}</p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6 mx-auto">
      <VideoMetadata videoMetaData={conversionResult.result?.metadata} />
      <Blog blog={conversionResult.result.blogContent} />
    </div>
  );
}
