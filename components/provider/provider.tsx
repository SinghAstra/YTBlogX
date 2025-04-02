"use client";

import { siteConfig } from "@/config/site";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import React, { Suspense } from "react";
import { VideoProvider } from "../context/video";

interface ProvidersProps {
  children: React.ReactNode;
}

const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
      <div className="flex gap-4">
        <Image
          src={"/favicon.ico"}
          width={48}
          height={48}
          alt={siteConfig.name}
        />
        <p className="text-5xl tracking-wide">{siteConfig.name}</p>
      </div>
      <p className="text-xl tracking-wide">{siteConfig.description}</p>
    </div>
  );
};

const Providers = ({ children }: ProvidersProps) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SessionProvider>
        <VideoProvider>
          <div>{children}</div>
        </VideoProvider>
      </SessionProvider>
    </Suspense>
  );
};

export default Providers;
