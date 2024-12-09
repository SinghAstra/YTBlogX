"use server";

import { getJob } from "@/app/actions/job";
import { JobErrorType } from "../jobs/job-status";
import { redis } from "../redis";
import { extractVideoId } from "../youtube";
import { generateBlogContent } from "./ai-processor";
import { updateJobInRedis } from "./job-utils";
import { extractYouTubeTranscript } from "./transcript-extractor";

function determineErrorType(error: unknown): JobErrorType {
  if (error instanceof Error) {
    if (error.message.includes("transcript")) {
      return JobErrorType.TRANSCRIPT_EXTRACTION_FAILED;
    }
    if (error.message.includes("AI") || error.message.includes("processing")) {
      return JobErrorType.AI_PROCESSING_ERROR;
    }
  }
  return JobErrorType.UNKNOWN_ERROR;
}

async function processNextJob() {
  console.log("In the processNextJob.");
  const jobId: string | null = await redis.lpop("conversion:queue");
  console.log("jobId is ", jobId);
  if (!jobId) {
    console.log("No jobs in queue");
    return;
  }

  try {
    console.log("In the try block of background-worker");
    // Fetch job details
    const jobData = await getJob(jobId);

    console.log("jobId --background-worker is ", jobId);
    console.log("jobData --background-worker is ", jobData);

    if (!jobData) {
      console.error(`Job ${jobId} not found`);
      return;
    }

    // Update status to processing
    await updateJobInRedis(jobId, {
      status: "TRANSCRIPT_EXTRACTING",
    });

    if (!jobData.metadata) {
      return;
    }

    console.log("Before Transcript");

    const videoId = extractVideoId(jobData.videoUrl);

    // Extract transcript
    const transcript = await extractYouTubeTranscript(videoId!);

    console.log("transcript is ", transcript);

    // Update status to AI processing
    await updateJobInRedis(jobId, {
      status: "AI_PROCESSING",
    });

    // Generate blog content
    const blogContent = await generateBlogContent(transcript);

    console.log("blogContent is ", blogContent);

    // Mark job as completed
    await updateJobInRedis(jobId, {
      status: "COMPLETED",
      result: JSON.stringify(blogContent),
    });
  } catch (error) {
    console.error("Job processing failed:", error);
    // Mark job as failed
    await updateJobInRedis(jobId, {
      status: "FAILED",
      errorType: determineErrorType(error),
    });
  }
}

// Run worker continuously
export async function startWorker() {
  console.log("Background worker started");
  while (true) {
    await processNextJob();
    // Wait a bit before checking queue again
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
