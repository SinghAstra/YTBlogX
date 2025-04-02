import { Button } from "@/components/ui/button";
import { getToc } from "@/lib/markdown";
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
    <div className="xl:flex hidden w-[20rem] py-2 fixed inset-y-0 left-0 top-16  border-r border-dashed px-3  flex-col gap-8 ">
      <Link href={`/video/${videoId}`}>
        <Button
          variant="outline"
          className="flex items-center gap-2 w-full justify-start"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All Blogs</span>
        </Button>
      </Link>
      <div className="flex flex-col gap-3 w-full pl-2">
        <h3 className="font-medium text-sm">On this page</h3>
        <div className="pb-2 pt-0.5 overflow-y-auto">
          <TocObserver data={toc} />
        </div>
      </div>
    </div>
  );
}
