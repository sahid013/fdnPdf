import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "fdnPdf — Next-Gen PDF Environment",
  description: "A premium, modular Next.js environment for PDF tools, document processors, and automation pipelines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
