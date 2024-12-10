import { getJob } from "@/app/actions/job";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
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
    const job = await getJob(jobId);

    if (!job) {
      return NextResponse.json(
        {
          error: "Job not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch job details",
      },
      { status: 500 }
    );
  }
}
