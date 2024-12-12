"use client";

import { Button } from "@/components/ui/button";
import { useConversionStatus } from "@/hooks/use-conversion-status";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ConversionStatus } from "@/types/conversion";
import { Brain, Cog, FileText, Video, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const stages = [
  {
    status: ConversionStatus.PENDING,
    icon: Cog,
    title: "Initializing",
    description: "Setting up your conversion request",
  },
  {
    status: ConversionStatus.METADATA_FETCHING,
    icon: Video,
    title: "Fetching Video Data",
    description: "Retrieving video information from YouTube",
  },
  {
    status: ConversionStatus.TRANSCRIPT_EXTRACTING,
    icon: FileText,
    title: "Extracting Transcript",
    description: "Converting speech to text",
  },
  {
    status: ConversionStatus.AI_PROCESSING,
    icon: Brain,
    title: "AI Processing",
    description: "Transforming video content into blog format",
  },
];

const statusMap: Record<ConversionStatus, number> = {
  [ConversionStatus.PENDING]: 10,
  [ConversionStatus.METADATA_FETCHING]: 30,
  [ConversionStatus.TRANSCRIPT_EXTRACTING]: 50,
  [ConversionStatus.AI_PROCESSING]: 75,
  [ConversionStatus.COMPLETED]: 100,
  [ConversionStatus.FAILED]: 0,
};

export default function ProcessingPage() {
  const { conversionId } = useParams();
  const { status } = useConversionStatus(conversionId as string);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (status === ConversionStatus.COMPLETED) {
      router.push(`/convert/result/${conversionId}`);
    } else if (status === ConversionStatus.FAILED) {
      toast({
        title: "Conversion Failed",
        description: "Unable to convert the video to a blog",
      });
    }
  }, [status, router, toast, conversionId]);

  const progress = status ? statusMap[status] : 0;
  const currentStageIndex = stages.findIndex(
    (stage) => stage.status === status
  );

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-2">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2 pt-2">
          <h2 className="text-2xl font-bold tracking-tight">
            {currentStageIndex !== -1
              ? stages[currentStageIndex]?.title
              : "Processing"}
            <span className="text-primary ml-2">{progress}%</span>
          </h2>
          <p className="text-muted-foreground">
            {currentStageIndex !== -1
              ? stages[currentStageIndex]?.description
              : "Please wait while we process your video"}
          </p>
        </div>

        {status !== ConversionStatus.FAILED && (
          <div className="grid grid-cols-4 gap-4 pt-4">
            {stages.map((stage, index) => {
              const isActive = index === currentStageIndex;
              const isCompleted = index < currentStageIndex;
              const Icon = stage.icon;

              return (
                <div
                  key={stage.status}
                  className={cn(
                    "relative flex flex-col items-center p-4 rounded-lg transition-all duration-200 border-2",
                    isActive && "border-primary",
                    isCompleted && "border-green-400",
                    !isActive && !isCompleted && "border-muted"
                  )}
                >
                  <div
                    className={cn(
                      "p-3 rounded-full mb-3",
                      isActive &&
                        "bg-primary text-primary-foreground animate-pulse",
                      isCompleted && "bg-green-400 text-black",
                      !isActive && !isCompleted && "bg-muted"
                    )}
                  >
                    <Icon className={cn("w-6 h-6")} />
                  </div>
                  <h3
                    className={cn(
                      "text-sm font-medium text-center",
                      isCompleted && "text-green-400"
                    )}
                  >
                    {stage.title}
                  </h3>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    {stage.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {status === ConversionStatus.FAILED && (
          <div className="text-center mt-6">
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="w-16 h-16 text-destructive" />
              <h3 className="text-xl font-semibold text-destructive">
                Conversion Failed
              </h3>
              <p className="text-muted-foreground">
                We encountered an issue while converting your video.
              </p>
              <Button variant="outline" onClick={() => router.push("/convert")}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
