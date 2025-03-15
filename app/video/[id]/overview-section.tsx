"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const OverviewSection = ({ overview }: { overview: string | null }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!overview) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className=" flex items-center justify-between cursor-pointer transition-all duration-200 hover:bg-muted/70 px-2 py-1 rounded-md mb-2 border border-dotted">
          <h2 className="text-lg font-normal">Overview</h2>
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="border border-dotted rounded-md p-2">
        <p className="text-sm text-muted-foreground text-balance ">
          {overview}
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default OverviewSection;
