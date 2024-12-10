"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function VideoMetadataSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex gap-6">
        <Skeleton className="w-48 h-28 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-7 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-3 mt-4">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>
    </Card>
  );
}
