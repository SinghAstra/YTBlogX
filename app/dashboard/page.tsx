import React from "react";
import { TranscriptExtractor } from "./transcript-extractor";

const DashboardPage = () => {
  return (
    <div className="min-h-[calc(100vh-(4rem))] w-full flex items-center justify-center ">
      <TranscriptExtractor />
    </div>
  );
};

export default DashboardPage;
