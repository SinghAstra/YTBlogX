"use server";

import { generateBlogContent } from "@/lib/ai-processor";
import { extractYouTubeTranscript } from "@/lib/transcript-extractor";
import { extractVideoId, generateUniqueIdFromUrl } from "@/lib/youtube/utils";
import { validateYouTubeUrl } from "@/lib/youtube/validation";
import { ConversionStatus, ConversionStatusData } from "@/types/conversion";
import { fetchVideoMetadata } from "./youtube";

export const conversionsMap = new Map<string, ConversionStatusData>();

export async function initiateConversion(videoUrl: string) {
  // Validate URL
  if (!validateYouTubeUrl(videoUrl)) {
    return {
      success: false,
      error: "Invalid YouTube URL",
    };
  }

  // Generate a unique conversion ID
  const conversionId = await generateUniqueIdFromUrl(videoUrl);

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
  conversionsMap.set(conversionId, {
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

    conversionsMap.set(conversionId, {
      conversionId,
      status: ConversionStatus.METADATA_FETCHING,
    });

    // Fetch metadata
    const metadata = await fetchVideoMetadata(videoId);

    conversionsMap.set(conversionId, {
      conversionId,
      status: ConversionStatus.TRANSCRIPT_EXTRACTING,
    });

    // Extract transcript
    const transcript = await extractYouTubeTranscript(videoId);

    conversionsMap.set(conversionId, {
      conversionId,
      status: ConversionStatus.AI_PROCESSING,
    });

    // Generate blog content
    const blogContent = await generateBlogContent(transcript);

    conversionsMap.set(conversionId, {
      conversionId,
      status: ConversionStatus.COMPLETED,
      result: {
        metadata: {
          title: metadata.title,
          thumbnail: metadata.thumbnail,
          description: metadata.description,
        },
        blogContent,
      },
    });

    // Return complete result
    return {
      success: true,
      metadata: {
        title: metadata.title,
        thumbnail: metadata.thumbnail,
        description: metadata.description,
      },
      blogContent,
    };
  } catch (error) {
    conversionsMap.set(conversionId, {
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
