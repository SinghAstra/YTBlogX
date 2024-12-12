import { ConversionStore } from "@/lib/conversion-store";
import { ConversionStatus, ConversionStatusData } from "@/types/conversion";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log("In /api/sse");
  const { searchParams } = request.nextUrl;
  const conversionId = searchParams.get("conversionId");
  console.log("conversionId --/api/sse is ", conversionId);

  if (!conversionId) {
    return new Response("Conversion ID is required", { status: 400 });
  }

  // Create a readable stream for SSE with manual implementation
  const stream = new ReadableStream({
    start(controller) {
      // Function to send updates
      const sendUpdate = (data: ConversionStatusData) => {
        console.log("data --sendUpdate is ", data);
        const formattedEvent = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(formattedEvent);
      };

      // Track if stream should continue
      let shouldContinue = true;

      // Create a function for checking updates
      const checkUpdates = async () => {
        if (!shouldContinue) return;

        try {
          console.log("Inside checkUpdates.");
          const conversionStatusData = await ConversionStore.get(conversionId);

          console.log("conversionStatusData --/api/sse", conversionStatusData);

          if (conversionStatusData) {
            sendUpdate(conversionStatusData);

            // Close stream if completed or failed
            if (
              conversionStatusData.status === ConversionStatus.COMPLETED ||
              conversionStatusData.status === ConversionStatus.FAILED
            ) {
              shouldContinue = false;
              controller.close();
              return;
            }
          }

          // Continue checking if not closed
          if (shouldContinue) {
            // Use setImmediate or setTimeout to avoid blocking
            setTimeout(checkUpdates, 500);
          }
        } catch (error) {
          console.error("Error in checkUpdates:", error);
          shouldContinue = false;
          controller.error(error);
        }
      };

      // Initial connection message
      sendUpdate({
        status: ConversionStatus.PENDING,
        conversionId,
      });

      // Start checking updates
      checkUpdates();
    },
  });

  // Return SSE response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
