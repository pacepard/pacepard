import './globals.css';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';

import { useFont } from '@/_data/fonts';
import { siteConfig } from '@/_data/site-config';
import { Navbar } from '@/components/shared/containers/nav-bar';
import Footer from '@/components/shared/sections/footer';
import { ThemeProvider } from '@/context/theme-provider';
import PPFunnel from '@/components/pacepard/pp-funnel';

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
    metadataBase: new URL(siteConfig.getStartedUrl),
    keywords: [
        'Pacepard',
        'Hackathon',
        'Product Designer',
        'Youtube',
        'Product Management',
        'Software Engineering',
        'Data Science',
        'Open Source Contribution',
    ],
    authors: [
        {
            name: siteConfig.title,
            url: siteConfig.url,
        },
    ],
    creator: siteConfig.title,
    openGraph: {
        type: 'website',
        locale: 'en_US',
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
        card: 'summary_large_image',
        title: siteConfig.name,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
        creator: siteConfig.links.creator,
    },
    icons: {
        icon: [
            {
                url: '/blocks/pacepard-icon.svg',
                type: 'image/svg+xml',
            },
            {
                url: '/blocks/favicon.ico',
                sizes: 'any',
            },
            {
                url: '/blocks/pacepard-icon.png',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                url: '/blocks/pacepard-icon.png',
                sizes: '16x16',
                type: 'image/png',
            },
        ],
        apple: [
            {
                url: '/blocks/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
        other: [
            {
                rel: 'mask-icon',
                url: '/blocks/pacepard-icon.svg',
                color: '#000000',
            },
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/blocks/apple-touch-icon.png',
            },
        ],
    },
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: siteConfig.title,
    },
    other: {
        'msapplication-TileColor': '#000000',
        'msapplication-config': '/browserconfig.xml',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${useFont.variable} antialiased overflow-x-hidden`}
                suppressHydrationWarning
            >
                <ThemeProvider>
                    {/* <PacepardHeader /> */}
                    <Navbar />

                    {children}

                    <PPFunnel />
                    <Footer />
                </ThemeProvider>

                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
