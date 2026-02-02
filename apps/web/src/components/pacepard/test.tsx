'use client';

import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@pacepard/ui/lib/utils';

const guarantees = [
    'Get roadmaps',
    '3 month free trial',
    'Join teams & products',
] as const;

const featureCards = [
    {
        value: '68%',
        type: 'number' as const,
        title: 'Increased Skill Mastery',
        description:
            'Working on a production application increased skill mastery and problem solving by over 68% in 6 months.',
    },
    {
        value: '4',
        type: 'number' as const,
        title: 'Supported Languages',
        description:
            'JavaScript, TypeScript, Go, and Rust. We are working on additional programming languages and frameworks.',
    },
    {
        value: null,
        type: 'icon' as const,
        title: 'AI-Assisted Learning',
        description:
            'Personal challenges with skill stages and levels, mastery trees, personalized roadmaps, and AI-assisted learning.',
    },
    {
        value: null,
        type: 'icon' as const,
        title: 'Team OS Products',
        description:
            'Work side-by-side with teams on open source products: ML products, browsers, dev-tools, web frameworks, and more.',
    },
] as const;

const pricingIncludes = [
    'Everything in Free tier',
    'Intermediate tasks & AI-assisted learning',
    'Work side-by-side with teams',
    'Starter templates and packs',
    'Weekly live sessions',
    'Certifications & Badges',
] as const;

export default function PPCollective() {
    return (
        <section className="w-full py-16 md:py-24">
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
                {/* Top: discount badge, title, subtitle, guarantee list */}
                <div className="mb-12 space-y-4 md:mb-16">
                    <Badge
                        variant="default"
                        className="bg-primary/5 text-primary rounded-md border-primary/30 px-3 py-1 text-sm font-medium"
                    >
                        Join waitlist — 3 month free trial
                    </Badge>
                    <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                        Why and how Pacepard Collective
                    </h2>
                    <p className="max-w-2xl text-lg text-muted-foreground">
                        Over the past 6 months, my team and I at Pacepard have successfully ran an experiment. 
                        Working on a production application increased skill mastery and problem solving by over 68%. 
                        We are democratizing this process and we invite you to join us.
                    </p>
                    <ul className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                        {guarantees.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                                    <Check className="size-3" aria-hidden />
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Two columns: feature cards left, pricing card right — always on same line */}
                <div className="flex flex-col lg:flex-row lg:flex-nowrap items-start gap-8 md:gap-12">
                    {/* Left: stacked feature cards with vertical gap */}
                    <div className="min-w-0 flex-1 flex flex-col gap-4">
                        {featureCards.map((card, index) => {
                            const decorativeColors = [
                                'bg-[var(--color-decorative-pink)]',
                                'bg-[var(--color-decorative-blue)]',
                                'bg-[var(--color-decorative-orange)]',
                                'bg-[var(--color-decorative-green)]',
                            ];
                            const decorativeColor = decorativeColors[index % decorativeColors.length];
                            
                            return (
                            <div
                                key={card.title}
                                className={cn(
                                    'flex items-start gap-5 rounded-xl border border-border bg-card p-5 shadow-sm',
                                    'transition-colors hover:border-primary/20 hover:bg-muted/30',
                                )}
                            >
                                <div className={cn(
                                    'flex size-12 shrink-0 items-center justify-center rounded-lg text-white',
                                    decorativeColor
                                )}>
                                    {card.type === 'number' ? (
                                        <span className="text-2xl font-bold tabular-nums">
                                            {card.value}
                                        </span>
                                    ) : (
                                        <Sparkles
                                            className="size-6"
                                            aria-hidden
                                        />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <h3 className="font-semibold text-foreground">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        );
                        })}
                    </div>

                    {/* Right: dark pricing card */}
                    <div className="w-full lg:w-[380px] shrink-0 flex flex-col lg:sticky lg:top-8 self-start">
                        <div
                            className={cn(
                                'flex flex-col rounded-2xl border border-border p-6 shadow-lg',
                                'bg-foreground text-background',
                            )}
                        >
                            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                                Join Waitlist
                            </p>
                            <p className="mt-1 text-sm text-background/80">
                                Get roadmaps, 3 month free trial, and join teams & products
                            </p>
                            <div className="mt-6 flex flex-wrap items-baseline gap-2">
                                <span className="text-4xl font-bold tracking-tight sm:text-5xl">
                                    FREE
                                </span>
                                <Badge
                                    variant="default"
                                    className="bg-primary text-primary-foreground border-0"
                                >
                                    Start Now
                                </Badge>
                            </div>
                            <Button
                                size="lg"
                                className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                asChild
                            >
                                <a href="#">Book your spot</a>
                            </Button>
                            <ul className="mt-6 space-y-3 border-t border-background/20 pt-6">
                                {pricingIncludes.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-3 text-sm"
                                    >
                                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                                            <Check
                                                className="size-3"
                                                aria-hidden
                                            />
                                        </span>
                                        <span className="text-background/95">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
