import "./globals.css";
import type { Metadata } from "next";
import {
  cirkaVariable,
  cirkaLight,
  cirkaBold,
  ownersTextLight,
  ownersTextRegular,
  ownersTextItalic,
} from "@/utils/fonts";
import SkipToContent from "@/components/SkipToContent";

// Define metadata for SEO
export const metadata: Metadata = {
  title: "Ethos Metrotown | Luxury Residences",
  description:
    "Out of many, one. Ethos Metrotown offers luxury residences in the heart of the city.",
  keywords:
    "luxury residences, Metrotown, Burnaby, condos, high-rise, premium living",
  twitter: {
    card: "summary_large_image",
    title: "Ethos Metrotown | Luxury Residences",
    description:
      "Out of many, one. Ethos Metrotown offers luxury residences in the heart of the city.",
    images: ["/images/ethos-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${cirkaVariable.variable} 
        ${cirkaLight.variable} 
        ${cirkaBold.variable}
        ${ownersTextLight.variable}
        ${ownersTextRegular.variable}
        ${ownersTextItalic.variable}
      `}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ethos-dark antialiased">
        {/* Skip to content link for accessibility */}
        <SkipToContent />

        <div className="flex flex-col min-h-screen">
          <main id="main-content" className="flex-grow" tabIndex={-1}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
