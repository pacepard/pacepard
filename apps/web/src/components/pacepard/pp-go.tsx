'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowRight,
    HelpCircle,
    List,
    FolderOpen,
    User,
    Globe,
    Map,
    UtensilsCrossed,
    Target,
} from 'lucide-react';
import { cn } from '@pacepard/ui/lib/utils';
import { Button } from '../ui/button';

const useCases = [
    {
        href: '#',
        icon: HelpCircle,
        label: 'Go from brainstorm to roadmap',
    },
    {
        href: '#',
        icon: List,
        label: 'Turn meetings into social posts',
    },
    {
        href: '#',
        icon: FolderOpen,
        label: 'Organize your workspace',
    },
    {
        href: '#',
        icon: User,
        label: 'Onboard a new hire',
    },
    {
        href: '#',
        icon: Globe,
        label: 'Revise a landing page',
    },
    {
        href: '#',
        icon: Map,
        label: 'Plan an offsite',
    },
    {
        href: '#',
        icon: UtensilsCrossed,
        label: 'Track favorite restaurants',
    },
    {
        href: '#',
        icon: Target,
        label: 'Transform notes into tasks',
    },
] as const;

export default function PPGo() {
    return (
        <section className="w-full py-16 md:py-24">
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
                {/* Top section: text and image on same line */}
                <div className="flex flex-row flex-wrap items-center justify-between gap-8 lg:gap-16">
                    <div className="min-w-0 flex-1 space-y-4">
                        <h2 className="max-w-xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                            Let Pacepard Go handle the busywork.
                        </h2>
                        <p className="max-w-lg text-lg text-muted-foreground">
                            Pick a use case to see how Pacepard does the work
                            for you.
                        </p>
                        <Link
                            href="#"
                            className="inline-flex w-fit items-center gap-1.5 text-blue-600 font-medium transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Explore more
                            <ArrowRight className="size-4" aria-hidden />
                        </Link>

                    
                    </div>
                    <div className="relative flex shrink-0 items-center justify-center min-w-[280px] sm:min-w-[360px] lg:min-w-[440px]">
                        <Image
                            src="/blocks/damola-dark.svg"
                            alt="Illustration of use cases and workflows"
                            width={520}
                            height={130}
                            className="h-auto w-[280px] sm:w-[360px] lg:w-[540px]"
                            priority={false}
                        />
                    </div>
                </div>

                {/* Use case cards grid: 2 rows × 4 columns */}
                <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
                    {useCases.map(({ href, icon: Icon, label }) => (
                        <Link
                            key={label}
                            href={href}
                            className={cn(
                                'group flex flex-col rounded-lg border border-border bg-card p-5 text-left shadow-sm transition-colors',
                                'hover:border-primary/30 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                            )}
                        >
                            <span className="mb-3 inline-flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                                <Icon className="size-5" aria-hidden />
                            </span>
                            <span className="flex items-center gap-1.5 font-medium text-foreground">
                                {label}
                                <ArrowRight
                                    className="size-4 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5"
                                    aria-hidden
                                />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
