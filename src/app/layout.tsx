import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/styles/social-previews.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Social Preview Generator",
  description: "Generate social media previews for any URL. See how your links will appear on Facebook, Twitter, LinkedIn, and more.",
  keywords: "social media, preview, generator, facebook, twitter, linkedin, whatsapp, slack, discord",
  authors: [{ name: "Social Preview Generator" }],
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
