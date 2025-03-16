"use client";

import { SessionProvider } from "next-auth/react";
import React, { Suspense } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionProvider>
        <div>{children}</div>
      </SessionProvider>
    </Suspense>
  );
};

export default Providers;
