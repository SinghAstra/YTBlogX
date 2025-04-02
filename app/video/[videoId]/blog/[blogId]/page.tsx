import { authOptions } from "@/lib/auth-options";
import { parseMdx } from "@/lib/markdown";
import { prisma } from "@/lib/prisma";
import { Clock } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import Toc from "./toc";

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

export async function generateMetadata({
  params,
}: {
  params: { videoId: string; blogId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      title: "Sign In Required",
    };
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id: params.blogId,
      },
      include: {
        video: true,
      },
    });

    if (!blog) {
      return {
        title: "Blog Not Found",
      };
    }

    const blogTitle =
      blog.title || `Part ${blog.part} of "${blog.video.title}"`;
    const blogDescription =
      blog.summary || `Notes for part ${blog.part} of "${blog.video.title}"`;

    return {
      title: `${blogTitle} | Video Notes`,
      description: blogDescription,
      openGraph: {
        title: blogTitle,
        description: blogDescription,
        images: [{ url: blog.video.videoThumbnail }],
        type: "article",
        authors: [blog.video.channelName || "Unknown"],
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return {
      title: "Error Loading Blog",
    };
  }
}

export default async function BlogPage({
  params,
}: {
  params: { videoId: string; blogId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in");
  }

  const blog = await prisma.blog.findUnique({
    where: {
      id: params.blogId,
    },
    include: {
      video: true,
    },
  });

  if (!blog) {
    notFound();
  }
  const { content } = await parseMdx(blog.content ?? "No Content Found");

  const readingTime = calculateReadingTime(blog.content ?? "No Content Found");

  return (
    <div className="flex flex-col  min-h-screen bg-background">
      {blog.content && <Toc content={blog.content} videoId={params.videoId} />}

      <main className="flex-1 px-4 py-6 md:px-8 lg:px-12 mx-auto xl:ml-[20rem]">
        <article className="space-y-8">
          {/* Video thumbnail with part overlay */}
          <div className="relative rounded overflow-hidden w-full aspect-video">
            <Image
              src={
                blog.video.videoThumbnail ||
                "/placeholder.svg?height=720&width=1280"
              }
              alt={blog.video.title}
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute inset-0  flex items-center justify-center">
              <div className="text-center flex flex-col gap-1 py-2 max-w-[80%] bg-muted/80 rounded">
                <span className="text-3xl font-normal  px-4 py-1">
                  Part {blog.part}
                </span>
                <h1 className="text-2xl font-normal px-4 py-1 md:text-3xl ">
                  {blog.title || blog.video.title}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2 absolute left-2 bottom-2 font-normal bg-muted/80 px-4 py-1 rounded">
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={
                    blog.video.channelThumbnail ||
                    "/placeholder.svg?height=80&width=80"
                  }
                  alt={blog.video.channelName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-normal">{blog.video.channelName}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>
                    {readingTime} {readingTime > 1 ? "mins read" : "min read"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {content}
        </article>
      </main>
    </div>
  );
}
