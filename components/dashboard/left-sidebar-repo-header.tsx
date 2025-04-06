import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";

const SidebarRepoHeader = () => {
  return (
    <div className="p-2 sticky top-0 inset-x-0 bg-transparent backdrop-blur-md z-[999]">
      <Link
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full bg-transparent"
        )}
        href="/dashboard?action=convert"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Youtube Link
      </Link>
    </div>
  );
};

export default SidebarRepoHeader;
