import { Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { FaYoutube } from "react-icons/fa";

type FeatureTab = "modern" | "grid" | "cards";

export const FeatureSections: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeatureTab>("modern");

  return (
    <div className="w-full py-16 bg-background bg-grid-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Powerful Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform offers everything you need to transform YouTube videos
            into engaging blog content.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-5 py-2.5 text-sm font-medium rounded-l-lg ${
                activeTab === "modern"
                  ? "bg-purple-600 text-white"
                  : "bg-card text-foreground hover:bg-secondary"
              }`}
              onClick={() => setActiveTab("modern")}
            >
              Modern
            </button>
            <button
              type="button"
              className={`px-5 py-2.5 text-sm font-medium ${
                activeTab === "grid"
                  ? "bg-purple-600 text-white"
                  : "bg-card text-foreground hover:bg-secondary"
              }`}
              onClick={() => {
                console.log("Inside grid");
                setActiveTab("grid");
              }}
            >
              Grid
            </button>
            <button
              type="button"
              className={`px-5 py-2.5 text-sm font-medium rounded-r-lg ${
                activeTab === "cards"
                  ? "bg-purple-600 text-white"
                  : "bg-card text-foreground hover:bg-secondary"
              }`}
              onClick={() => setActiveTab("cards")}
            >
              Cards
            </button>
          </div>
        </div>

        {/* Modern Feature Section */}
        {activeTab === "modern" && (
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="bg-card p-6 rounded-xl shadow-lg relative overflow-hidden border border-border">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-purple-900/20 rounded-full"></div>
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
                  <FaYoutube className="mr-2 h-5 w-5 text-red-500" />
                  <h3 className="text-xl font-bold">YouTube Integration</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Fetch transcripts with just one link. Our platform
                  automatically extracts content from any YouTube video, saving
                  you hours of manual transcription work.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Works with any public YouTube video</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Preserves timestamps for reference</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Handles multiple languages</span>
                  </li>
                </ul>
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
                  <Scissors className="mr-2 h-5 w-5 text-blue-500" />
                  <h3 className="text-xl font-bold">Smart Splitting</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Break long transcripts into meaningful blog sections. Our AI
                  understands context and creates logical divisions that make
                  your content more digestible.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Context-aware section breaks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Maintains narrative flow</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Creates logical content hierarchy</span>
                  </li>
                </ul>
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
                  <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
                  <h3 className="text-xl font-bold">AI Summaries</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Generate easy-to-read blog drafts for each part. Our AI
                  transforms raw transcripts into polished, engaging content
                  that&apos;s ready to publish.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Improves readability and flow</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Adds proper formatting and structure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Optimizes for SEO automatically</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Grid Feature Section */}
        {activeTab === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl shadow-lg p-8 border border-border hover:transform hover:scale-105 transition-transform duration-300">
              <div className="bg-red-900/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <FaYoutube className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">YouTube Integration</h3>
              <p className="text-muted-foreground mb-6">
                Fetch transcripts with just one link. Our platform automatically
                extracts content from any YouTube video.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  <p>Works with any public YouTube video</p>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  <p>Preserves timestamps for reference</p>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  <p>Handles multiple languages</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-lg p-8 border border-border hover:transform hover:scale-105 transition-transform duration-300">
              <div className="bg-blue-900/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Scissors className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">Smart Splitting</h3>
              <p className="text-muted-foreground mb-6">
                Break long transcripts into meaningful blog sections. Our AI
                understands context and creates logical divisions.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <p>Context-aware section breaks</p>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <p>Maintains narrative flow</p>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <p>Creates logical content hierarchy</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-lg p-8 border border-border hover:transform hover:scale-105 transition-transform duration-300">
              <div className="bg-yellow-900/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">AI Summaries</h3>
              <p className="text-muted-foreground mb-6">
                Generate easy-to-read blog drafts for each part. Our AI
                transforms raw transcripts into polished, engaging content.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                  <p>Improves readability and flow</p>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                  <p>Adds proper formatting and structure</p>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                  <p>Optimizes for SEO automatically</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cards Feature Section */}
        {activeTab === "cards" && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-blue-900/30 transform -skew-y-6 z-0 rounded-3xl"></div>
            <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-card rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl border border-border">
                <div className="h-2 bg-red-500"></div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <FaYoutube className="h-10 w-10 text-red-500" />
                    <div className="bg-red-900/20 text-red-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Integration
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">
                    YouTube Integration
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Fetch transcripts with just one link. Our platform
                    automatically extracts content from any YouTube video.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-900/20 flex items-center justify-center mr-2">
                        <span className="text-red-500 text-xs">✓</span>
                      </div>
                      <p className="text-sm">
                        Works with any public YouTube video
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-900/20 flex items-center justify-center mr-2">
                        <span className="text-red-500 text-xs">✓</span>
                      </div>
                      <p className="text-sm">
                        Preserves timestamps for reference
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-900/20 flex items-center justify-center mr-2">
                        <span className="text-red-500 text-xs">✓</span>
                      </div>
                      <p className="text-sm">Handles multiple languages</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl border border-border">
                <div className="h-2 bg-blue-500"></div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <Scissors className="h-10 w-10 text-blue-500" />
                    <div className="bg-blue-900/20 text-blue-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Processing
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Smart Splitting</h3>
                  <p className="text-muted-foreground mb-6">
                    Break long transcripts into meaningful blog sections. Our AI
                    understands context and creates logical divisions.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-900/20 flex items-center justify-center mr-2">
                        <span className="text-blue-500 text-xs">✓</span>
                      </div>
                      <p className="text-sm">Context-aware section breaks</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-900/20 flex items-center justify-center mr-2">
                        <span className="text-blue-500 text-xs">✓</span>
                      </div>
                      <p className="text-sm">Maintains narrative flow</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-900/20 flex items-center justify-center mr-2">
                        <span className="text-blue-500 text-xs">✓</span>
                      </div>
                      <p className="text-sm">
                        Creates logical content hierarchy
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl border border-border">
                <div className="h-2 bg-yellow-500"></div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <Sparkles className="h-10 w-10 text-yellow-500" />
                    <div className="bg-yellow-900/20 text-yellow-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      AI
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">AI Summaries</h3>
                  <p className="text-muted-foreground mb-6">
                    Generate easy-to-read blog drafts for each part. Our AI
                    transforms raw transcripts into polished, engaging content.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-900/20 flex items-center justify-center mr-2">
                        <span className="text-yellow-500 text-xs">✓</span>
                      </div>
                      <p className="text-sm">Improves readability and flow</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-900/20 flex items-center justify-center mr-2">
                        <span className="text-yellow-500 text-xs">✓</span>
                      </div>
                      <p className="text-sm">
                        Adds proper formatting and structure
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-900/20 flex items-center justify-center mr-2">
                        <span className="text-yellow-500 text-xs">✓</span>
                      </div>
                      <p className="text-sm">Optimizes for SEO automatically</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
