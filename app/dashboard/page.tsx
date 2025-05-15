"use client";

import { addUserVideo, useVideo } from "@/components/context/video";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn, parseYoutubeUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle, SearchIcon, SparklesIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { fetchProcessingVideos, stopVideoProcessing } from "./action";

function CommandPaletteRepoForm() {
  const [url, setUrl] = useState<string>("");
  const [inspectContent, setInspectContent] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const formRef = useRef<HTMLDivElement>(null);
  const actionQuery = searchParams.get("action");
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const { dispatch } = useVideo();

  useEffect(() => {
    if (actionQuery === "convert") {
      setShowGuide(true);
    }
  }, [actionQuery]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const validation = parseYoutubeUrl(url);

    if (!validation.isValid) {
      setMessage(
        validation.message ? validation.message : "Invalid Youtube URL"
      );
      setIsProcessing(false);
      return;
    }

    const pendingVideos = await fetchProcessingVideos();

    if (pendingVideos.length > 0) {
      setIsProcessing(false);
      setShowAlert(true);
      return;
    }

    processVideos();
  };

  const processVideos = async () => {
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

      dispatch(addUserVideo(data.video));

      setUrl("");
      dismissGuide();
      setMessage("Video Processing Started");
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

  const handleContinueWithNewVideo = async () => {
    setIsProcessing(true);
    setShowAlert(false);
    await stopVideoProcessing();
    processVideos();
  };

  const handleCancelNewVideo = () => {
    setShowAlert(false);
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
    <div className="m-2 w-full">
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              Pending Video Processing
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have video processing already in progress. Due to API
              restrictions, starting a new video processing will stop the
              processing of all other videos. Do you want to continue with the
              new video blog generation?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelNewVideo}
              className="w-full"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleContinueWithNewVideo}
              className="w-full"
            >
              Continue with new Video
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
                <div className="flex items-center border-b px-4 py-3 gap-2">
                  <SearchIcon className="w-5 h-5 text-muted-foreground mr-2" />
                  <input
                    type="text"
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

      <div className="rounded-xl border transition-all duration-600">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col p-2 gap-2">
            <Textarea
              placeholder="Paste Your Youtube Video Inspect Page Content here..."
              value={url}
              onChange={(e) => {
                setInspectContent(e.target.value);
              }}
              disabled={isProcessing}
              rows={5}
              className="flex-1 bg-transparent border focus:outline-none focus:ring-0 text-base placeholder:text-muted-foreground resize-none "
            />
            <Button
              size="sm"
              disabled={!url || isProcessing}
              type="submit"
              className="w-full"
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
        </form>
      </div>
    </div>
  );
}

export default CommandPaletteRepoForm;
