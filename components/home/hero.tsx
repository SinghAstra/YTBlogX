"use client";

import { siteConfig } from "@/config/site";
import { Video } from "lucide-react";
import Link from "next/link";
import { Icons } from "../Icons";
import { buttonVariants } from "../ui/button";

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">
      <div className="text-center mb-8 space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Transform{" "}
          <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient">
            YouTube Videos
          </span>{" "}
          into
          <br />
          Professional Blog Posts
        </h1>
      </div>
      <div className="flex gap-4">
        <Link
          href="/convert/new"
          className={buttonVariants({
            variant: "default",
            size: "lg",
          })}
        >
          <Video className="mr-2" /> Get Started
        </Link>
        <Link
          href={siteConfig.links.github}
          target="_blank"
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "flex gap-2 items-center ",
          })}
        >
          <Icons.gitLogo className="mr-2" /> Github
        </Link>
      </div>
    </div>
  );
}
