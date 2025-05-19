"use client";

import { useToastContext } from "@/components/provider/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VideoInfo } from "@/interfaces/video";
import { fetchAllUserVideos } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { mutate } from "swr";
import { getVideoInfo } from "./action";
import { VideoPreview } from "./video-preview";
import Link from "next/link";

export function TranscriptExtractor() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [step, setStep] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [videoDetails, setVideoDetails] = useState<VideoInfo | null>(null);
  const [scriptContent, setScriptContent] = useState("");
  const [isSubmittingUrl, setIsSubmittingUrl] = useState(false);
  const [isSubmittingScript, setIsSubmittingScript] = useState(false);

  const { setToastMessage } = useToastContext();

  const extractVideoId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    if (!match || !match[1]) {
      throw new Error("Invalid Youtube URL");
    }
    return match[1];
  };

  const handleUrlSubmit = async () => {
    setIsSubmittingUrl(true);
    const id = extractVideoId(videoUrl);
    if (!id) {
      setToastMessage("Please enter a valid YouTube video URL");
      return;
    }

    setVideoId(id);
    await fetchVideoDetails(id);
    setStep(2);
    setIsSubmittingUrl(false);
  };

  const fetchVideoDetails = async (id: string) => {
    try {
      const response = await getVideoInfo(id);

      if (!response) {
        throw new Error("Check Your Internet Connection");
      }
      setVideoDetails(response);
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setToastMessage("Failed to fetch video details");
    }
  };

  const handleKeyDownInputYoutubeURL = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (videoUrl.trim()) {
        handleUrlSubmit();
      }
    }
    // if Shift+Enter, do nothing (allow newline)
  };

  const handleKeyDownScriptContent = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (scriptContent.trim()) {
        handleSubmit();
      }
    }
    // if Shift+Enter, do nothing (allow newline)
  };

  const extractTranscriptFromScript = async () => {
    try {
      const match = scriptContent.match(
        /ytInitialPlayerResponse\s*=\s*(\{.*?\});/
      )?.[1];
      if (!match) throw new Error("ytInitialPlayerResponse not found");

      const playerResponse = JSON.parse(match);
      const transcriptUrl: string =
        playerResponse?.captions?.playerCaptionsTracklistRenderer
          ?.captionTracks?.[0]?.baseUrl;

      if (!transcriptUrl) throw new Error("captionTracks baseUrl not found");

      const transcriptUrlInitial = "https://www.youtube.com";
      const parsedTranscriptUrl = transcriptUrl.startsWith(transcriptUrlInitial)
        ? transcriptUrl
        : `${transcriptUrlInitial}${transcriptUrl}`;

      const transcriptRes = await fetch(parsedTranscriptUrl);
      console.log("transcriptRes is ", transcriptRes);

      const transcriptXml = await transcriptRes.text();

      console.log("transcriptXml is ", transcriptXml);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(transcriptXml, "text/xml");
      const texts = xmlDoc.getElementsByTagName("text");

      let transcript = "";
      for (let i = 0; i < texts.length; i++) {
        const text = texts[i].textContent;
        if (text?.trim()) {
          transcript += text.replace(/[^\x00-\x7F]/g, "") + " ";
        }
      }

      console.log("transcript is ", transcript);

      return transcript;
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setToastMessage(
        error instanceof Error ? error.message : "Failed to extract URL"
      );
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmittingScript(true);

      const transcript = await extractTranscriptFromScript();

      if (!transcript) {
        throw new Error("Transcript not Found.");
      }

      const response = await fetch("/api/video/start-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          transcript,
        }),
      });

      const data = await response.json();

      console.log("data is ", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to Submit.");
      }

      mutate(fetchAllUserVideos);
      setVideoUrl("");
      setStep(1);
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setToastMessage(
        error instanceof Error ? error.message : "Failed to submit"
      );
    } finally {
      setIsSubmittingScript(false);
    }
  };

  return (
    <div className="max-w-3xl w-full  flex flex-col gap-6  mx-auto border rounded m-2 px-3 py-2 bg-muted/10">
      <div>
        <h2>Extract YouTube Video Transcript</h2>
        <p className="text-muted-foreground">
          Follow the steps below to generate blogs
        </p>
      </div>
      <div>
        {step === 1 && (
          <div className="space-y-2">
            <h3 className="text-lg">Step 1: Enter YouTube Video URL</h3>

            <div className="flex gap-1">
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                className="rounded rounded-r-none"
                onChange={(e) => setVideoUrl(e.target.value)}
                onKeyDown={handleKeyDownInputYoutubeURL}
              />
              <Button
                variant={"outline"}
                className="rounded rounded-l-none "
                disabled={isSubmittingUrl || !videoUrl.trim()}
                onClick={handleUrlSubmit}
              >
                {isSubmittingUrl ? (
                  <div className="flex gap-2 items-center">
                    <Loader2 className="h-4 w-4 animate-spin" /> Wait ...
                  </div>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <h3 className="text-lg ">Step 2: Get Transcript JSON File</h3>

            {videoDetails && (
              <VideoPreview videoDetails={videoDetails} videoId={videoId} />
            )}
            <div className="flex flex-col gap-2 p-4 ">
              Due to YouTube&apos;s restrictions, you need to manually download
              the transcript JSON file. Follow these steps:
              <ol className="list-decimal list-inside mt-2 space-y-2">
                <li>
                  <Link
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-500 hover:underline"
                  >
                    Open the video in YouTube
                  </Link>{" "}
                  & Enable Captions
                </li>
                <li>
                  Right-click on the page and select{" "}
                  <span className="text-purple-500">Inspect</span>
                </li>
                <li>
                  Navigate to <span className="text-purple-500">Elements</span>{" "}
                  Tab
                </li>
                <li>
                  Click on any HTML Element and then press <kbd>Ctrl</kbd> +{" "}
                  <kbd>F</kbd> and search for{" "}
                  <span className="text-purple-500">
                    ytInitialPlayerResponse
                  </span>
                </li>
                <li>
                  Copy the script tag containing ytInitialPlayerResponse and
                  paste it below
                </li>
              </ol>
              <Textarea
                placeholder="Paste the full <script>...</script> content that contains ytInitialPlayerResponse"
                rows={6}
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                onKeyDown={handleKeyDownScriptContent}
                className="resize-none rounded"
              />
              <Button
                variant="outline"
                className="w-full rounded"
                onClick={handleSubmit}
                disabled={isSubmittingScript || !scriptContent.trim()}
              >
                {isSubmittingScript ? (
                  <div className="flex gap-2 items-center">
                    <Loader2 className="h-4 w-4 animate-spin" /> Wait ...
                  </div>
                ) : (
                  "Generate Blogs"
                )}
              </Button>
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
