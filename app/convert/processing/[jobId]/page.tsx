"use client";

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Brain, Cog, FileText, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const stages = [
  {
    status: "PENDING",
    icon: Cog,
    title: "Initializing",
    description: "Setting up your conversion request",
  },
  {
    status: "METADATA_FETCHING",
    icon: Video,
    title: "Fetching Video Data",
    description: "Retrieving video information from YouTube",
  },
  {
    status: "TRANSCRIPT_EXTRACTING",
    icon: FileText,
    title: "Extracting Transcript",
    description: "Converting speech to text",
  },
  {
    status: "AI_PROCESSING",
    icon: Brain,
    title: "AI Processing",
    description: "Transforming video content into blog format",
  },
];

export default function ProcessingPage() {
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
          router.push(`/convert/result/${jobId}`);
        } else if (data.status === "FAILED") {
          toast({ description: data.error || "Conversion failed" });
        }
      } catch (error) {
        console.error("Status polling error:", error);
        toast({ description: "Unable to check job status" });
      }
    };

    const intervalId = setInterval(pollJobStatus, 5000);
    return () => clearInterval(intervalId);
  }, [router, toast, jobId]);

  const currentStageIndex = stages.findIndex(
    (stage) => stage.status === status
  );

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-2">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2 pt-2">
          <h2 className="text-2xl font-bold tracking-tight">
            {stages[currentStageIndex]?.title || "Processing"} -{" "}
            <span className="text-primary">{progress}%</span>
          </h2>
          <p className="text-muted-foreground">
            {stages[currentStageIndex]?.description ||
              "Please wait while we process your video"}
          </p>
        </div>

        {/* Stages */}
        <div className="grid grid-cols-4 gap-4 pt-4">
          {stages.map((stage, index) => {
            const isActive = index === currentStageIndex;
            const isCompleted = index < currentStageIndex;
            const Icon = stage.icon;

            return (
              <div
                key={stage.status}
                className={cn(
                  "relative flex flex-col items-center p-4 rounded-lg transition-all duration-200",
                  isActive && "bg-secondary",
                  isCompleted && "text-primary"
                )}
              >
                <div
                  className={cn(
                    "p-3 rounded-full mb-3",
                    isActive &&
                      "bg-primary text-primary-foreground animate-pulse",
                    !isActive && !isCompleted && "bg-muted"
                  )}
                >
                  <Icon className={cn("w-6 h-6")} />
                </div>
                <h3 className="text-sm font-medium text-center">
                  {stage.title}
                </h3>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {stage.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
