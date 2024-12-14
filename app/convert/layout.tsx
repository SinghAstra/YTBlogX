import { Navbar } from "@/components/layout/navbar";
import React from "react";

const ConvertLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {children}
    </div>
  );
};

export default ConvertLayout;
