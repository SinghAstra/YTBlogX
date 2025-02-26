import { Scissors, Sparkles } from "lucide-react";
import React from "react";
import { FaYoutube } from "react-icons/fa";

export const FeatureSections = () => {
  return (
    <div className="container mx-auto px-4 py-16 space-y-16">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <div className="bg-card p-6 rounded-xl shadow-lg relative overflow-hidden border border-border">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-red-900/20 rounded-full"></div>
            <div className="relative">
              <FaYoutube className="h-12 w-12 text-red-500 mb-4" />
              <div className="space-y-2">
                <div className="h-2 bg-muted rounded-full w-3/4"></div>
                <div className="h-2 bg-muted rounded-full w-5/6"></div>
                <div className="h-2 bg-muted rounded-full w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="mb-2 flex items-center">
            <h3 className="text-xl font-normal text-red-500">
              YouTube Integration
            </h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Fetch transcripts with just one link. Our platform automatically
            extracts content from any YouTube video, saving you hours of manual
            transcription work.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row-reverse items-center gap-8">
        <div className="md:w-1/2">
          <div className="bg-card p-6 rounded-xl shadow-lg relative overflow-hidden border border-border">
            <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-blue-900/20 rounded-full"></div>
            <div className="relative">
              <Scissors className="h-12 w-12 text-blue-500 mb-4" />
              <div className="space-y-2">
                <div className="h-2 bg-muted rounded-full w-full"></div>
                <div className="h-2 bg-muted rounded-full w-2/3"></div>
                <div className="h-2 bg-muted rounded-full w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="mb-2 flex items-center">
            <h3 className="text-xl font-normal text-blue-500">
              Smart Splitting
            </h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Break long transcripts into meaningful blog sections. Our AI
            understands context and creates logical divisions that make your
            content more digestible.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <div className="bg-card p-6 rounded-xl shadow-lg relative overflow-hidden border border-border">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-yellow-900/20 rounded-full"></div>
            <div className="relative">
              <Sparkles className="h-12 w-12 text-yellow-500 mb-4" />
              <div className="space-y-2">
                <div className="h-2 bg-muted rounded-full w-5/6"></div>
                <div className="h-2 bg-muted rounded-full w-full"></div>
                <div className="h-2 bg-muted rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="mb-2 flex items-center">
            <h3 className="text-xl font-normal text-yellow-500">
              AI Generated Blogs
            </h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Generate easy-to-read blog drafts for each part. Our AI transforms
            raw transcripts into polished, engaging content that&apos;s ready to
            publish.
          </p>
        </div>
      </div>
    </div>
  );
};
