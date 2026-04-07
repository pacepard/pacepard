'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowRightToLineIcon } from 'lucide-react';
import { cn } from '@pacepard/ui/lib/utils';
import { Button } from '@/components/ui/button';

export default function ClHero() {
    return (
        <section className="w-full bg-background pt-14 pb-12 md:pt-24 md:pb-16">
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
                <div className="flex flex-col items-center justify-center gap-8 text-center">
                    <div className="mx-auto w-full min-w-0 max-w-2xl space-y-6">
                        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                            Where teams work better, and together
                        </h1>
                        <p className="mx-auto max-w-lg text-lg leading-relaxed text-muted-foreground">
                            This where you learn in teams and capture knowledge,
                            find answers, and automate projects. Now a team of 7
                            feels like 70.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
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
                                    Get Pacepard free
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
                </div>
            </div>
        </section>
    );
}
