import { Navbar } from "@/components/dashboard/navbar";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

interface VideoLayoutProps {
  children: ReactNode;
}

const VideoLayout = async ({ children }: VideoLayoutProps) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div>
      <Navbar user={session.user} />
      <main className="pt-16 min-h-screen">{children}</main>
    </div>
  );
};

export default VideoLayout;
