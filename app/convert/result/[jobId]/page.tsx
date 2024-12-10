"use client";

import { BlogContent } from "@/components/result/blog-content";
import { VideoMetadata } from "@/components/result/video-metadata";
import { useToast } from "@/hooks/use-toast";
import { Job } from "@/lib/jobs/job-status";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/convert/job?jobId=${jobId}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.log("error --fetchJob is ", error);
        toast({
          title: "Error",
          description: "Failed to load blog content",
        });
      }
    };

    fetchJob();
  }, [jobId, toast]);

  if (!job) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8 space-y-6 mx-auto">
      <VideoMetadata job={job} />
      {job.result && <BlogContent content={job.result} />}
    </div>
  );
}
