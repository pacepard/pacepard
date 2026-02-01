'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@pacepard/ui/lib/utils';
import { Button } from '@/components/ui/button';

/** Hero illustration: screenshot at public/blocks/cl-hero.png, fallback to learners.svg from /blocks */
const HERO_IMAGE = '/blocks/dev.png';
const HERO_SVG_FALLBACK = '/blocks/learners.svg';

export default function ClHero() {
    const [imageError, setImageError] = useState(false);

    return (
        <section className="w-full py-16 md:py-24 lg:py-28 bg-background">
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
                <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
                    {/* Left: headline, description, CTAs */}
                    <div className="flex-1 min-w-0 space-y-6 text-left">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                            Where teams work{' '}
                            <br className="hidden sm:block" />
                            better, together
                        </h1>
                        <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                            Your projects, wikis and docs, all side by side. For
                            small teams to large organizations.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
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
                                    Get Notion free
                                    <ArrowRight
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
                                    Request a demo
                                    <ArrowRight
                                        className="size-4"
                                        strokeWidth={2.5}
                                        aria-hidden
                                    />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right: illustration — screenshot or SVG from /blocks */}
                    <div className="relative flex shrink-0 items-center justify-center w-full max-w-lg lg:max-w-xl">
                        {!imageError ? (
                            <Image
                                src={HERO_IMAGE}
                                alt="Teams collaborating with projects, wikis and docs"
                                width={560}
                                height={420}
                                className="h-auto w-full object-contain"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <Image
                                src={HERO_SVG_FALLBACK}
                                alt="Teams collaborating"
                                width={400}
                                height={400}
                                className="h-auto w-full max-w-md object-contain"
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
