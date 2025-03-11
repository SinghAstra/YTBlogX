"use client";

import React from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    // <SessionProvider>
    <div>{children}</div>
    // </SessionProvider>
  );
};

export default Providers;
