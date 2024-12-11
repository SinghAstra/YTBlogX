import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateBlogContent(transcript: string): Promise<{
  title: string;
  content: string;
  summary: string;
}> {
  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    // Generate blog content
    const contentPrompt = `You are an expert content converter. 
    Convert the following YouTube video transcript into a well-structured, 
    engaging blog post. Include:
    - A catchy title
    - Clear sections with headings
    - Key takeaways
    - Conversational yet informative tone

    Transcript to convert:
    ${transcript}`;

    const contentResponse = await model.generateContent(contentPrompt);
    const generatedContent = contentResponse.response.text() || "";

    // Generate summary
    const summaryPrompt = `Generate a concise 2-3 sentence summary of this blog post:
    ${generatedContent}`;

    const summaryResponse = await model.generateContent(summaryPrompt);
    const summary = summaryResponse.response.text() || "";

    // Extract title (first line of generated content)
    const title = generatedContent.split("\n")[0].replace(/^#\s*/, "");

    return {
      title,
      content: generatedContent,
      summary,
    };
  } catch (error) {
    console.error("AI processing error:", error);
    throw new Error("Failed to generate blog content");
  }
}
