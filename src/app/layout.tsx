import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { GamificationProvider } from "@/components/GamificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Psychometric Study Platform",
  description: "AI-powered psychometric study platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GamificationProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8 bg-white">
              {children}
            </main>
          </div>
        </GamificationProvider>
      </body>
    </html>
  );
}
