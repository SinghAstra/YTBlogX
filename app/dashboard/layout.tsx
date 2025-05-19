import { LeftSidebar } from "@/components/dashboard/left-sidebar";
import { Navbar } from "@/components/dashboard/navbar";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { fetchVideos } from "./action";

interface DashboardLayoutProps {
  children: ReactNode;
}

export async function generateMetadata() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in");
  }

  return {
    title: `Dashboard`,
    description: `Welcome to your dashboard, ${session.user.name}`,
  };
}
async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in");
  }

  const { videos } = await fetchVideos();

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={session.user} />
      <div className="flex pt-16">
        <LeftSidebar videos={videos} />
        <main className="hidden md:flex flex-1 ml-96">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
