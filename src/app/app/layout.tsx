import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Otto - Your Personal AI Assistant",
  description: "Meet Otto, the AI assistant that actually knows your life. Schedule, plan, and stay organized with your personal AI companion.",
  keywords: ["AI assistant", "personal assistant", "calendar", "scheduling", "productivity"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans">{children}</body>
      </html>
    </ClerkProvider>
  );
}
