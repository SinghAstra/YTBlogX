"use client";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AvatarMenu } from "../ui/avatar-menu";
import SignIn from "../ui/sign-in";
import { Skeleton } from "../ui/skeleton";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-dotted bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl tracking-wider">{siteConfig.name}</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Link
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            href="/dashboard?action=convert"
          >
            <Plus className="h-5 w-5" />
            Add Youtube Link
          </Link>
          {status === "loading" ? (
            <Skeleton className="h-8 w-8 rounded-md " />
          ) : session?.user ? (
            <AvatarMenu />
          ) : (
            <SignIn />
          )}
        </div>
      </div>
    </nav>
  );
}
