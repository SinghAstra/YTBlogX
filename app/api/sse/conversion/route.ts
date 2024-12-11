// app/api/sse/conversion/route.ts
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const conversionId = searchParams.get("conversionId");

  if (!conversionId) {
    return new Response("Conversion ID is required", { status: 400 });
  }

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Function to send updates
      const sendUpdate = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      // Initial connection message
      sendUpdate({ status: "CONNECTED", conversionId });

      // Setup interval to check for updates
      const intervalId = setInterval(() => {
        const status = conversionsMap.get(conversionId);

        if (status) {
          sendUpdate(status);

          // Close stream if completed or failed
          if (status.status === "COMPLETED" || status.status === "FAILED") {
            clearInterval(intervalId);
            controller.close();
          }
        }
      }, 500); // Check every 500ms

      // Cleanup on stream cancellation
      return () => {
        clearInterval(intervalId);
      };
    },
  });

  // Return SSE response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-open",
    },
  });
}
