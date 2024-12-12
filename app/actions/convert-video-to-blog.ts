"use server";

import { generateBlogContent } from "@/lib/ai-processor";
import { ConversionStore } from "@/lib/conversion-store";
import { extractYouTubeTranscript } from "@/lib/transcript-extractor";
import { extractVideoId, generateUniqueIdFromUrl } from "@/lib/youtube/utils";
import { validateYouTubeUrl } from "@/lib/youtube/validation";
import { ConversionStatus } from "@/types/conversion";
import { fetchVideoMetadata } from "./youtube";

export async function initiateConversion(videoUrl: string) {
  console.log("In initiateConversion");
  // Validate URL
  if (!validateYouTubeUrl(videoUrl)) {
    return {
      success: false,
      error: "Invalid YouTube URL",
    };
  }

  // Generate a unique conversion ID
  const conversionId = await generateUniqueIdFromUrl(videoUrl);

  console.log("conversionId: ", conversionId);

  if (!conversionId) {
    console.log("Conversion ID not generated --initiateConversion");
    return;
  }

  // Start the conversion process in the background
  processConversion(conversionId, videoUrl);

  // Return the conversion ID for SSE connection
  return {
    success: true,
    conversionId,
  };
}

export async function processConversion(
  conversionId: string,
  videoUrl: string
) {
  console.log("In ProcessConversion");
  await ConversionStore.set(conversionId, {
    conversionId,
    status: ConversionStatus.PENDING,
  });

  // Validate URL
  if (!validateYouTubeUrl(videoUrl)) {
    return {
      success: false,
      error: "Invalid YouTube URL",
    };
  }

  try {
    // Extract video ID
    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
      console.log("Video ID not found --convertVideoToBlog");
      return;
    }

    await ConversionStore.updateStatus(conversionId, {
      conversionId,
      status: ConversionStatus.METADATA_FETCHING,
    });

    console.log("Before fetching metadata");

    // Fetch metadata
    const metadata = await fetchVideoMetadata(videoId);

    console.log("After fetching metadata");

    await ConversionStore.updateStatus(conversionId, {
      conversionId,
      status: ConversionStatus.TRANSCRIPT_EXTRACTING,
    });

    console.log("Before fetching transcript");
    // Extract transcript
    const transcript = await extractYouTubeTranscript(videoId);

    console.log("After fetching transcript");

    await ConversionStore.updateStatus(conversionId, {
      conversionId,
      status: ConversionStatus.AI_PROCESSING,
    });

    // Generate blog content
    const blogContent = await generateBlogContent(transcript);

    // console.log("blogContent is ", blogContent);
    console.log("BLog Content Generated");

    await ConversionStore.updateStatus(conversionId, {
      conversionId,
      status: ConversionStatus.COMPLETED,
      result: {
        metadata,
        blogContent,
      },
    });

    // Return complete result
    return {
      success: true,
      metadata,
      blogContent,
    };
  } catch (error) {
    await ConversionStore.updateStatus(conversionId, {
      conversionId,
      status: ConversionStatus.FAILED,
    });
    console.log("error --convertVideoToBlog:", error);
    return {
      success: false,
      error: "Failed to convert video to blog",
    };
  }
}
