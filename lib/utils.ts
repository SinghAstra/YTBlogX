import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fileExtensionIconMap = {
  js: "javascript",
  ts: "typescript",
  jsx: "react",
  tsx: "react",
  java: "java",
  css: "css3",
  md: "markdown",
  mdx: "markdown",
  go: "go",
  astro: "astro",
  prisma: "prisma",
  py: "python",
  kt: "kotlin",
  php: "php",
  gitignore: "git",
  cs: "csharp",
  cpp: "cplusplus",
  c: "c",
  bash: "bash",
  html: "html5",
  json: "json",
};

export function hasSupportedExtension(name: string) {
  const splittedNames = name.split(".");
  const ext = splittedNames[splittedNames.length - 1];
  if (!ext) return false;
  return !!fileExtensionIconMap[ext as keyof typeof fileExtensionIconMap];
}

export function getIconName(name: string) {
  const splittedNames = name.split(".");
  const ext = splittedNames[splittedNames.length - 1];
  return fileExtensionIconMap[ext as keyof typeof fileExtensionIconMap];
}

export function parseYoutubeUrl(url: string): {
  isValid: boolean;
  message?: string;
} {
  const regex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(&\S*)?$/;

  if (!url.trim()) {
    return { isValid: false, message: "URL cannot be empty." };
  }

  if (!regex.test(url)) {
    return { isValid: false, message: "Invalid YouTube video URL." };
  }

  return { isValid: true };
}

export function convertISO8601ToTime(duration: string) {
  const hoursMatch = duration.match(/(\d+)H/);
  const minutesMatch = duration.match(/(\d+)M/);
  const secondsMatch = duration.match(/(\d+)S/);

  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;

  // Format as "H:MM:SS" or "MM:SS" if no hours
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to Fetch Data Using Fetcher");
  }

  return response.json();
};
