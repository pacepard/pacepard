import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next"; 

import { useFont } from "@/_data/fonts";
import { siteConfig } from "@/_data/site-config";
import { Navbar } from "@/components/pacepard/containers/nav-bar";
import Footer from "@/components/pacepard/sections/footer";
import { ThemeProvider } from "@/context/theme-provider";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.getStartedUrl),
  keywords: [
    "Pacepard",
    "Hackathon",
    "Product Designer",
    "Youtube",
    "Product Management",
    "Software Engineering",
    "Data Science",
    "Open Source Contribution"
  ],
  authors: [
    {
      name: siteConfig.title,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.title,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.getStartedUrl,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/blocks/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.links.creator,
  },
  icons: {
    icon: `${siteConfig.url}/blocks/pacepard.png`,
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body className={`${useFont.variable} antialiased`}  suppressHydrationWarning>

        <ThemeProvider>

          {/* <PacepardHeader /> */}
          <Navbar/>

          {children}

          <Footer />

        </ThemeProvider>

        <Analytics />
        <SpeedInsights />

      </body>
    </html>
  );
}
