import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";

const SidebarRepoHeader = () => {
  return (
    <div className="p-2">
      <Link
        className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        href="/dashboard"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Youtube Link
      </Link>
    </div>
  );
};

export default SidebarRepoHeader;
