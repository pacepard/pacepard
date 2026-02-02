'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightToLineIcon, Calendar } from 'lucide-react';
import { cn } from '@pacepard/ui/lib/utils';
import { Button } from '@/components/ui/button';

const HERO_IMAGE = '/blocks/pp.png';

interface Countdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function ComingSoon() {
    const [imageError, setImageError] = useState(false);
    const [countdown, setCountdown] = useState<Countdown>({ days: 30, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Set target date to 30 days from now
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30);

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance > 0) {
                setCountdown({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            } else {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="w-full bg-background mb-6">
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
                <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                    {/* Left: headline, description, CTAs */}
                    <div className="flex-1 min-w-0 space-y-6 text-left">
                        <div className="inline-flex items-center rounded-md border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground">
                            Coming soon
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground text-3xl md:text-5xl">
                            One workspace, one goal. Get consistent desired results.
                        </h1>
                        <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                            Pacepard is where talents learn and grow by doing, 
                            and organisations drive long-term product adoption,
                            engagement and loyalty.
                        </p>
                        {/* Countdown Timer */}
                        <div className="flex items-center gap-4">
                            {[
                                { label: 'Days', value: countdown.days },
                                { label: 'Hours', value: countdown.hours },
                                { label: 'Minutes', value: countdown.minutes },
                                { label: 'Seconds', value: countdown.seconds },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex flex-col items-center rounded-lg border border-border bg-muted/30 px-4 py-3 min-w-[70px]"
                                >
                                    <span className="text-2xl font-bold tabular-nums text-foreground">
                                        {item.value.toString().padStart(2, '0')}
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
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
                                    Notify me
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
                                    href="https://calendly.com/pacepard"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2"
                                >
                                    <Calendar
                                        className="size-4"
                                        strokeWidth={2.5}
                                        aria-hidden
                                    />
                                    Request a demo
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right: illustration — screenshot or SVG from /blocks */}
                    <div className="relative flex shrink-0 items-center justify-center w-full max-w-lg lg:max-w-xl">
                        <Image
                            src={HERO_IMAGE}
                            alt="Pacepard"
                            width={560}
                            height={420}
                            className="h-auto w-full object-contain"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                            onError={() => setImageError(true)}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
