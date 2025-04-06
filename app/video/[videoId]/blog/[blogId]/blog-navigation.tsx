import { prisma } from "@/lib/prisma";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

export default async function BlogNavigation({
  part,
  videoId,
}: {
  part: number;
  videoId: string;
}) {
  let prevBlog = null;
  let nextBlog = null;

  if (part > 1) {
    prevBlog = await prisma.blog.findFirst({
      where: {
        videoId,
        part: part - 1,
      },
    });
  }
  nextBlog = await prisma.blog.findFirst({
    where: {
      videoId,
      part: part + 1,
    },
  });

  return (
    <div className="flex items-center justify-between py-8 mt-10 gap-4 ">
      <div>
        {prevBlog && (
          <Link
            className="flex items-center text-xs sm:text-sm  p-2 group text-foreground border border-dashed rounded-md transition-all duration-200 hover:bg-muted/40"
            href={`/video/${videoId}/blog/${prevBlog.id}`}
          >
            <ChevronLeftIcon className="w-[1rem] h-[1rem] mr-1 transition-all duration-200 group-hover:-translate-x-1  text-muted-foreground" />
            <span className="ml-1">{prevBlog.title}</span>
          </Link>
        )}
      </div>
      <div>
        {nextBlog && (
          <Link
            className="flex items-center text-xs sm:text-sm  p-2 group text-foreground border border-dashed rounded-md transition-all duration-200 hover:bg-muted/40 "
            href={`/video/${videoId}/blog/${nextBlog.id}`}
          >
            <span className="ml-1">{nextBlog.title}</span>
            <ChevronRightIcon className="w-[1rem] h-[1rem] ml-1 transition-all duration-200 group-hover:translate-x-1  text-muted-foreground" />
          </Link>
        )}
      </div>
    </div>
  );
}
