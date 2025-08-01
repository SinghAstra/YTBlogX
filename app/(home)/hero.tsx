"use client";

import ConicBackground from "@/components/componentX/conic-background";
import MovingBackground from "@/components/componentX/moving-background";
import FadeIn from "@/components/global/fade-in";
import FadeSlideIn from "@/components/global/fade-slide-in";
import MaxWidthWrapper from "@/components/global/max-width-wrapper";
import { BackgroundShine } from "@/components/ui/background-shine";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import GradientButton from "@/components/ui/gradient-button";
import { LampContainer } from "@/components/ui/lamp";
import { siteConfig } from "@/config/site";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { FaTwitter } from "react-icons/fa";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const HeroSection = ({ isAuthenticated }: HeroSectionProps) => {
  const handleGetStarted = () => {
    if (!isAuthenticated) {
      redirect("/auth/sign-in");
    }

    if (isAuthenticated) {
      redirect("/dashboard");
    }
  };

  return (
    <div className="overflow-x-hidden scrollbar-hide ">
      <div className="min-h-screen flex items-center justify-center relative">
        <ConicBackground position="top" />
        <div className="px-3 py-2 rounded text-center flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-wider uppercase">
            Update
          </h1>
          <p>
            Hey man! Thanks for Checking out the project but this one is not
            working right now since Youtube has banned the server IP Address
          </p>
          <p>
            Working on making an Electron and Mobile App out of this
            project&apos;s logic
          </p>
          <a href={siteConfig.links.twitter} target="_blank">
            <div className="p-1 relative rounded">
              <Button
                variant="outline"
                className="rounded group relative font-normal bg-transparent hover:bg-muted/40"
              >
                <MovingBackground shineColor="hsl(var(--primary)/20)" />
                <span className=" text-sm text-foreground flex items-center justify-center gap-2">
                  <FaTwitter className="size-3" /> Follow For Updates
                  <ArrowRightIcon className="size-3 transform-all duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </div>
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-center w-full ">
          <FadeIn
            className="flex flex-col items-center justify-center w-full text-center min-h-screen"
            delay={0.1}
          >
            <GradientButton onClick={handleGetStarted}>
              ✨ Start Learning
            </GradientButton>
            <h1 className="text-foreground text-center py-6 text-5xl font-medium text-balance sm:text-6xl md:text-7xl lg:text-8xl  w-full">
              Transforming <br />
              <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text inline-bloc">
                Youtube Learning
              </span>
            </h1>

            <p className="mb-4 text-lg tracking-tight text-muted-foreground md:text-xl text-balance">
              Paste any YouTube video link &
              <br />
              I&apos;ll convert it into blog.
            </p>
            <div className="flex items-center justify-center gap-4 z-50">
              <BackgroundShine className="rounded-md">
                <Link
                  href={isAuthenticated ? "/dashboard" : "/auth/sign-in"}
                  className="flex items-center group"
                >
                  Get started for free
                  <ArrowRightIcon
                    className="ml-1 size-4 transition-transform duration-300 
        ease-in-out group-hover:translate-x-2"
                  />
                </Link>
              </BackgroundShine>
              <GradientButton rounded="md">
                <a
                  href={siteConfig.links.githubRepo}
                  className="flex items-center"
                  target="_blank"
                >
                  Github
                </a>
              </GradientButton>
            </div>
          </FadeIn>

          <FadeSlideIn
            delay={0.3}
            className="relative pt-20 pb-20 md:py-32 px-2 bg-transparent w-full"
          >
            <div className="absolute md:top-[10%] left-1/2 gradient w-3/4 -translate-x-1/2 h-1/4 md:h-1/3 inset-0 blur-[5rem] animate-image-glow"></div>
            <div className="-m-2 rounded-xl p-2 ring-1 ring-inset ring-foreground/20 lg:-m-4 lg:rounded-2xl bg-opacity-50 backdrop-blur-3xl">
              <BorderBeam size={250} duration={12} delay={9} />
              <Image
                src="/assets/dashboard.png"
                alt="Dashboard"
                width={1200}
                height={1200}
                quality={100}
                className="rounded-md lg:rounded-xl bg-foreground/10 ring-1 ring-border"
              />
              <div className="absolute -bottom-4 inset-x-0 w-full h-1/2 bg-gradient-to-t from-background z-40"></div>
              <div className="absolute bottom-0 md:-bottom-8 inset-x-0 w-full h-1/4 bg-gradient-to-t from-background z-50"></div>
            </div>
          </FadeSlideIn>
        </div>
      </MaxWidthWrapper>

      {/* CTA Section */}
      <MaxWidthWrapper className="mt-20 max-w-[100vw] overflow-x-hidden scrollbar-hide">
        <LampContainer>
          <motion.div
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center gap-8  "
          >
            <h1 className="mt-8 py-4 text-center text-4xl font-medium tracking-tight text-foreground md:text-7xl">
              Youtube Videos to <br />
              Structured Knowledge
            </h1>
            <BackgroundShine>
              <Link
                href={isAuthenticated ? "/dashboard" : "/auth/sign-in"}
                className="flex items-center "
              >
                Get started for free
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </BackgroundShine>
          </motion.div>
        </LampContainer>
      </MaxWidthWrapper>
    </div>
  );
};

export default HeroSection;
