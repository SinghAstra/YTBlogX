import { JobErrorType } from "@/lib/jobs/job-status";
import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json(
      {
        error: "Job ID is required",
      },
      { status: 400 }
    );
  }

  try {
    // Retrieve job data from Redis
    const jobData = await redis.hgetall(`job:${jobId}`);

    if (!jobData || Object.keys(jobData).length === 0) {
      return NextResponse.json(
        {
          error: "Job Not Found --api/convert/status",
        },
        { status: 404 }
      );
    }

    // Prepare response
    const response = {
      jobId: jobData.id,
      status: jobData.status,
      videoUrl: jobData.videoUrl,
      createdAt: jobData.createdAt,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to retrieve job status:", error);

    return NextResponse.json(
      {
        error: JobErrorType.UNKNOWN_ERROR,
      },
      { status: 500 }
    );
  }
}
