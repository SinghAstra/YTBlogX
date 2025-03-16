import MDXSource from "@/components/mdx/mdx-source";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock } from "lucide-react";
import { serialize } from "next-mdx-remote/serialize";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

function calculateReadingTime(
  text: string,
  wordsPerMinute: number = 200
): number {
  // Remove HTML tags if present
  const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");

  // Count words by splitting on whitespace
  const wordCount = cleanText.trim().split(/\s+/).length;

  // Calculate reading time
  const readingTime = wordCount / wordsPerMinute;

  // Round to nearest minute, with a minimum of 1 minute
  return Math.max(1, Math.round(readingTime));
}

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

export default async function BlogPage({
  params,
}: {
  params: { videoId: string; blogId: string };
}) {
  const blogData = await getBlogData(params.blogId);
  console.log("blogData.content is ", blogData.content);
  const mdxSource = await serialize(blogData.content);

  if (!blogData) {
    notFound();
  }

  const readingTime = calculateReadingTime(blogData.content);

  return (
    <div className="flex flex-col  min-h-screen bg-background">
      <aside className="md:fixed md:top-18 ">
        <div className="p-4 space-y-4">
          <Link href={`/video/${params.videoId}`}>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full justify-start"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>All Blogs</span>
            </Button>
          </Link>
        </div>
      </aside>

      <main className="flex-1 px-4 py-6 md:px-8 lg:px-12 max-w-5xl mx-auto">
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
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute inset-0  flex items-center justify-center">
              <div className="text-center">
                <span className="text-2xl font-normal bg-muted/80 px-4 py-1 rounded">
                  Part 1
                </span>
                <h1 className="text-2xl font-normal bg-muted/80 px-4 py-1 rounded md:text-3xl ">
                  {blogData.title || blogData.video.title}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 absolute left-2 bottom-2 font-normal bg-muted/80 px-4 py-1 rounded">
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
                <div className="font-normal">{blogData.video.channelName}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>
                    {readingTime} {readingTime > 1 ? "mins read" : "min read"}
                  </span>
                </div>
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
      </main>
    </div>
  );
}
