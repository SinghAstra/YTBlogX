"use client";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function RightSidebar() {
  return (
    <div className="w-80 bg-background py-2 pr-2 ">
      <div>
        <h1 className="text-muted-foreground">Follow For Updates</h1>
        <p>
          More tools are being developed to enhance your development workflow.
        </p>
        <a
          className={cn(buttonVariants({ variant: "outline" }))}
          href={siteConfig.links.twitter}
          target="_blank"
        >
          Twitter
        </a>
      </div>
    </div>
  );
}
