"use client";

import { useToastContext } from "@/components/provider/toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VideoInfo } from "@/interfaces/video";
import { InfoIcon as InfoCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { getVideoInfo } from "./action";
import { FileUploader } from "./file-uploader";
import { VideoPreview } from "./video-preview";

export function TranscriptExtractor() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [step, setStep] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transcriptData, setTranscriptData] = useState<any>(null);
  const [videoDetails, setVideoDetails] = useState<VideoInfo | null>(null);
  const [scriptContent, setScriptContent] = useState("");
  const [transcriptUrl, setTranscriptUrl] = useState("");
  const [isSubmittingUrl, setIsSubmittingUrl] = useState(false);

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

  const handleFileUpload = (fileContent: string) => {
    try {
      const data = JSON.parse(fileContent);
      setTranscriptData(data);
      setStep(3);
      setToastMessage("Transcript data loaded successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setToastMessage("The file does not contain valid JSON data");
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
        extractTranscriptUrlFromScript();
      }
    }
    // if Shift+Enter, do nothing (allow newline)
  };

  const extractTranscriptUrlFromScript = () => {
    try {
      const match = scriptContent.match(
        /ytInitialPlayerResponse\s*=\s*(\{.*?\});/
      )?.[1];
      if (!match) throw new Error("ytInitialPlayerResponse not found");

      const playerResponse = JSON.parse(match);
      const url =
        playerResponse?.captions?.playerCaptionsTracklistRenderer
          ?.captionTracks?.[0]?.baseUrl;

      if (!url) throw new Error("captionTracks baseUrl not found");

      setTranscriptUrl(url + "&fmt=json3");
      setToastMessage("Transcript URL extracted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setToastMessage(
        error instanceof Error ? error.message : "Failed to extract URL"
      );
    }
  };

  const downloadTranscript = () => {
    if (!transcriptUrl) {
      setToastMessage("Transcript URL is not available yet");
      return;
    }
    setToastMessage("Downloading Transcript..");
    // open the transcript URL in a new tab for manual download
    window.open(transcriptUrl, "_blank");
    setStep(3);
  };

  return (
    <div className="w-full border rounded m-2 px-3 py-2 bg-muted/20 flex flex-col gap-2">
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
                disabled={isSubmittingUrl}
                onClick={handleUrlSubmit}
              >
                {isSubmittingUrl ? (
                  <div className="flex gap-2">
                    <Loader2 /> Wait ...
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

            {videoDetails && <VideoPreview videoDetails={videoDetails} />}

            <Alert>
              <InfoCircle className="h-4 w-4" />
              <AlertTitle>Manual step required</AlertTitle>
              <AlertDescription className="flex flex-col gap-2">
                Due to YouTube&apos;s restrictions, you need to manually
                download the transcript JSON file. Follow these steps:
                <ol className="list-decimal list-inside mt-2 space-y-2">
                  <li>
                    Open the video in YouTube :{" "}
                    <a
                      href={`https://www.youtube.com/watch?v=${videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-500 hover:underline"
                    >
                      Open Video
                    </a>
                  </li>
                  <li>
                    Right-click on the page and select{" "}
                    <span className="text-purple-500">Inspect</span>
                  </li>
                  <li>
                    Navigate to{" "}
                    <span className="text-purple-500">Elements</span> Tab
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
                {!transcriptUrl && (
                  <div className="flex flex-col gap-2">
                    <Textarea
                      placeholder="Paste the full <script>...</script> content that contains ytInitialPlayerResponse"
                      rows={6}
                      value={scriptContent}
                      onChange={(e) => setScriptContent(e.target.value)}
                      onKeyDown={handleKeyDownScriptContent}
                      className="resize-none"
                    />

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={extractTranscriptUrlFromScript}
                    >
                      Extract Transcript URL
                    </Button>
                  </div>
                )}
                {transcriptUrl && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={downloadTranscript}
                  >
                    Download Transcript
                  </Button>
                )}
              </AlertDescription>
            </Alert>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium">Step 3: Upload Transcript</h3>

            <FileUploader onFileLoaded={handleFileUpload} />

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium">Step 4: Results</h3>

            <Alert className="bg-green-50 border-green-200">
              <InfoCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">
                Processing Complete
              </AlertTitle>
              <AlertDescription className="text-green-600">
                Your transcript has been processed successfully. You can now
                view the results below.
              </AlertDescription>
            </Alert>

            <Textarea
              className="min-h-[200px]"
              readOnly
              value={
                transcriptData
                  ? "Processed transcript content would appear here..."
                  : ""
              }
            />

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                onClick={() => {
                  setVideoUrl("");
                  setVideoId("");
                  setTranscriptData(null);
                  setVideoDetails(null);
                  setStep(1);
                }}
              >
                Start New
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
