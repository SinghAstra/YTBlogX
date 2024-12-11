"use client";

import { ConversionStatus } from "@/types/conversion";
import { useEffect, useState } from "react";

export function useConversionStatus(conversionId: string) {
  const [status, setStatus] = useState<ConversionStatus | null>(null);

  useEffect(() => {
    if (!conversionId) return;

    const eventSource = new EventSource(
      `/api/sse/conversion?conversionId=${conversionId}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStatus(data.status);

      // Close connection if completed or failed
      if (
        data.status === ConversionStatus.COMPLETED ||
        data.status === ConversionStatus.FAILED
      ) {
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      setStatus(ConversionStatus.FAILED);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [conversionId]);

  return status;
}
