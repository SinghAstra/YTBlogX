import { JobErrorType } from "@/lib/jobs/job-status";
import { NextRequest, NextResponse } from "next/server";

// TODO: Replace with actual job tracking mechanism
const jobStatuses = new Map();

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
    const jobStatus = jobStatuses.get(jobId);

    if (!jobStatus) {
      return NextResponse.json(
        {
          error: JobErrorType.UNKNOWN_ERROR,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(jobStatus);
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
