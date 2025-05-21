import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import BlogContent from "./blog";
import BlogNavigation from "./blog-navigation";
import Toc from "./toc";

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

  return (
    <div className="flex flex-col  min-h-screen bg-background">
      {blog.content && <Toc content={blog.content} videoId={params.videoId} />}
      <main className="flex-1 px-4 py-6 md:px-8 lg:px-12 mx-auto xl:ml-[20rem] xl:w-[calc(100%-20rem)] ">
        <BlogContent blog={blog} />
        <BlogNavigation part={blog.part} videoId={blog.video.id} />
      </main>
    </div>
  );
}
