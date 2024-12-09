import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBlogContent(transcript: string): Promise<{
  title: string;
  content: string;
  summary: string;
}> {
  try {
    // Generate blog content using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert content converter. 
          Convert the following YouTube video transcript into a well-structured, 
          engaging blog post. Include:
          - A catchy title
          - Clear sections with headings
          - Key takeaways
          - Conversational yet informative tone`,
        },
        {
          role: "user",
          content: `Convert this transcript into a blog post:
          ${transcript}`,
        },
      ],
      max_tokens: 1500,
    });

    const generatedContent = response.choices[0].message.content || "";

    // Generate a summary
    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Generate a concise 2-3 sentence summary of the blog post.",
        },
        {
          role: "user",
          content: generatedContent,
        },
      ],
      max_tokens: 100,
    });

    const summary = summaryResponse.choices[0].message.content || "";

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
