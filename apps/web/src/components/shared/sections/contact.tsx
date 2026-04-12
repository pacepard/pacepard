'use client';

import React, { useEffect } from 'react';

import Link from 'next/link';
import Script from 'next/script';

import { Facebook, Linkedin, Twitter } from 'lucide-react';

import { DashedLine } from '@/components/dashed-line';

const contactInfo = [
    {
        title: 'Corporate office',
        content: (
            <p className="text-muted-foreground mt-3">
                1 Carlsberg Close
                <br />
                1260 Hillview, Australia
            </p>
        ),
    },
    {
        title: 'Email us',
        content: (
            <div className="mt-3">
                <div>
                    <p className="">Careers</p>
                    <Link
                        href="mailto:careers@example.com"
                        className="text-muted-foreground hover:text-foreground"
                    >
                        careers@example.com
                    </Link>
                </div>
                <div className="mt-1">
                    <p className="">Press</p>
                    <Link
                        href="mailto:press@example.com"
                        className="text-muted-foreground hover:text-foreground"
                    >
                        press@example.com
                    </Link>
                </div>
            </div>
        ),
    },
    {
        title: 'Follow us',
        content: (
            <div className="mt-3 flex gap-6 lg:gap-10">
                <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                >
                    <Facebook className="size-5" />
                </Link>
                <Link
                    href="https://x.com/ausrobdev"
                    className="text-muted-foreground hover:text-foreground"
                >
                    <Twitter className="size-5" />
                </Link>
                <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                >
                    <Linkedin className="size-5" />
                </Link>
            </div>
        ),
    },
];

export default function Contact() {
    useEffect(() => {
        if (window.Tally) {
            window.Tally.loadEmbeds();
        }
    }, []);

    return (
        <>
            <Script
                src="https://tally.so/widgets/embed.js"
                strategy="afterInteractive"
                onLoad={() => window.Tally?.loadEmbeds()}
            />

            <section className="py-28 lg:py-32 lg:pt-44">
                <div className="container max-w-2xl">
                    <h1 className="text-center text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
                        Contact us
                    </h1>
                    <p className="text-muted-foreground mt-4 text-center leading-snug font-medium lg:mx-auto">
                        Hopefully this form gets through our spam filters.
                    </p>

                    <div className="mt-10 flex justify-between gap-8 max-sm:flex-col md:mt-14 lg:mt-20 lg:gap-12">
                        {contactInfo.map((info, index) => (
                            <div key={index}>
                                <h2 className="font-medium">{info.title}</h2>
                                {info.content}
                            </div>
                        ))}
                    </div>

                    <DashedLine className="my-12" />

                    {/* Inquiry Form */}
                    <div className="mx-auto">
                        <h2 className="mb-4 text-lg font-semibold">
                            Inquiries
                        </h2>
                        <div className="w-full max-w-3xl h-screen">
                            <iframe
                                data-tally-src="https://tally.so/embed/LZ9Zdz?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&formEventsForwarding=1"
                                loading="lazy"
                                className="w-full h-full"
                                title="Pacepard Tally Form"
                                allow="fullscreen"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
