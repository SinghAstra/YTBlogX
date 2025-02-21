import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateBlogContent(transcript: string) {
  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    // Generate blog content
    const contentPrompt = `You are an expert content converter. 
    Convert the following YouTube video transcript into a well-structured, 
    engaging blog post.

    Transcript to convert:
    ${transcript}`;

    const contentResponse = await model.generateContent(contentPrompt);
    const generatedContent = contentResponse.response.text() || "";

    return generatedContent;
  } catch (error) {
    console.error("AI processing error:", error);
    throw new Error("Failed to generate blog content");
  }
}
