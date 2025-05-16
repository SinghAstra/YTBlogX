"use client";

import { useToastContext } from "@/components/provider/toast";
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
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaSpinner } from "react-icons/fa";
import { fetchProcessingVideos, stopVideoProcessing } from "./action";

function CommandPaletteRepoForm() {
  const [inspectContent, setInspectContent] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const actionQuery = searchParams.get("action");
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const { setToastMessage } = useToastContext();

  useEffect(() => {
    if (actionQuery === "convert") {
      setShowGuide(true);
    }
  }, [actionQuery]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setInspectContent(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    // if Shift+Enter, do nothing (allow newline)
  };

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);

      const pendingVideos = await fetchProcessingVideos();

      if (pendingVideos.length > 0) {
        setIsProcessing(false);
        setShowAlert(true);
        return;
      }

      console.log("inspectContent.length is ", inspectContent.length);

      const pattern = /ytInitialPlayerResponse\s*=\s*({.+?});/;
      const match = inspectContent.match(pattern);

      if (!match || !match[1]) {
        setToastMessage(
          "❌ Couldn't find ytInitialPlayerResponse in the inspect content."
        );
        setIsProcessing(false);
        return;
      }

      const playerResponse = JSON.parse(match[1]);

      const videoIdMatch = inspectContent.match(/"videoId"\s*:\s*"([^"]+)"/);
      if (!videoIdMatch || !videoIdMatch[1]) {
        setToastMessage("❌ Video ID not found in the inspect content.");
        setIsProcessing(false);
        return;
      }
      const videoId = videoIdMatch[1];

      const tracks =
        playerResponse?.captions?.playerCaptionsTracklistRenderer
          ?.captionTracks;

      if (!tracks || tracks.length === 0) {
        setToastMessage("❌ No captions found for this video.");
        setIsProcessing(false);
        return;
      }

      const transcriptTrack = tracks.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (t: any) => t.languageCode === "en"
      );

      if (!transcriptTrack) {
        setToastMessage("❌ English transcript not found.");
        setIsProcessing(false);
        return;
      }

      const transcriptUrl = transcriptTrack.baseUrl + "&fmt=json3";
      console.log("transcriptUrl is ", transcriptUrl);

      const response = await fetch("/api/video/start-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          transcriptUrl,
        }),
      });

      console.log("response is ", response);
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }

      setToastMessage(
        error instanceof Error ? error.message : "Could Not Submit Form"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueWithNewVideo = async () => {
    setIsProcessing(true);
    setShowAlert(false);
    await stopVideoProcessing();
    handleSubmit();
  };

  const handleCancelNewVideo = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    const handleDialogView = (e: globalThis.KeyboardEvent) => {
      // Check for Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowGuide(true);
      }
    };

    window.addEventListener("keydown", handleDialogView);
    return () => window.removeEventListener("keydown", handleDialogView);
  }, []);

  const dismissGuide = useCallback(() => {
    setShowGuide(false);
    const params = new URLSearchParams(searchParams);
    params.delete("action");
    router.push(`${pathName}?${params}`);
  }, [pathName, router, searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
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
              ref={dialogRef}
            >
              <div className="rounded-xl border transition-all duration-600">
                <div className="flex flex-col p-2 gap-2">
                  <Textarea
                    placeholder="Paste Your Youtube Video Inspect Page Content here..."
                    value={inspectContent}
                    onChange={handleChange}
                    disabled={isProcessing}
                    rows={5}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border focus:outline-none focus:ring-0 text-base placeholder:text-muted-foreground resize-none "
                  />
                  <Button
                    size="sm"
                    disabled={!inspectContent || isProcessing}
                    onClick={handleSubmit}
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
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <div className="rounded-xl border transition-all duration-600">
        <div className="flex flex-col p-2 gap-2">
          <Textarea
            placeholder="Paste Your Youtube Video Inspect Page Content here..."
            value={inspectContent}
            onChange={handleChange}
            disabled={isProcessing}
            rows={5}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border focus:outline-none focus:ring-0 text-base placeholder:text-muted-foreground resize-none "
          />
          <Button
            size="sm"
            disabled={!inspectContent || isProcessing}
            onClick={handleSubmit}
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
      </div>
    </div>
  );
}

export default CommandPaletteRepoForm;
