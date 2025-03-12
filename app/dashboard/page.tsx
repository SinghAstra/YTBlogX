"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SearchIcon, SparklesIcon, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

function CommandPaletteRepoForm() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const actionQuery = searchParams.get("action");
  const router = useRouter();

  useEffect(() => {
    if (actionQuery === "connect") {
      setShowGuide(true);
      inputRef.current?.focus();
    }
  }, [actionQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // const validation = parseGithubUrl(url);

    // if (!validation.isValid) {
    //   setMessage(validation.error ? validation.error : null);
    //   return;
    // }

    // setIsProcessing(true);

    // try {
    //   const response = await fetch("/api/repository/process", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ githubUrl: url }),
    //   });

    //   const data = await response.json();
    //   if (!response.ok) {
    //     setMessage(data.message || "Failed to process repository");
    //   }

    //   console.log("data --repositoryProcess is ", data);

    //   const responseRepoDetails = await fetch(
    //     `/api/repository/${data.repositoryId}`
    //   );
    //   const repoDetailsData = await responseRepoDetails.json();
    //   if (!responseRepoDetails.ok) {
    //     setMessage(
    //       repoDetailsData.message || "Failed to fetch repository details"
    //     );
    //   }
    //   dispatch(addUserRepository(repoDetailsData.repository));

    //   setIsSuccess(true);
    //   setUrl("");

    //   setTimeout(() => setIsSuccess(false), 3000);
    // } catch (error) {
    //   if (error instanceof Error) {
    //     console.log("error.stack is ", error.stack);
    //     console.log("error.message is ", error.message);
    //   }
    //   setMessage("Check Your Network Connection");
    // } finally {
    //   setIsProcessing(false);
    // }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
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
    <div className="m-2 relative ">
      {showGuide && (
        <div className="absolute inset-0 -m-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -inset-4 bg-primary/20 rounded-xl"
          >
            <Button
              size="sm"
              variant="ghost"
              onClick={dismissGuide}
              className="absolute top-1 right-1 h-8 w-8 p-0 hover:bg-primary/30"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      )}
      <div
        className={`bg-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-xl border shadow-lg transition-all duration-600 ${
          showGuide && "my-12 z-50"
        }`}
        ref={formRef}
      >
        {/* Search Header */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center border-b px-4 py-3">
            <SearchIcon className="w-5 h-5 text-muted-foreground mr-2" />
            <input
              ref={inputRef}
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

          {/* Action Footer */}
          <div className="border-t px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <SparklesIcon className="w-4 h-4" />
              <span>Uses Youtube API</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                disabled={!url || isProcessing || isSuccess}
                type="submit"
                className={cn(
                  "relative overflow-hidden",
                  isSuccess && "bg-yellow-400 "
                )}
              >
                {isSuccess ? (
                  <div className="flex items-center">
                    <FaSpinner className="mr-2 h-5 w-5 animate-spin" />
                    Processing Started...
                  </div>
                ) : isProcessing ? (
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
