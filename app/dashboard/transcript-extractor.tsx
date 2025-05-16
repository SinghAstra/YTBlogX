"use client";

import { useToastContext } from "@/components/provider/toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { VideoInfo } from "@/interfaces/video";
import { AlertCircle, InfoIcon as InfoCircle } from "lucide-react";
import { useState } from "react";
import { getVideoInfo } from "./action";
import { FileUploader } from "./file-uploader";
import { Steps } from "./steps";
import { VideoPreview } from "./video-preview";

export function TranscriptExtractor() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [activeTab, setActiveTab] = useState("url");
  const [step, setStep] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transcriptData, setTranscriptData] = useState<any>(null);
  const [videoDetails, setVideoDetails] = useState<VideoInfo | null>(null);

  const { setToastMessage } = useToastContext();

  const extractVideoId = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const handleUrlSubmit = () => {
    const id = extractVideoId(videoUrl);
    if (!id) {
      setToastMessage("Please enter a valid YouTube video URL");
      return;
    }

    setVideoId(id);
    fetchVideoDetails(id);
    setStep(2);
  };

  const fetchVideoDetails = async (id: string) => {
    try {
      const response = await getVideoInfo(id);

      if (!response) {
        throw new Error("Failed to Fetch Video Info");
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

  const processTranscript = () => {
    // Process the transcript data here
    // This would be your application's main functionality
    setStep(4);
    setToastMessage("Your transcript has been processed successfully");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Extract YouTube Video Transcript</CardTitle>
        <CardDescription>
          Follow the steps below to extract and process a YouTube video
          transcript
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Steps currentStep={step} />

        {step === 1 && (
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium">
              Step 1: Enter YouTube Video Information
            </h3>
            <Tabs
              defaultValue="url"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url">Video URL</TabsTrigger>
                <TabsTrigger value="id">Video ID</TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                  <Button onClick={handleUrlSubmit}>Next</Button>
                </div>
              </TabsContent>
              <TabsContent value="id" className="space-y-4 mt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="dQw4w9WgXcQ"
                    value={videoId}
                    onChange={(e) => setVideoId(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      if (videoId.length === 11) {
                        fetchVideoDetails(videoId);
                        setStep(2);
                      } else {
                        setToastMessage(
                          "Please enter a valid YouTube video ID"
                        );
                      }
                    }}
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium">
              Step 2: Get Transcript JSON File
            </h3>

            {videoDetails && <VideoPreview videoDetails={videoDetails} />}

            <Alert>
              <InfoCircle className="h-4 w-4" />
              <AlertTitle>Manual step required</AlertTitle>
              <AlertDescription>
                Due to YouTube&apos;s restrictions, you need to manually
                download the transcript JSON file. Follow these steps:
                <ol className="list-decimal list-inside mt-2 space-y-2">
                  <li>
                    Open the video in YouTube:{" "}
                    <a
                      href={`https://www.youtube.com/watch?v=${videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Open Video
                    </a>
                  </li>
                  <li>
                    Right-click on the page and select &quot;Inspect&quot; or
                    press F12
                  </li>
                  <li>
                    Go to the &quot;Network&quot; tab in the developer tools
                  </li>
                  <li>Enable captions on the YouTube video</li>
                  <li>
                    Look for a request with &quot;timedtext&quot; in the name
                  </li>
                  <li>
                    Click on that request, go to the &quot;Response&quot; tab
                  </li>
                  <li>
                    Right-click and select &quot;Save as...&quot; to download
                    the JSON file
                  </li>
                </ol>
              </AlertDescription>
            </Alert>

            <FileUploader onFileLoaded={handleFileUpload} />

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium">Step 3: Process Transcript</h3>

            {transcriptData && (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Transcript loaded successfully</AlertTitle>
                  <AlertDescription>
                    Your transcript has been loaded and is ready to be
                    processed.
                  </AlertDescription>
                </Alert>

                <div className="max-h-60 overflow-y-auto border rounded-md p-4">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(transcriptData, null, 2).substring(0, 500)}
                    ...
                  </pre>
                </div>

                <Button onClick={processTranscript}>Process Transcript</Button>
              </div>
            )}

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
      </CardContent>
    </Card>
  );
}
