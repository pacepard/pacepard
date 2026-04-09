'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightToLineIcon, Calendar, Mail } from 'lucide-react';
import { cn } from '@pacepard/ui/lib/utils';
import { Button } from '@/components/ui/button';

const DEFAULT_IMAGE = '/blocks/pp.png';
const CALENDLY = 'https://calendly.com/pacepard';

interface Countdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export type ComingSoonAction = {
    label: string;
    href: string;
    /** Use for `mailto:` or off-site links */
    external?: boolean;
};

export type ComingSoonPanelProps = {
    title: string;
    description: string;
    badgeLabel?: string;
    /** When true, shows a 30-day countdown strip (client-only). */
    showCountdown?: boolean;
    imageSrc?: string;
    imageAlt?: string;
    imageWidth?: number;
    imageHeight?: number;
    primaryAction?: ComingSoonAction;
    secondaryAction?: ComingSoonAction | null;
    className?: string;
};

function ComingSoonCountdown() {
    const [countdown, setCountdown] = useState<Countdown>({ days: 30, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
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
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {(
                [
                    { label: 'Days', value: countdown.days },
                    { label: 'Hours', value: countdown.hours },
                    { label: 'Minutes', value: countdown.minutes },
                    { label: 'Seconds', value: countdown.seconds },
                ] as const
            ).map((item) => (
                <div
                    key={item.label}
                    className="flex min-w-[64px] flex-col items-center rounded-lg border border-border bg-muted/30 px-3 py-3 sm:min-w-[70px] sm:px-4"
                >
                    <span className="text-xl font-bold tabular-nums text-foreground sm:text-2xl">
                        {item.value.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

export function ComingSoonPanel({
    title,
    description,
    badgeLabel = 'Coming soon',
    showCountdown = false,
    imageSrc = DEFAULT_IMAGE,
    imageAlt = 'Pacepard',
    imageWidth = 560,
    imageHeight = 420,
    primaryAction = { label: 'Back to home', href: '/' },
    secondaryAction = { label: 'Request a demo', href: CALENDLY, external: true },
    className,
}: ComingSoonPanelProps) {
    return (
        <section className={cn('w-full bg-background', className)}>
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
                <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                    <div className="min-w-0 flex-1 space-y-6 text-left">
                        <div className="inline-flex items-center rounded-md border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground">
                            {badgeLabel}
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">{title}</h1>
                        <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">{description}</p>
                        {showCountdown ? <ComingSoonCountdown /> : null}
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
                                    href={primaryAction.href}
                                    className="inline-flex items-center gap-2"
                                    {...(primaryAction.external
                                        ? { target: '_blank', rel: 'noopener noreferrer' }
                                        : {})}
                                >
                                    {primaryAction.label}
                                    <ArrowRightToLineIcon className="size-4" strokeWidth={2.5} aria-hidden />
                                </Link>
                            </Button>
                            {secondaryAction ? (
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
                                        href={secondaryAction.href}
                                        className="inline-flex items-center gap-2"
                                        {...(secondaryAction.external
                                            ? { target: '_blank', rel: 'noopener noreferrer' }
                                            : {})}
                                    >
                                        {secondaryAction.href.startsWith('mailto:') ? (
                                            <Mail className="size-4" strokeWidth={2.5} aria-hidden />
                                        ) : secondaryAction.href.includes('calendly') ? (
                                            <Calendar className="size-4" strokeWidth={2.5} aria-hidden />
                                        ) : null}
                                        {secondaryAction.label}
                                    </Link>
                                </Button>
                            ) : null}
                        </div>
                    </div>

                    <div className="relative flex w-full max-w-lg shrink-0 items-center justify-center lg:max-w-xl">
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            width={imageWidth}
                            height={imageHeight}
                            className="h-auto w-full object-contain"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ComingSoonPanel;
