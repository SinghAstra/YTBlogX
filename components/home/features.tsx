"use client";

import { cn } from "@/lib/utils";
import { BarChart, Bot, FileText, Globe, Video } from "lucide-react";

type FeatureVariant = "blue" | "purple" | "pink" | "teal" | "orange";

const features = [
  {
    icon: <Video className="h-10 w-10" />,
    title: "YouTube Integration",
    description: "Simply paste any YouTube URL and let our tool do the magic",
    variant: "blue",
  },
  {
    icon: <Bot className="h-10 w-10" />,
    title: "AI-Powered",
    description:
      "Advanced AI technology transforms video content into engaging blog posts",
    variant: "purple",
  },
  {
    icon: <FileText className="h-10 w-10" />,
    title: "Instant Blog Posts",
    description: "Get professionally formatted blog posts in seconds",
    variant: "pink",
  },
  {
    icon: <Globe className="h-10 w-10" />,
    title: "Multi-language",
    description: "Support for multiple languages to reach a global audience",
    variant: "teal",
  },
  {
    icon: <BarChart className="h-10 w-10" />,
    title: "Metadata Analysis",
    description: "Extract valuable insights and metadata from videos",
    variant: "orange",
  },
];

const variantStyles = {
  blue: {
    gradient: "from-[hsl(var(--stats-blue))]/10 to-transparent",
    iconBg: "bg-[hsl(var(--stats-blue))]/10 text-[hsl(var(--stats-blue))]",
    hoverGradient:
      "hover:from-[hsl(var(--stats-blue))]/20 hover:to-[hsl(var(--stats-blue))]/5",
  },
  purple: {
    gradient: "from-[hsl(var(--stats-purple))]/10 to-transparent",
    iconBg: "bg-[hsl(var(--stats-purple))]/10 text-[hsl(var(--stats-purple))]",
    hoverGradient:
      "hover:from-[hsl(var(--stats-purple))]/20 hover:to-[hsl(var(--stats-purple))]/5",
  },
  pink: {
    gradient: "from-[hsl(var(--stats-pink))]/10 to-transparent",
    iconBg: "bg-[hsl(var(--stats-pink))]/10 text-[hsl(var(--stats-pink))]",
    hoverGradient:
      "hover:from-[hsl(var(--stats-pink))]/20 hover:to-[hsl(var(--stats-pink))]/5",
  },
  teal: {
    gradient: "from-[hsl(var(--stats-teal))]/10 to-transparent",
    iconBg: "bg-[hsl(var(--stats-teal))]/10 text-[hsl(var(--stats-teal))]",
    hoverGradient:
      "hover:from-[hsl(var(--stats-teal))]/20 hover:to-[hsl(var(--stats-teal))]/5",
  },
  orange: {
    gradient: "from-[hsl(var(--stats-orange))]/10 to-transparent",
    iconBg: "bg-[hsl(var(--stats-orange))]/10 text-[hsl(var(--stats-orange))]",
    hoverGradient:
      "hover:from-[hsl(var(--stats-orange))]/20 hover:to-[hsl(var(--stats-orange))]/5",
  },
};
export function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      {features.map((feature, index) => {
        const { gradient, iconBg, hoverGradient } =
          variantStyles[feature.variant as FeatureVariant];

        return (
          <div
            key={index}
            className={cn(
              "relative overflow-hidden transition-all duration-300",
              "border border-border/50 rounded-xl shadow-lg",
              "bg-gradient-to-br",
              gradient,
              hoverGradient,
              "hover:shadow-xl hover:scale-[1.02] hover:-translate-y-2",
              "transform origin-bottom"
            )}
          >
            <div className="relative p-8">
              <div className="relative">
                <div
                  className={cn(
                    "mb-4 inline-block rounded-lg p-3",
                    "ring-1 ring-border/50 backdrop-blur-sm",
                    iconBg,
                    "group-hover:scale-110"
                  )}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
