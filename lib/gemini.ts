import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "./prisma";

const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!geminiKey) {
  throw new Error("GEMINI_API_KEY is required.");
}

const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Token consumption tracking
let tokenConsumed = 0;
const TOKEN_LIMIT = 800000;

// Sleep function for rate limiting
const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

// Function to process transcripts in batches
export async function processBatchTranscriptSummaries(
  videoId: string,
  batchSize: number = 10
) {
  try {
    // Get all blogs for the video that don't have summaries yet
    const blogs = await prisma.blog.findMany({
      where: {
        videoId,
        summary: null,
      },
      select: {
        id: true,
        transcript: true,
      },
    });

    console.log(
      `Found ${blogs.length} transcripts to summarize for video ${videoId}`
    );

    // Process in batches
    for (let i = 0; i < blogs.length; i += batchSize) {
      const batch = blogs.slice(i, i + batchSize);
      console.log(
        `Processing batch ${i / batchSize + 1} of ${Math.ceil(
          blogs.length / batchSize
        )}`
      );

      // Format the batch for the AI request
      const transcriptBatch = batch.map((blog) => ({
        id: blog.id,
        transcript: blog.transcript,
      }));

      // Check token consumption and wait if necessary
      if (tokenConsumed >= TOKEN_LIMIT) {
        console.log(
          `Token limit reached (${tokenConsumed}). Cooling down for 1000ms`
        );
        await sleep();
        tokenConsumed = 0;
      }

      // Estimate token consumption for this batch (rough estimate)
      // Assuming approximately 1 token per 4 characters
      const estimatedTokens = batch.reduce(
        (total, blog) => total + Math.ceil(blog.transcript.length / 4),
        0
      );
      tokenConsumed += estimatedTokens;

      // Generate summaries
      const summaries = await generateSummaries(transcriptBatch);

      // Validate and update summaries
      if (summaries && Array.isArray(summaries)) {
        const validSummaries = summaries.filter(
          (summary) =>
            summary &&
            typeof summary.id === "string" &&
            typeof summary.summary === "string" &&
            batch.some((blog) => blog.id === summary.id)
        );

        if (validSummaries.length > 0) {
          // Update database with transaction
          await updateSummaries(validSummaries);
          console.log(
            `Successfully updated ${validSummaries.length} summaries`
          );
        }
      }
    }

    // Update video processing state to completed
    await prisma.video.update({
      where: { id: videoId },
      data: { processingState: "COMPLETED" },
    });

    return {
      success: true,
      message: `Processed ${blogs.length} transcripts for video ${videoId}`,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }

    console.log("Error occurred while processing batch summary.");

    // Update video processing state to failed
    await prisma.video.update({
      where: { id: videoId },
      data: { processingState: "FAILED" },
    });

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function generateSummaries(
  transcriptBatch: { id: string; transcript: string }[]
) {
  try {
    const prompt = `
      You are a concise summarizer. I will provide you with an array of transcript segments from a YouTube video.
      For each segment, generate a 2-4 line summary that captures the key points.
      
      Return your response as a JSON array of objects, each with 'id' and 'summary' properties.
      Format your entire response as valid JSON with no additional text before or after.

       Example of what your response should look like:
      [{"id":"123","summary":"This is the first summary"},{"id":"456","summary":"This is the second summary"}]
      
      Here are the transcript segments:
      ${JSON.stringify(transcriptBatch)}
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    console.log("Raw responseText:", responseText); // Log raw response for debugging

    // Remove potential Markdown or extra text
    responseText = responseText
      .replace(/```json/g, "") // Remove ```json
      .replace(/```/g, "") // Remove ```
      .trim(); // Remove leading/trailing whitespace

    console.log("Cleaned responseText:", responseText); // Log cleaned response

    const summaries = JSON.parse(responseText);

    // Validate that we got an array of objects with id and summary
    if (!Array.isArray(summaries)) {
      throw new Error("Response is not an array");
    }

    console.log("summaries is ", summaries);

    return summaries;
  } catch (error) {
    console.error("Error generating summaries:", error);
    return [];
  }
}

// Function to update summaries in the database
async function updateSummaries(summaries: { id: string; summary: string }[]) {
  const updatePromises = summaries.map(({ id, summary }) =>
    prisma.blog.update({
      where: { id },
      data: { summary },
    })
  );

  return await prisma.$transaction(updatePromises);
}

// Function to generate a video overview based on summaries
export async function generateVideoOverview(videoId: string) {
  try {
    // Fetch all blog summaries for the given videoId
    const blogs = await prisma.blog.findMany({
      where: {
        videoId,
        summary: { not: null }, // Ensure we only get blogs with summaries
      },
      select: {
        id: true,
        summary: true,
      },
    });

    if (blogs.length === 0) {
      return {
        success: false,
        message: `No summaries found for videoId: ${videoId}`,
      };
    }

    console.log(`Found ${blogs.length} summaries for videoId: ${videoId}`);

    // Prepare the summaries as a single string for the prompt
    const summariesText = blogs
      .map((blog) => `Summary (ID: ${blog.id}): ${blog.summary}`)
      .join("\n\n");

    // Construct the prompt for Gemini
    const prompt = `
      You are an expert summarizer. Below is a collection of summaries from different segments of a video.
      Your task is to generate a concise, cohesive overview of the entire video in 4-6 sentences.
      Focus on capturing the main themes, key points, and overall purpose of the video based on these summaries.
      Return only the plain text overview, with no additional formatting, labels, or explanations.

      Summaries:
      ${summariesText}
    `;

    // Generate the overview using Gemini API
    const result = await model.generateContent(prompt);
    const overview = result.response.text().trim();

    console.log(`Generated overview for videoId: ${videoId}:`, overview);

    await prisma.video.update({
      where: { id: videoId },
      data: { overview },
    });

    return {
      success: true,
      overview,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("error.stack is ", error.stack);
      console.error("error.message is ", error.message);
    }
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
