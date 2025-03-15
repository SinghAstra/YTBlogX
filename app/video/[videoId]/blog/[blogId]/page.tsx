import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// import MDXSource from "@/components/mdx/mdx-source";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

async function getBlogData(blogId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/blog/${blogId}`,
      {
        cache: "no-store",
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch blog data");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return null;
  }
}

export default async function BlogPage({
  params,
}: {
  params: { videoId: string; blogId: string };
}) {
  const blog = await getBlogData(params.blogId);

  if (!blog) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4">
        <div className="sticky top-24 space-y-6">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href={`/videos/${params.videoId}`}>View All Blogs</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
            <div className="aspect-video relative overflow-hidden rounded-md">
              <Image
                src={
                  blog.video.videoThumbnail ||
                  "/placeholder.svg?height=180&width=320"
                }
                alt={blog.video.title}
                fill
                className="object-cover"
              />
            </div>
            <h4 className="font-medium line-clamp-2">{blog.video.title}</h4>
            <div className="flex items-center gap-2">
              <div className="relative h-6 w-6 overflow-hidden rounded-full">
                <Image
                  src={
                    blog.video.channelThumbnail ||
                    "/placeholder.svg?height=24&width=24"
                  }
                  alt={blog.video.channelName}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {blog.video.channelName}
              </span>
            </div>
            <Separator />
            <div className="text-sm">
              {blog.summary ? (
                <div>
                  <p className="font-medium mb-2">Summary</p>
                  <p className="text-muted-foreground">{blog.summary}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No summary available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-8">
        <div className="space-y-6">
          {/* Video info */}
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src={
                  blog.video.channelThumbnail ||
                  "/placeholder.svg?height=48&width=48"
                }
                alt={blog.video.channelName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-medium">{blog.video.channelName}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{blog.video.duration}</span>
              </div>
            </div>
          </div>

          {/* Blog title */}
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {blog.title || "Untitled Blog Section"}
          </h1>
        </div>
      </div>
    </div>
  );
}
