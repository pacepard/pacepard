'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRightToLineIcon, Calendar } from 'lucide-react';
import { cn } from '@pacepard/ui/lib/utils';
import { Button } from '@/components/ui/button';

export default function ClHero() {
    return (
        <section className="w-full bg-background pt-14 pb-12 md:pt-24 md:pb-16">
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
                <div className="flex flex-col items-start justify-start gap-8 text-left md:items-center md:justify-center md:text-center">
                    <div className="w-full min-w-0 max-w-2xl space-y-6 md:mx-auto">
                        <h1 className="text-balance text-4xl font-regular tracking-tight text-foreground md:text-5xl">
                            Where teams work better, and together
                        </h1>
                        <p className="max-w-lg text-lg leading-relaxed text-muted-foreground md:mx-auto">
                            This where you learn in teams and capture knowledge,
                            find answers, and automate projects. Now a team of 7
                            feels like 70.
                        </p>
                        <div className="flex flex-wrap items-center justify-start gap-4 md:justify-center">
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
                                    Choose a program
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
                    </div>
                </div>
            </div>
        </section>
    );
}
