import { Navbar } from "@/components/dashboard/navbar";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface LogsLayoutProps {
  children: ReactNode;
}

async function LogsLayout({ children }: LogsLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div>
      <Navbar user={session.user} />
      <div className="flex items-center justify-center min-h-screen pt-16">
        {children}
      </div>
    </div>
  );
}

export default LogsLayout;
