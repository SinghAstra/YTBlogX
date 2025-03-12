"use client";

import { LeftSidebar } from "@/components/dashboard/left-sidebar";
import { Navbar } from "@/components/dashboard/navbar";
import { RightSidebar } from "@/components/dashboard/right-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        <LeftSidebar />
        <main className="flex-1 ml-96 ">{children}</main>
        <RightSidebar />
      </div>
    </div>
  );
}
