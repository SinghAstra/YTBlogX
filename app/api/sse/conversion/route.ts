import { conversionsMap } from "@/lib/conversion-store";
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
  const stream = new ReadableStream(
    {
      start(controller) {
        // Function to send updates
        const sendUpdate = (data: ConversionStatusData) => {
          console.log("data --sendUpdate is ", data);
          const formattedEvent = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(formattedEvent);
        };

        // Initial connection message
        sendUpdate({
          status: ConversionStatus.PENDING,
          conversionId,
        });

        // Create a function for checking updates
        const checkUpdates = () => {
          const conversionStatusData = conversionsMap.get(conversionId);

          console.log("conversionStatusData --/api/sse", conversionStatusData);

          if (conversionStatusData) {
            sendUpdate(conversionStatusData);

            // Close stream if completed or failed
            if (
              conversionStatusData.status === ConversionStatus.COMPLETED ||
              conversionStatusData.status === ConversionStatus.FAILED
            ) {
              controller.close();
              return;
            }
          }

          // Continue checking if stream is not closed
          if (!controller.desiredSize) {
            setTimeout(checkUpdates, 500);
          }
        };

        // Start checking updates
        checkUpdates();
      },
      pull() {
        // Optional pull method to handle backpressure
        console.log("Stream pull method called");
      },
      cancel() {
        console.log("Stream cancelled");
      },
    },
    {
      highWaterMark: 1,
    }
  );

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
