"use client";

import { FeatureSections } from "@/components/home/feature-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { Code, FileTextIcon, Rocket } from "lucide-react";
import { useState } from "react";
import { FaYoutube } from "react-icons/fa";
import "./globals.css";

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle YouTube URL submission
    console.log("Submitted URL:", youtubeUrl);
    // Reset input after submission
    setYoutubeUrl("");
  };

  return (
    <div className="min-h-screen flex flex-col container justify-center items-center mx-auto">
      <div className="flex gap-6 lg:gap-12">
        <div className="flex flex-col justify-center space-y-4 flex-1">
          <div className="flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium w-fit mb-2">
            <Rocket className="mr-1 h-4 w-4" />
            <span>Introducing {siteConfig.name}</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
              Transform Videos into{" "}
              <span className="text-purple-400">Engaging</span> Blog Content
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Our AI-powered platform converts YouTube videos into
              well-structured, SEO-friendly blog posts with just one click.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-sm items-center space-x-2"
            >
              <Input
                type="text"
                placeholder="Paste YouTube URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Generate Blog
              </Button>
            </form>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required. Start converting videos instantly.
          </p>
        </div>
        <div className="flex items-center justify-center lg:w-[400px] xl:w-[600px]">
          <div className="relative w-full h-[400px] ">
            <div className="absolute top-8 left-8 right-8 bottom-8 bg-card rounded-lg shadow-2xl transform rotate-6 z-10 p-6 border border-purple-500/20">
              <div className="flex items-center space-x-2 mb-4">
                <FaYoutube className="h-6 w-6 text-red-500" />
                <div className="h-2 bg-muted rounded-full w-3/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded-full w-full"></div>
                <div className="h-3 bg-muted rounded-full w-5/6"></div>
                <div className="h-3 bg-muted rounded-full w-4/6"></div>
              </div>
            </div>
            <div className="absolute top-10 left-10 right-10 bottom-10 bg-card rounded-lg shadow-2xl transform -rotate-6 z-20 p-6 border border-blue-500/20">
              <div className="flex items-center space-x-2 mb-4">
                <FileTextIcon className="h-6 w-6 text-blue-500" />
                <div className="h-2 bg-muted rounded-full w-3/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded-full w-full"></div>
                <div className="h-3 bg-muted rounded-full w-5/6"></div>
                <div className="h-3 bg-muted rounded-full w-4/6"></div>
              </div>
            </div>
            <div className="absolute top-16 left-16 right-16 bottom-16 bg-card rounded-lg shadow-2xl z-30 p-6 border border-purple-500/20">
              <div className="flex items-center space-x-2 mb-4">
                <Code className="h-6 w-6 text-purple-500" />
                <div className="h-2 bg-muted rounded-full w-3/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded-full w-full"></div>
                <div className="h-3 bg-muted rounded-full w-5/6"></div>
                <div className="h-3 bg-muted rounded-full w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FeatureSections />
    </div>
  );
}

export default App;
