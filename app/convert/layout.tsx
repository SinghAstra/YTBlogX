import { ConversionHeader } from "@/components/conversion/conversion-header";
import React from "react";

const ConvertLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen pb-8 flex flex-col">
      <ConversionHeader />
      {children}
    </div>
  );
};

export default ConvertLayout;
