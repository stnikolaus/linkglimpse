import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/styles/social-previews.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "LinkGlimpse - Social Media Preview Debugger",
  description: "Generate social media previews for any URL. See how your links will appear on Facebook, Twitter, LinkedIn, and more.",
  keywords: "social media, preview, generator, facebook, twitter, linkedin, whatsapp, slack, discord",
  authors: [{ name: "LinkGlimpse" }],
  metadataBase: new URL("https://www.linkglimpse.com"),
  openGraph: {
    title: "LinkGlimpse - Social Media Preview Debugger",
    description: "Generate social media previews for any URL. See how your links will appear on Facebook, Twitter, LinkedIn, and more.",
    url: "https://www.linkglimpse.com",
    siteName: "LinkGlimpse",
    images: [
      {
        url: "/images/icon/social-preview.jpeg",
        width: 1200,
        height: 630,
        alt: "LinkGlimpse - Generate social media previews for any URL",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkGlimpse - Social Media Preview Debugger",
    description: "Generate social media previews for any URL. See how your links will appear on Facebook, Twitter, LinkedIn, and more.",
    images: ["/images/icon/social-preview.jpeg"],
    creator: "@linkglimpse",
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
      { rel: "manifest", url: "/images/icon/site.webmanifest" },
    ],
  },
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
      <body className="antialiased flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
