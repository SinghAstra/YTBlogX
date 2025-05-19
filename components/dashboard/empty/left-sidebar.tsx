import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

const EmptyLeftSidebar = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] px-4">
      <Link href="/dashboard?action=convert">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Plus className="h-6 w-6" />
        </div>
      </Link>
      <h3 className="font-medium mb-2">No videos yet</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">
        Generate your first blog to get started with {siteConfig.name}
      </p>
      <Link
        className={cn(buttonVariants({ variant: "outline" }))}
        href="/dashboard"
      >
        <Plus className="h-4 w-4 mr-2" />
        Generate Blogs
      </Link>
    </div>
  );
};

export default EmptyLeftSidebar;
