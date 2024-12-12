import { Icons } from "@/components/Icons";
import { siteConfig } from "@/config/site";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      <div className="flex flex-col items-start max-w-sm mx-auto min-h-screen overflow-hidden pt-4 md:pt-20">
        <div className="flex items-center w-full py-8 border-b-2 border-border/80">
          <Link href="/" className="flex items-center gap-x-2">
            <Icons.logo className="w-8 h-8 text-primary" />
            <h1 className="text-lg font-medium">{siteConfig.name}</h1>
          </Link>
        </div>
        {children}
      </div>
    </>
  );
}
