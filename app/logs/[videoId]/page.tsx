import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import VideoLogs from "./logs";

export default async function ProcessingLogsPage({
  params,
}: {
  params: { videoId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in");
  }

  const videoId = params.videoId;

  const video = await prisma.video.findUnique({
    where: { id: videoId, userId: session.user.id },
    include: { logs: true },
  });

  if (!video) {
    notFound();
  }

  if (video.status === "COMPLETED") {
    redirect(`/video/${videoId}`);
  }

  if (video.status === "FAILED") {
    notFound();
  }

  return <VideoLogs video={video} />;
}
