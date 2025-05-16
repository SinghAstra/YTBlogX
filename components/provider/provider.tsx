"use client";

import { siteConfig } from "@/config/site";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import React, { ReactNode, Suspense } from "react";
import { VideoProvider } from "../context/video";
import { ToastProvider } from "./toast";

interface ProvidersProps {
  children: ReactNode;
}

const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center animate-fade-in">
      <div className="flex flex-col items-center gap-4 lg:max-w-3xl">
        <div className="flex gap-4 items-center">
          <Image
            src={"/favicon.ico"}
            width={48}
            height={48}
            alt={siteConfig.name}
          />
          <p className="text-5xl tracking-wide relative">
            {siteConfig.name}
            <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary animate-width-grow"></span>
          </p>
        </div>
        <p className="text-xl tracking-wide flex items-center text-center ">
          {siteConfig.description}
        </p>
      </div>
    </div>
  );
};
const Providers = ({ children }: ProvidersProps) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ToastProvider>
        <SessionProvider>
          <VideoProvider>
            <div>{children}</div>
          </VideoProvider>
        </SessionProvider>
      </ToastProvider>
    </Suspense>
  );
};

export default Providers;
