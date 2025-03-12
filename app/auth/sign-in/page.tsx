"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Clock, History, Loader } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const features = [
  {
    title: "Learning History Tracking",
    description:
      "Keep track of all your previously analyzed videos and revisit them whenever needed.",
    icon: History,
  },
  {
    title: "Time-Efficient Learning",
    description:
      "Skip through hours of video content and get straight to the key concepts and code explanations.",
    icon: Clock,
  },
  {
    title: "Real-time Processing",
    description:
      "Watch as your video transforms into readable blog content with our streamlined processing system.",
    icon: Loader,
  },
];

export default function SignIn() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  console.log("callbackUrl is ", callbackUrl);

  const handleGitHubSignIn = async () => {
    try {
      setIsGithubLoading(true);
      await signIn("github", {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.log("Error occurred during github sign in");
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
    } finally {
      setIsGithubLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.log("Error occurred during google sign in");
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Left Panel - Info Section */}
      <div className="hidden lg:flex lg:w-3/5 z-20 bg-card">
        <div className="w-full  flex flex-col justify-between">
          <div className="backdrop-blur-md p-6">
            <Link href="/">
              <h1 className="text-5xl font-bold ">{siteConfig.name}</h1>
            </Link>
            <p className="text-muted-foreground mt-1 text-lg">
              {siteConfig.description}
            </p>
          </div>

          <div className="space-y-4 max-w-2xl p-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-lg border backdrop-blur-md"
              >
                <div className="p-2 rounded-md border">
                  <feature.icon />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-sm text-muted-foreground p-6">
            © 2024 {siteConfig.name}. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Section */}
      <div className="w-full lg:w-2/5 flex items-center justify-center">
        <div className=" flex items-center justify-center p-8 relative">
          {/* Decorative elements */}
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="w-full max-w-md p-8 bg-card/50 backdrop-blur-sm rounded-md border space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold">
                Welcome to{" "}
                <span className="text-primary">{siteConfig.name}</span>
              </h2>
              <p className="text-muted-foreground">
                Sign in to start analyzing your repositories
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleGitHubSignIn}
                disabled={isGithubLoading}
                variant="default"
                className="w-full bg-[#24292F] text-white hover:bg-[#24292F]/90 group"
              >
                {isGithubLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Wait ...
                  </>
                ) : (
                  <>
                    <FaGithub className="mr-2 h-5 w-5" />
                    <span className="text-center">Continue with GitHub</span>
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full ml-2 animate-pulse">
                      Recommended
                    </span>
                  </>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase ">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full text-primary"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Wait ...
                  </>
                ) : (
                  <>
                    <Image
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      width={18}
                      height={18}
                      className="mr-2"
                    />
                    Continue with Google
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
