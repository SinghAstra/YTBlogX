import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";
import { AvatarMenu } from "../ui/avatar-menu";
import SignIn from "../ui/sign-in";

interface NavbarProps {
  user: User;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-dotted bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <Link href="/dashboard">
          <span className="text-xl tracking-wider">{siteConfig.name}</span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <Link
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            href="/dashboard?action=convert"
          >
            <Plus className="h-5 w-5" />
            Add Youtube Link
          </Link>
          {user ? <AvatarMenu user={user} /> : <SignIn />}
        </div>
      </div>
    </nav>
  );
}
