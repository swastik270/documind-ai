import type { Metadata } from "next";
import "@/app/globals.css";
import { Providers } from "@/components/shared/Providers";

const inter = { className: "font-sans" };

export const metadata: Metadata = {
  title: "DocuMind AI - AI-Powered Technical Documentation Generator",
  description: "Generate README files, API specifications, system architecture flowcharts, inline comments, and security reports from your repositories automatically.",
  metadataBase: new URL("https://documind.ai"),
  openGraph: {
    title: "DocuMind AI - AI-Powered Technical Documentation Generator",
    description: "Generate README files, API specifications, and code reviews automatically.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
