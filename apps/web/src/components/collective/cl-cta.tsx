'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowRightToLineIcon, Calendar } from 'lucide-react';
import { cn } from '@pacepard/ui/lib/utils';
import { Button } from '@/components/ui/button';

/** Set to true or put your screenshot at /blocks/cta-creator.png to use the image in the UI. */
const USE_CTA_IMAGE = false;

/**
 * Illustration: person with board and geometric shapes (red triangle, yellow crescent, blue polygon).
 * Matches the CTA design. Replace with Image src="/blocks/cta-creator.png" to use a screenshot asset.
 */
function CtaIllustration({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 400 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden
        >
            {/* Whiteboard frame with pins */}
            <rect
                x="140"
                y="60"
                width="180"
                height="140"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
                fill="white"
                className="text-foreground"
            />
            <circle cx="155" cy="75" r="4" fill="currentColor" className="text-foreground" />
            <circle cx="305" cy="75" r="4" fill="currentColor" className="text-foreground" />

            {/* Red triangle - top left */}
            <path
                d="M165 95 L205 95 L185 135 Z"
                fill="#E05D5D"
            />

            {/* Yellow crescent - bottom left */}
            <path
                d="M165 175 A 28 28 0 1 1 165 220 A 22 22 0 1 0 165 175 Z"
                fill="#F2C94C"
            />

            {/* Blue diamond / polygon - bottom right */}
            <path
                d="M260 195 L290 165 L320 195 L290 225 Z"
                fill="#4A90E2"
            />

            {/* Person: head */}
            <circle
                cx="100"
                cy="95"
                r="32"
                stroke="currentColor"
                strokeWidth="2"
                fill="white"
                className="text-foreground"
            />
            {/* Hair (wavy, black) */}
            <path
                d="M72 88 Q68 75 75 70 Q82 68 85 78 Q88 85 80 92 Q72 98 68 88 Q65 78 72 88 Z M78 95 Q70 105 75 118 Q82 125 90 118 Q98 110 92 98 Q85 92 78 95 Z"
                fill="currentColor"
                className="text-foreground"
            />
            {/* Body / torso */}
            <path
                d="M85 128 L75 200 L95 200 L105 165 L115 200 L135 200 L125 128 Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="white"
                className="text-foreground"
            />
            {/* Arm reaching toward board */}
            <path
                d="M132 145 L155 120"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-foreground"
            />
        </svg>
    );
}

export default function ClCta() {
    const [imageError, setImageError] = useState(false);
    const showImage = USE_CTA_IMAGE && !imageError;

    return (
        <section
            className={cn(
                'w-full py-16 md:py-24',
                'bg-neutral-50',
            )}
        >
            <div className="container mx-auto max-w-5xl px-4 md:px-6">
                <div className="flex flex-col items-center gap-12 md:flex-row md:items-center md:justify-between md:gap-16">
                    {/* Left: illustration — put screenshot at public/blocks/cta-creator.png and set USE_CTA_IMAGE true to use it */}
                    <div className="relative flex shrink-0 items-center justify-center w-full max-w-md md:max-w-[400px]">
                        {showImage ? (
                            <Image
                                src="/blocks/cta-creator.png"
                                alt="Person interacting with a board of colorful shapes"
                                width={400}
                                height={280}
                                className="h-auto w-full object-contain"
                                priority={false}
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <CtaIllustration className="h-auto w-full max-h-[280px]" />
                        )}
                    </div>

                    {/* Right: headline, description, CTA */}
                    <div className="flex-1 min-w-0 space-y-6 text-left">
                        <h2 className="text-4xl font-regular tracking-tight text-foreground md:text-5xl">
                            Become a superhuman
                        </h2>
                        <p className="max-w-lgleading-relaxed text-muted-foreground text-lg">
                            Submit your template to the Notion template gallery,
                            get featured, and even get paid – all in just a few
                            clicks.
                        </p>

                        <div className="flex flex-wrap items-center justify-start gap-4 ">
                            <Button
                                asChild
                                size="lg"
                                className={cn(
                                    'h-11 rounded-md px-5 text-base font-medium',
                                    'bg-foreground text-background hover:bg-foreground/90',
                                    'shadow-sm transition-colors',
                                )}
                            >
                                <Link
                                    href="#"
                                    className="inline-flex items-center gap-2"
                                >
                                   Choose program
                                    <ArrowRightToLineIcon
                                        className="size-4"
                                        strokeWidth={2.5}
                                        aria-hidden
                                    />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className={cn(
                                    'h-11 rounded-md px-5 text-base font-medium',
                                    'border-foreground/30 bg-background text-foreground',
                                    'hover:bg-muted hover:text-foreground',
                                    'shadow-sm transition-colors',
                                )}
                            >
                                <Link
                                    href="#"
                                    className="inline-flex items-center gap-2"
                                >
                                      <Calendar
                                        className="size-4"
                                        strokeWidth={2.5}
                                        aria-hidden
                                    />
                                    Clarity session
                                  
                                </Link>
                            </Button>
                        </div>
                        {/* <Button
                            asChild
                            variant="outline"
                            size="default"
                            className={cn(
                                'h-10 rounded-md px-4 text-sm font-medium',
                                'bg-muted/50 border-border text-foreground',
                                'hover:bg-muted hover:text-foreground',
                                'shadow-sm transition-colors',
                            )}
                        >
                            <Link
                                href="#"
                                className="inline-flex items-center gap-2"
                            >
                                Get started
                                <ArrowRight
                                    className="size-4"
                                    strokeWidth={2.5}
                                    aria-hidden
                                />
                            </Link>
                        </Button> */}
                    </div>
                </div>
            </div>
        </section>
    );
}
