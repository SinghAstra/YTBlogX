import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Plus,
  Search,
  Video,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export function LeftSidebar() {
  // Sample data based on schema
  const videos = [
    {
      id: "vid_1",
      youtubeId: "dQw4w9WgXcQ",
      title: "How to Build a SaaS Application",
      channelName: "TechTutorials",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1579493934830-eab45746b51b",
      duration: "PT15M30S",
      hasTranscript: true,
      createdAt: "2025-03-10T10:30:00Z",
      processingState: "COMPLETED",
      blogs: [
        { id: "blog_1", title: "Introduction to SaaS Development" },
        { id: "blog_2", title: "Setting Up Your Development Environment" },
      ],
    },
    {
      id: "vid_2",
      youtubeId: "xvFZjo5PgG0",
      title: "Advanced React Patterns",
      channelName: "ReactMasters",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1579493934830-eab45746b51b",
      duration: "PT22M15S",
      hasTranscript: true,
      createdAt: "2025-03-08T14:20:00Z",
      processingState: "COMPLETED",
      blogs: [
        { id: "blog_3", title: "Compound Components in React" },
        { id: "blog_4", title: "State Management with Context API" },
      ],
    },
    {
      id: "vid_3",
      youtubeId: "BXqUH86F-kA",
      title: "Prisma ORM Tutorial",
      channelName: "DatabasePro",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1579493934830-eab45746b51b",
      duration: "PT18M45S",
      hasTranscript: true,
      createdAt: "2025-03-05T09:15:00Z",
      processingState: "PENDING",
      blogs: [],
    },
    {
      id: "vid_4",
      youtubeId: "fh3mQ9yvjO8",
      title: "Next.js 15 New Features",
      channelName: "FrontendMasters",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1579493934830-eab45746b51b",
      duration: "PT24M10S",
      hasTranscript: true,
      createdAt: "2025-03-01T16:45:00Z",
      processingState: "COMPLETED",
      blogs: [
        { id: "blog_5", title: "Understanding Server Components" },
        { id: "blog_6", title: "Optimizing Performance in Next.js 15" },
      ],
    },
    {
      id: "vid_5",
      youtubeId: "kXYiU_JCYtU",
      title: "TailwindCSS Best Practices",
      channelName: "CSSMasters",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1579493934830-eab45746b51b",
      duration: "PT19M22S",
      hasTranscript: true,
      createdAt: "2025-02-28T11:20:00Z",
      processingState: "COMPLETED",
      blogs: [{ id: "blog_7", title: "Utility-First CSS Philosophy" }],
    },
    {
      id: "vid_6",
      youtubeId: "O5xvJBt5Zp8",
      title: "Introduction to TypeScript",
      channelName: "TypeHero",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1579493934830-eab45746b51b",
      duration: "PT27M15S",
      hasTranscript: true,
      createdAt: "2025-02-25T13:10:00Z",
      processingState: "COMPLETED",
      blogs: [
        { id: "blog_8", title: "From JavaScript to TypeScript" },
        { id: "blog_9", title: "Advanced Type System Features" },
        { id: "blog_10", title: "TypeScript and React Integration" },
      ],
    },
    {
      id: "vid_7",
      youtubeId: "hYjm9qKWJvA",
      title: "Building a Full-Stack App with T3 Stack",
      channelName: "StackMasters",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1579493934830-eab45746b51b",
      duration: "PT32M40S",
      hasTranscript: true,
      createdAt: "2025-02-20T10:30:00Z",
      processingState: "PENDING",
      blogs: [],
    },
    {
      id: "vid_8",
      youtubeId: "J9nys-pt8kk",
      title: "Serverless Architecture Patterns",
      channelName: "CloudArchitects",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1579493934830-eab45746b51b",
      duration: "PT29M55S",
      hasTranscript: true,
      createdAt: "2025-02-15T15:15:00Z",
      processingState: "FAILED",
      blogs: [],
    },
  ];

  const [expandedVideos, setExpandedVideos] = useState({});

  const toggleExpand = (videoId) => {
    setExpandedVideos({
      ...expandedVideos,
      [videoId]: !expandedVideos[videoId],
    });
  };

  const formatDuration = (isoDuration) => {
    // Simple formatting for ISO 8601 duration
    const match = isoDuration.match(/PT(\d+)M(\d+)S/);
    if (match) {
      return `${match[1]}:${match[2].padStart(2, "0")}`;
    }
    return isoDuration;
  };

  return (
    <div className="fixed inset-y-0 left-0 w-96 bg-background border-r pt-16 flex flex-col h-screen">
      <ScrollArea className="flex-grow">
        <div className="p-2 space-y-1">
          {videos.map((video) => (
            <div key={video.id} className="rounded-md overflow-hidden">
              <div
                className="flex items-center p-2 hover:bg-muted/50 cursor-pointer rounded-md"
                onClick={() => toggleExpand(video.id)}
              >
                <div className="mr-2">
                  {expandedVideos[video.id] ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <Video className="h-4 w-4 mr-2 text-primary" />
                <span className="truncate text-sm max-w-52">{video.title}</span>
                {video.processingState === "PENDING" && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/20 ml-2"
                  >
                    Processing
                  </Badge>
                )}
              </div>

              {expandedVideos[video.id] && (
                <div className="ml-8 mt-1 space-y-1 mb-2">
                  <div className="flex items-center text-xs text-muted-foreground p-1">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-16 h-9 rounded mr-2"
                      width="16"
                      height="9"
                    />
                    <div>
                      <div>{video.channelName}</div>
                      <div>{formatDuration(video.duration)}</div>
                    </div>
                  </div>

                  {video.blogs.length > 0 ? (
                    video.blogs.map((blog) => (
                      <div
                        key={blog.id}
                        className="flex items-center p-1 pl-2 hover:bg-muted/30 rounded text-sm"
                      >
                        <FileText className="h-3 w-3 mr-2 text-indigo-500" />
                        <span className="truncate">{blog.title}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-1 pl-2 text-xs text-muted-foreground italic">
                      {video.processingState === "PENDING"
                        ? "Processing video..."
                        : "No blogs generated yet"}
                    </div>
                  )}

                  {video.processingState === "COMPLETED" &&
                    video.blogs.length === 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs pl-2 h-6 w-full justify-start text-primary"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Generate blog
                      </Button>
                    )}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-3">
        <div className="flex items-center text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-muted-foreground">3 Videos</span>
          <span className="mx-2 text-muted-foreground">•</span>
          <span className="text-muted-foreground">4 Blogs</span>
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
