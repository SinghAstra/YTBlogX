import { buttonVariants } from "@/components/ui/button";
import { getToc } from "@/lib/markdown";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import TocObserver from "./toc-observer";

export default async function Toc({
  content,
  videoId,
}: {
  content: string;
  videoId: string;
}) {
  const toc = await getToc(content);

  return (
    <div className="xl:flex hidden w-[20rem]  fixed inset-y-0 left-0 top-16  border-r border-dashed   flex-col gap-2 ">
      <div className="pb-2 h-full overflow-y-auto">
        <div className="sticky top-0 inset-x-0  flex flex-col gap-1 pl-2 backdrop-blur-md py-2 mb-4">
          <Link href={`/video/${videoId}`}>
            <div
              className={cn(
                buttonVariants({ variant: "outline" }),
                "flex items-center gap-2  justify-start bg-transparent"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>All Blogs</span>
            </div>
          </Link>
        </div>
        <TocObserver data={toc} />
      </div>
    </div>
  );
}
