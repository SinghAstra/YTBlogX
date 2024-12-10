import { processNextJob } from "@/lib/workers/background-worker";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const result = await processNextJob();

    if (result) {
      return NextResponse.json({ result }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "No jobs to process" },
        { status: 204 }
      );
    }
  } catch (error) {
    console.log("Error in process-job Post", error);
    return NextResponse.json(
      {
        error: "Error in process-job Post",
      },
      { status: 400 }
    );
  }
}
