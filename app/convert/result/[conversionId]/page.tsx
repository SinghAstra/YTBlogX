"use client";

import { Blog } from "@/components/result/blog-content";
import { VideoMetadata } from "@/components/result/video-metadata";
import { useConversionStatus } from "@/hooks/use-conversion-status";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResultPage() {
  const { conversionId } = useParams();
  const conversionData = useConversionStatus(conversionId as string);
  const router = useRouter();

  useEffect(() => {
    // Redirect if no conversion ID
    // TODO:Check for Valid Conversion ID
    if (!conversionId) {
      router.push("/convert/new");
      return;
    }
  }, [conversionId, conversionData.status, router]);

  return (
    <div className="container max-w-6xl py-8 space-y-6 mx-auto">
      <VideoMetadata conversionData={conversionData} />
      <Blog conversionData={conversionData} />
    </div>
  );
}
