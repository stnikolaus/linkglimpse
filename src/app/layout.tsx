import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/styles/social-previews.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import PlausibleProvider from 'next-plausible';

export const metadata: Metadata = {
  title: "LinkGlimpse - Social Media Preview Debugger",
  description: "Generate social media previews for any URL. See how your links will appear on Facebook, Twitter, LinkedIn, Instagram, and more platforms. Free tool for marketers and developers.",
  keywords: "social media preview, facebook preview, twitter preview, linkedin preview, instagram preview, open graph, meta tags, url preview generator, social media debugger, link preview tool, og tags, social sharing preview",
  authors: [{ name: "LinkGlimpse" }],
  creator: "LinkGlimpse",
  publisher: "LinkGlimpse",
  metadataBase: new URL("https://www.linkglimpse.com"),
  alternates: {
    canonical: "https://www.linkglimpse.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
  openGraph: {
    title: "LinkGlimpse - Social Media Preview Debugger",
    description: "Generate social media previews for any URL. See how your links will appear on Facebook, Twitter, LinkedIn, Instagram, and more platforms. Free tool for marketers and developers.",
    url: "https://www.linkglimpse.com",
    siteName: "LinkGlimpse",
    images: [
      {
        url: "/images/icon/social-preview.jpeg",
        width: 1200,
        height: 630,
        alt: "LinkGlimpse - Generate social media previews for any URL",
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkGlimpse - Social Media Preview Debugger",
    description: "Generate social media previews for any URL. See how your links will appear on Facebook, Twitter, LinkedIn, Instagram, and more platforms. Free tool for marketers and developers.",
    images: ["/images/icon/social-preview.jpeg"],
    creator: "@linkglimpse",
    site: "@linkglimpse",
  },
  icons: {
    icon: [
      { url: "/images/icon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/icon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/images/icon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "manifest", url: "/manifest.json" },
    ],
  },
  category: "technology",
  classification: "Social Media Tool",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider 
          domain="linkglimpse.com"
          trackOutboundLinks={true}
          taggedEvents={true}
          pageviewProps={true}
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <StructuredData
          type="tool"
          title="LinkGlimpse - Social Media Preview Debugger"
          description="Generate social media previews for any URL. See how your links will appear on Facebook, Twitter, LinkedIn, Instagram, and more platforms. Free tool for marketers and developers."
          url="https://www.linkglimpse.com"
        />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
