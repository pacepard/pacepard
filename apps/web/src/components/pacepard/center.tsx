import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
    ArrowRight,
    ArrowRightToLineIcon,
    CalendarDaysIcon,
    ChevronRight,
    CornerDownRight,
    PlusIcon,
    PlusSquare,
    Sparkle,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { siteConfig } from '@/_data/site-config';

export default function CCHeroSection() {
    return (
        <>
            <main>
                <section className="before:bg-muted border-e-foreground relative overflow-hidden before:absolute before:inset-1 before:h-[calc(100%-8rem)] before:rounded-2xl sm:before:inset-2 md:before:rounded-[2rem] lg:before:h-[calc(100%-14rem)]">
                    <div className="py-20 md:py-36">
                        <div className="relative z-10 mx-auto max-w-5xl px-6">
                            <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
                                {/* Left: headline, description, CTAs */}
                                <div className="flex-1 min-w-0 space-y-6 text-left">
                                    <Link
                                        href="no"
                                        className="hover:bg-foreground/5 inline-flex w-fit items-center justify-center gap-2 rounded-md py-0.5 pl-1 pr-3 transition-colors duration-150"
                                    >
                                        <div
                                            aria-hidden
                                            className="border-background bg-linear-to-b dark:inset-shadow-2xs to-foreground from-primary relative flex size-5 items-center justify-center rounded border shadow-md shadow-black/20 ring-1 ring-black/10"
                                        >
                                            <div className="absolute inset-x-0 inset-y-1.5 border-y border-dotted border-white/25"></div>
                                            <div className="absolute inset-x-1.5 inset-y-0 border-x border-dotted border-white/25"></div>
                                            <Sparkle className="size-3 fill-white stroke-white drop-shadow" />
                                        </div>
                                        <span className="font-medium">
                                            Introducing Pacepard Go v00.10
                                        </span>
                                    </Link>
                                    <h1 className="mt-8 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                        Everyone needs a Superpower, Get the
                                        perfect one.
                                    </h1>
                                    <p className="text-muted-foreground my-6 max-w-2xl text-balance text-lg md:text-xl">
                                        Pacepard is where talents learn and grow
                                        by doing, and organisations drive
                                        long-term product adoption, engagement
                                        and loyalty.
                                    </p>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="pr-4.5"
                                        >
                                            <Link href="#link">
                                                <span className="text-nowrap">
                                                    Get Started
                                                </span>
                                                <ArrowRightToLineIcon className="opacity-60" />
                                            </Link>
                                        </Button>
                                        <Button
                                            key={2}
                                            asChild
                                            size="lg"
                                            variant="outline"
                                            className="pl-5"
                                        >
                                            <Link href="#link">
                                                <span className="text-nowrap">
                                                    Book a demo
                                                </span>
                                                <CalendarDaysIcon className="opacity-60" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                                {/* Right: image */}
                                <div className="relative flex shrink-0 items-center justify-center w-full max-w-lg lg:max-w-xl">
                                    <div className="bg-background rounded-(--radius) relative w-full overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
                                        <Image
                                            src="/blocks/bg-2.png"
                                            alt="app screen"
                                            width="2880"
                                            height="1842"
                                            className="h-auto w-full object-contain"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
