'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    Calendar1Icon,
    CalendarDaysIcon,
    ChevronRight,
    CirclePlay,
} from 'lucide-react';
import Image from 'next/image';
import { Calendar } from 'phosphor-react';

export default function PPHeroSection() {
    return (
        <>
            <main className="overflow-hidden">
                <section className="">
                    <div className="relative py-56">
                        <div className="relative z-10 mx-auto w-full max-w-6xl  ">
                            <div className="md:w-1/2">
                                <div>
                                    <h1 className="max-w-md text-balance text-5xl font-medium md:text-6xl">
                                        Everyone needs a Superpower, Get the
                                        perfect one.
                                    </h1>
                                    <p className="text-muted-foreground my-8 max-w-2xl text-balance text-xl">
                                        Pacepard is where talents learn and grow
                                        by doing, and organisations drive
                                        long-term product adoption, engagement
                                        and loyalty.
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="pr-4.5"
                                        >
                                            <Link href="#link">
                                                <span className="text-nowrap">
                                                    Get Started
                                                </span>
                                                <ArrowRight className="opacity-60" />
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
                            </div>
                        </div>

                        <div className="perspective-near mt-24 translate-x-12 md:absolute md:-right-6 md:bottom-16 md:left-1/2 md:top-40 md:mt-0 md:translate-x-0">
                            <div className="before:border-foreground/5 before:bg-foreground/5 relative h-full before:absolute before:-inset-x-4 before:bottom-7 before:top-0 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border">
                                <div className="bg-background rounded-(--radius) shadow-foreground/10 ring-foreground/5 relative h-full -translate-y-12 skew-x-6 overflow-hidden border border-transparent shadow-md ring-1">
                                    <Image
                                        src="/blocks/bg.png"
                                        alt="app screen"
                                        width="2880"
                                        height="1842"
                                        className="object-top-left size-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
