"use client";

import { SessionProvider } from "next-auth/react";
import React, { Suspense } from "react";
import { VideoProvider } from "../context/video";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionProvider>
        <VideoProvider>
          <div>{children}</div>
        </VideoProvider>
      </SessionProvider>
    </Suspense>
  );
};

export default Providers;
