import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "applier-pro | AI-Powered Job Application Suite",
  description: "Get hired faster with AI. 5x more applications, 50% higher response rate, better offers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {children}
      </body>
    </html>
  );
}
