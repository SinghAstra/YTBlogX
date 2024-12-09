import { fetchVideoMetadata } from "@/app/actions/youtube";
import { createConversionJob } from "@/lib/jobs/job-manager";
import { JobErrorType, JobStatus } from "@/lib/jobs/job-status";
import { redis } from "@/lib/redis";
import { extractVideoId } from "@/lib/youtube";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Input validation schema
const ConversionRequestSchema = z.object({
  videoUrl: z.string().url("Invalid URL format"),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const { videoUrl } = ConversionRequestSchema.parse(body);

    // 2. Create initial conversion job
    const job = createConversionJob(videoUrl);

    // 3. Fetch initial video metadata to validate and enrich job
    try {
      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        throw new Error("Invalid YouTube URL");
      }

      // Fetch metadata to ensure video exists and get additional details
      const metadata = await fetchVideoMetadata(videoId);

      // Update job with metadata
      job.metadata = metadata;
      job.status = JobStatus.METADATA_FETCHING;
    } catch (error) {
      console.log("error --/convert", error);
      // If metadata fetch fails, mark job as failed
      job.status = JobStatus.FAILED;
      job.errorType = JobErrorType.METADATA_FETCH_FAILED;
    }

    const jobData: Record<string, string> = {
      id: job.id,
      videoUrl: job.videoUrl,
      status: job.status,
      createdAt: job.createdAt.toISOString(),
      metadata: JSON.stringify(job.metadata || {}),
    };

    // 4. Add job to queue for processing
    await redis.hset(`job:${job.id}`, jobData);

    // 5. Add job to processing queue
    await redis.rpush("conversion:queue", job.id);

    // 6. Return job details to client
    return NextResponse.json(
      {
        jobId: job.id,
        status: job.status,
        // Optionally return safe metadata
        videoTitle: job.metadata?.title,
        videoThumbnail: job.metadata?.thumbnail,
      },
      { status: 201 }
    );
  } catch (error) {
    // Comprehensive error handling
    console.error("Conversion job creation failed --/convert:", error);

    // Generic error handling
    const errorMessage =
      error instanceof Error ? error.message : JobErrorType.UNKNOWN_ERROR;

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}
