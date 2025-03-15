import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <h1 className="text-2xl font-normal mb-2">Video Not Found</h1>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        The video you&apos;re looking for doesn&apos;t exist or may have been
        removed.
      </p>
      <Button asChild>
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
