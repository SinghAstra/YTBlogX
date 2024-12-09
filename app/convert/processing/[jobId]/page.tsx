"use client";

import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function JobStatusPoller() {
  const { jobId } = useParams();
  const [status, setStatus] = useState<string>("PENDING");
  const [progress, setProgress] = useState<number>(0);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const statusMap: Record<string, number> = {
      PENDING: 10,
      METADATA_FETCHING: 30,
      TRANSCRIPT_EXTRACTING: 50,
      AI_PROCESSING: 75,
      COMPLETED: 100,
    };

    const pollJobStatus = async () => {
      try {
        const response = await fetch(`/api/convert/status?jobId=${jobId}`);
        const data = await response.json();

        setStatus(data.status);
        setProgress(statusMap[data.status] || 0);

        if (data.status === "COMPLETED") {
          // Redirect to result page
          router.push(`/convert/result/${jobId}`);
        } else if (data.status === "FAILED") {
          toast({ description: data.error || "Conversion failed" });
        }
      } catch (error) {
        console.error("Status polling error:", error);
        toast({ description: "Unable to check job status" });
      }
    };

    const intervalId = setInterval(pollJobStatus, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [jobId, router, toast]);

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-center mt-2">{status.replace("_", " ")}</p>
    </div>
  );
}
