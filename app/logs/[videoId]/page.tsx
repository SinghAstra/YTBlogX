import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import RepoProcessingLogs from "./logs";

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
  });

  if (!video) {
    notFound();
  }

  if (video.processingState === "COMPLETED") {
    redirect(`/video/${videoId}`);
  }

  return <RepoProcessingLogs video={video} />;
}
