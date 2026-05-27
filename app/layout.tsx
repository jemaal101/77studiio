import type { Metadata, Viewport } from "next";
import {
  Plus_Jakarta_Sans,
  Instrument_Serif,
  Anton,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

// Primary — confident modern sans for display + body.
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

// Editorial accent — used ONLY for italic accent words (rotating "evolved.", etc.)
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// Brand wordmark — heavy condensed display for the "77" mark.
const mark = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mark",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://evolvejem.vercel.app"),
  title: {
    default: "77 Studio Co — Marketing, Evolved.",
    template: "%s · 77 Studio Co",
  },
  description:
    "AI-native creative studio. Done-for-you content and ads for brands that can't afford to guess. Based in Melbourne, working across Australia.",
  keywords: [
    "77 Studio Co",
    "creative agency Melbourne",
    "AI marketing agency",
    "content agency Australia",
    "short-form video agency",
    "AI photoshoots",
    "e-commerce marketing",
  ],
  authors: [{ name: "77 Studio Co" }],
  openGraph: {
    title: "77 Studio Co — Marketing, Evolved.",
    description:
      "AI-powered, human-directed ads for brands that can't afford to guess.",
    url: "https://evolvejem.vercel.app",
    siteName: "77 Studio Co",
    locale: "en_AU",
    type: "website",
    images: [{ url: "/logo-light.png", width: 1200, height: 630, alt: "77 Studio Co" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "77 Studio Co — Marketing, Evolved.",
    description: "AI-powered, human-directed ads for brands that can't afford to guess.",
    images: ["/logo-light.png"],
  },
  icons: {
    icon: [
      { url: "/logo-light.png", type: "image/png" },
    ],
    apple: "/logo-light.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mark.variable} ${mono.variable}`}
    >
      <body className="font-sans antialiased">
        <div className="noise" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
