"use client";

import { ConversionStatus, ConversionStatusData } from "@/types/conversion";
import { useEffect, useState } from "react";

export function useConversionStatus(
  conversionId: string
): ConversionStatusData {
  const [conversionStatusData, setConversionStatusData] =
    useState<ConversionStatusData>({
      conversionId,
      status: ConversionStatus.PENDING,
    });

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

  return conversionStatusData;
}
