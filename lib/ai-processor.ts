import { GoogleGenerativeAI } from "@google/generative-ai";

export function splitTranscript(transcript: string, chunkSize: number = 10000) {
  const sentences = transcript.split(/(?<=[.!?])\s+/); // Split at sentence boundaries
  const chunks = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if (sentence.length > chunkSize) {
      // Split long sentences into smaller chunks
      for (let i = 0; i < sentence.length; i += chunkSize) {
        chunks.push(sentence.slice(i, i + chunkSize));
      }
      continue; // Skip to next sentence
    }

    if ((currentChunk + sentence).length > chunkSize) {
      chunks.push(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk += " " + sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  console.log("chunks.length is ", chunks.length);
  console.log("chunks is ", chunks);
  console.log("chunks is ", chunks[0].length);
  console.log("chunks is ", chunks[1].length);

  return chunks;
}

export async function generateBlogContent(transcript: string) {
  const genAI = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
  );
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chunks = splitTranscript(transcript, 8000);
  const blogContent = [];

  for (let i = 0; i < chunks.length; i++) {
    const prompt = `Act as CS Professor and explain me this topic in a simple way. \n\nTranscript:\n"${chunks[i]}"`;

    try {
      const contentResponse = await model.generateContent(prompt);
      const generatedText = contentResponse.response.text() || "";
      blogContent.push(generatedText + "\n\n");
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      throw new Error("Failed to generate blog content");
    }
  }

  return blogContent;
}

// import { GoogleGenerativeAI } from "@google/generative-ai";

// export async function generateBlogContent(transcript: string) {
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//   const chunks = splitTranscript(transcript, 8000);
//   let blogContent = ""; // Store final blog content
//   let previousResponse = ""; // Store last AI response for context

//   for (let i = 0; i < chunks.length; i++) {
//     const prompt = i === 0
//       ? `You are an AI technical writer. Generate a structured technical blog post in Markdown based on the transcript below. Use proper headings, subheadings, and lists.\n\nTranscript:\n"${chunks[i]}"`
//       : `Continue writing from the previous section. Maintain the structure, headings, and Markdown format.\n\nPrevious response:\n"${previousResponse}"\n\nNext transcript:\n"${chunks[i]}"`;

//     try {
//       const contentResponse = await model.generateContent(prompt);
//       const generatedText = contentResponse.response.text() || "";

//       blogContent += generatedText + "\n\n"; // Append to final content
//       previousResponse = generatedText; // Store for next chunk
//     } catch (error) {
//       console.error("AI processing error:", error);
//       throw new Error("Failed to generate blog content");
//     }
//   }

//   return blogContent;
// }
