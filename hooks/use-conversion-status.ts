"use client";

import { ConversionStatus, ConversionStatusData } from "@/types/conversion";
import { useEffect, useState } from "react";

export function useConversionStatus(
  conversionId: string
): ConversionStatusData | null {
  const [conversionStatusData, setConversionStatusData] =
    useState<ConversionStatusData | null>(null);

  useEffect(() => {
    if (!conversionId) return;

    const eventSource = new EventSource(
      `/api/sse/conversion?conversionId=${conversionId}`
    );

    eventSource.onmessage = (event) => {
      const data: ConversionStatusData = JSON.parse(event.data);
      setConversionStatusData(data);

      // Close connection if completed or failed
      if (
        data.status === ConversionStatus.COMPLETED ||
        data.status === ConversionStatus.FAILED
      ) {
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      setConversionStatusData({
        conversionId,
        status: ConversionStatus.FAILED,
      });
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [conversionId]);

  if (!conversionStatusData) {
    return null;
  }

  return conversionStatusData;
}
