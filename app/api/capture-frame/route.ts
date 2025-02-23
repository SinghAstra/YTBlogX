import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const videoUrl = searchParams.get("url");

  if (!videoUrl) {
    return NextResponse.json({ message: "Missing video URL" }, { status: 400 });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(videoUrl, { waitUntil: "networkidle2" });

    const frames: string[] = [];

    for (let i = 0; i < 5; i++) {
      // Capture 5 frames for demo
      const screenshot = await page.screenshot({ encoding: "base64" });
      frames.push(`data:image/png;base64,${screenshot}`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
    }

    await browser.close();
    return NextResponse.json({ frames });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to capture frames" },
      { status: 500 }
    );
  }
}
