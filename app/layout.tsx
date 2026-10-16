import { LanguageProvider } from "@/components/LanguageProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Flat design system — single geometric sans-serif ('Outfit')
// mapped to both the body (--font-sans) and headings (--font-display).
const outfitSans = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const outfitDisplay = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Cevora Platform — Infrastructure Coordination Made Effortless",
  description:
    "AI-powered infrastructure coordination platform for Indian government departments. Detect clashes, score risk, and save crores — aligned with GatiShakti.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfitSans.variable} ${outfitDisplay.variable} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
