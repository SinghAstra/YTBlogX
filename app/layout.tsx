import Providers from "@/components/provider/provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "YouTube blog generator",
    "AI content creation",
    "video to text",
    "automatic blogging",
    "content transformation",
    "AI writing tool",
    "video summarization",
    "content generation",
    "SEO content",
    "online writing assistant",
  ],
  authors: [
    {
      name: "SinghAstra",
      url: "https://github.com/SinghAstra",
    },
  ],
  creator: "SinghAstra",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/assets/landing.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/assets/landing.png"],
    creator: "@singhastra",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen ">
        <Providers>
          <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                fontFamily: "Space Grotesk, monospace",
                background: "hsl(var(--muted) / 0.2)",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
                letterSpacing: "0.01em",
                fontSize: ".95rem",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
