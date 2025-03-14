"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SearchIcon, SparklesIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

function CommandPaletteRepoForm() {
  const [url, setUrl] = useState(
    "https://www.youtube.com/watch?v=KzH1ovd4Ots&list=PLoROMvodv4rNH7qL6-efu_q2_bPuy0adh&index=1&t=3620s"
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const formRef = useRef<HTMLDivElement>(null);
  const actionQuery = searchParams.get("action");
  const router = useRouter();

  useEffect(() => {
    if (actionQuery === "convert") {
      setShowGuide(true);
    }
  }, [actionQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const validation = parseGithubUrl(url);

    // if (!validation.isValid) {
    //   setMessage(validation.error ? validation.error : null);
    //   return;
    // }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/video/start-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl: url }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Failed to process video");
      }

      // dispatch(addUserRepository(repoDetailsData.repository));

      setUrl("");
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setMessage("Check Your Network Connection");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowGuide(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const dismissGuide = useCallback(() => {
    setShowGuide(false);
    const params = new URLSearchParams(searchParams);
    params.delete("action");
    router.push(`${pathName}?${params}`);
  }, [pathName, router, searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        dismissGuide();
      }
    };

    if (showGuide) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showGuide, dismissGuide]);

  useEffect(() => {
    if (!message) return;
    toast(message);
    setMessage(null);
  }, [message]);

  return (
    <div className="m-2 ">
      {showGuide && (
        <div className="absolute inset-0 ">
          <div className="relative w-full h-full  flex items-center justify-center backdrop-blur-sm">
            <motion.div
              className={`bg-muted/30 rounded-xl border w-full max-w-lg`}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              ref={formRef}
            >
              <form onSubmit={handleSubmit}>
                <div className="flex items-center border-b px-4 py-3">
                  <SearchIcon className="w-5 h-5 text-muted-foreground mr-2" />
                  <input
                    type="url"
                    placeholder="Paste Your Youtube Video URL..."
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                    }}
                    disabled={isProcessing}
                    className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-base placeholder:text-muted-foreground"
                  />
                  <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>

                <div className="border-t px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <SparklesIcon className="w-4 h-4" />
                    <span>Uses Youtube API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      disabled={!url || isProcessing}
                      type="submit"
                      className={cn("relative overflow-hidden")}
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        "Convert Video"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}

      <div
        className={`rounded-xl border transition-all duration-600  ${
          showGuide ? "opacity-0" : "opacity-100"
        }`}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center border-b px-4 py-3">
            <SearchIcon className="w-5 h-5 text-muted-foreground mr-2" />
            <input
              type="url"
              placeholder="Paste Your Youtube Video URL..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
              disabled={isProcessing}
              className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-base placeholder:text-muted-foreground"
            />
            <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          <div className="border-t px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <SparklesIcon className="w-4 h-4" />
              <span>Uses Youtube API</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                disabled={!url || isProcessing}
                type="submit"
                className={cn("relative overflow-hidden")}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Convert Video"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <CommandPaletteRepoForm />;
}
