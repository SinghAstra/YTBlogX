"use server";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { createCleanJobsToken } from "@/lib/service-auth";
import { getServerSession } from "next-auth";

const EXPRESS_API_URL = process.env.EXPRESS_API_URl;

export async function fetchVideos() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { message: "Authentication required", videos: [] };
    }

    const videos = await prisma.video.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { videos };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return { message: "Failed to Fetch Videos", videos: [] };
  }
}

export async function activateBackendServer() {
  try {
    if (!EXPRESS_API_URL) {
      throw new Error("EXPRESS_API_URL is required.");
    }
    const response = await fetch(EXPRESS_API_URL);
    const data = await response.json();
    console.log("activateBackendServer data:", data);
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
  }
}

export async function fetchProcessingVideos() {
  try {
    const response = await prisma.video.findMany({
      where: {
        processingState: {
          in: ["PENDING", "PROCESSING"],
        },
      },
    });
    console.log("response is ", response);

    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return [];
  }
}

export async function stopVideoProcessing() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return;
    }

    await prisma.video.updateMany({
      where: {
        userId: session.user.id,
        processingState: {
          in: ["PENDING", "PROCESSING"],
        },
      },
      data: {
        processingState: "FAILED",
      },
    });

    const serviceToken = createCleanJobsToken({
      userId: session.user.id,
    });

    const response = await fetch(`${EXPRESS_API_URL}/api/clean/jobs`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceToken}`,
      },
    });

    const data = await response.json();

    console.log("stopRepositoryProcessing data : ", data);
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
  }
}
