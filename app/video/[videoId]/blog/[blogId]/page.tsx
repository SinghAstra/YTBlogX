import MDXSource from "@/components/mdx/mdx-source";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock } from "lucide-react";
import { serialize } from "next-mdx-remote/serialize";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function getBlogData(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/blog/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch blog data");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return null;
  }
}

function BlogSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-pulse">
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    </div>
  );
}

export default async function BlogPage({
  params,
}: {
  params: { videoId: string; blogId: string };
}) {
  const blogData = await getBlogData(params.blogId);
  console.log("blogData.content is ", blogData.content);
  const mdxSource = await serialize(blogData.content);
  // const mdxSource = await serialize("# Hello World\n\nThis is a test.");

  if (!blogData) {
    notFound();
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Sidebar - sticky on desktop, top navigation on mobile */}
      <aside className="md:w-64 lg:w-72 md:sticky md:top-0 md:h-screen md:overflow-y-auto border-r bg-muted/30">
        <div className="p-4 space-y-4">
          <Link href={`/video/${params.videoId}`}>
            <Button
              variant="ghost"
              className="flex items-center gap-2 w-full justify-start"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>All Blog Segments</span>
            </Button>
          </Link>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Video Segments</h3>
            {/* This would ideally be populated with actual segments */}
            <nav className="space-y-1">
              {[1, 2, 3, 4, 5].map((part) => (
                <Link
                  key={part}
                  href={`#`}
                  className={`block px-3 py-2 text-sm rounded-md hover:bg-muted ${
                    part === 1 ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  Part {part}: {part === 1 ? "Introduction" : `Segment ${part}`}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 md:px-8 lg:px-12 max-w-4xl mx-auto">
        <Suspense fallback={<BlogSkeleton />}>
          <article className="space-y-8">
            {/* Video thumbnail with part overlay */}
            <div className="relative rounded-xl overflow-hidden w-full aspect-video">
              <Image
                src={
                  blogData.video.videoThumbnail ||
                  "/placeholder.svg?height=720&width=1280"
                }
                alt={blogData.video.title}
                fill
                className="object-cover opacity-80"
                priority
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white text-sm font-medium bg-primary/80 px-3 py-1 rounded-full inline-block mb-2">
                    Part 1
                  </div>
                  <h1 className="text-white text-2xl md:text-3xl font-bold px-4">
                    {blogData.title || blogData.video.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Blog metadata */}
            <div className="flex items-center gap-4">
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={
                    blogData.video.channelThumbnail ||
                    "/placeholder.svg?height=80&width=80"
                  }
                  alt={blogData.video.channelName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{blogData.video.channelName}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>{blogData.video.duration}</span>
                </div>
              </div>
            </div>

            {/* Blog content */}
            <Card className="p-6 md:p-8 prose prose-slate dark:prose-invert max-w-none">
              {blogData.content ? (
                <MDXSource mdxSource={mdxSource} />
              ) : (
                <div className="text-muted-foreground italic">
                  This blog has no content
                </div>
              )}
            </Card>
          </article>
        </Suspense>
      </main>
    </div>
  );
}
