'use client';

import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@pacepard/ui/lib/utils';

const guarantees = [
    '30-day money-back guarantee',
    'Lifetime access',
    'Commercial use included',
] as const;

const featureCards = [
    {
        value: '10',
        type: 'number' as const,
        title: 'Next.js Templates',
        description:
            'Production-ready SaaS starters — auth, billing, and AI patterns. Free-tier friendly.',
    },
    {
        value: '39',
        type: 'number' as const,
        title: 'Full-stack Blocks',
        description:
            'Pre-wired Stripe + Supabase + AI blocks — copy, paste, customize, ship.',
    },
    {
        value: '38',
        type: 'number' as const,
        title: 'Marketing Components',
        description:
            'Conversion-ready heroes, features, and CTAs built with Shadcn + Framer Motion.',
    },
    {
        value: null,
        type: 'icon' as const,
        title: 'Community (Coming Soon)',
        description:
            'Private Discord for support, office hours, showcases, and early drops.',
    },
] as const;

const pricingIncludes = [
    'All current & future templates, blocks, and components',
    'Commercial projects included',
    'Ongoing updates — no renewal ever',
    '30-day money-back guarantee',
] as const;

export default function PPCollective() {
    return (
        <section className="w-full py-16 md:py-24">
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
                {/* Top: discount badge, title, subtitle, guarantee list */}
                <div className="mb-12 space-y-4 md:mb-16">
                    <Badge
                        variant="default"
                        className="bg-primary/15 text-primary border-primary/30 px-3 py-1 text-sm font-medium"
                    >
                        $100 off for a limited time
                    </Badge>
                    <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                        Join the Pacepard Collective.
                    </h2>
                    <p className="max-w-2xl text-lg text-muted-foreground">
                        Unlock lifetime access to all blocks, components, and
                        templates. Includes all future updates — yours forever
                        with a single payment.
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
                <div className="flex flex-nowrap items-start gap-8 md:gap-12">
                    {/* Left: stacked feature cards with vertical gap */}
                    <div className="min-w-0 flex-1 flex flex-col gap-4">
                        {featureCards.map((card) => (
                            <div
                                key={card.title}
                                className={cn(
                                    'flex items-start gap-5 rounded-xl border border-border bg-card p-5 shadow-sm',
                                    'transition-colors hover:border-primary/20 hover:bg-muted/30',
                                )}
                            >
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                    {card.type === 'number' ? (
                                        <span className="text-2xl font-bold tabular-nums">
                                            {card.value}
                                        </span>
                                    ) : (
                                        <Sparkles
                                            className="size-6 text-primary"
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
                        ))}
                    </div>

                    {/* Right: dark pricing card */}
                    <div className="w-[380px] shrink-0 flex flex-col sticky top-8 self-start">
                        <div
                            className={cn(
                                'flex flex-col rounded-2xl border border-border p-6 shadow-lg',
                                'bg-foreground text-background',
                            )}
                        >
                            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                                Lifetime License
                            </p>
                            <p className="mt-1 text-sm text-background/80">
                                One-time payment, lifetime access
                            </p>
                            <div className="mt-6 flex flex-wrap items-baseline gap-2">
                                <span className="text-4xl font-bold tracking-tight sm:text-5xl">
                                    $179
                                </span>
                                <span className="text-lg text-background/60 line-through">
                                    $279
                                </span>
                                <Badge
                                    variant="default"
                                    className="bg-primary text-primary-foreground border-0"
                                >
                                    Save $100
                                </Badge>
                            </div>
                            <Button
                                size="lg"
                                className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                asChild
                            >
                                <a href="#">Join the cult for life</a>
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
