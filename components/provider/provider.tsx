"use client";

import React from "react";
import { TooltipProvider } from "../ui/tooltip";

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  return <TooltipProvider>{children}</TooltipProvider>;
};

export default Providers;
