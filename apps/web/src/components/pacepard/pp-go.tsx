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

const useCases = [
    {
        href: '#',
        icon: HelpCircle,
        label: 'Simple, customisable setup',
        description:
            'Tailor flows to your team without wrestling with complex configuration.',
        iconWrapClass:
            'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200',
    },
    {
        href: '#',
        icon: List,
        label: 'Reusable event templates',
        description:
            'Clone proven structures and ship consistent events faster every time.',
        iconWrapClass:
            'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-200',
    },
    {
        href: '#',
        icon: FolderOpen,
        label: 'Track progress at every stage',
        description:
            'See where teams stand from kickoff through build to demo day.',
        iconWrapClass:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200',
    },
    {
        href: '#',
        icon: User,
        label: 'Knowledgebase for participants',
        description:
            'Self-serve answers so organizers spend less time repeating the basics.',
        iconWrapClass:
            'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-200',
    },
    {
        href: '#',
        icon: Globe,
        label: 'Organise online, in-person, or hybrid',
        description:
            'One workspace for any format—remote, on-site, or mixed events.',
        iconWrapClass:
            'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200',
    },
    {
        href: '#',
        icon: Map,
        label: 'Friendly feedback channels',
        description:
            'Collect structured input before, during, and after the hackathon.',
        iconWrapClass:
            'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-200',
    },
    {
        href: '#',
        icon: UtensilsCrossed,
        label: 'Drive engagement and adoption',
        description:
            'Nudges and visibility that keep participants showing up and shipping.',
        iconWrapClass:
            'bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-200',
    },
    {
        href: '#',
        icon: Target,
        label: 'Build lasting loyalty',
        description:
            'Turn one-off hackathons into relationships and communities that last.',
        iconWrapClass:
            'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200',
    },
] as const;

export default function PPGo() {
    return (
        <section className="w-full py-16 md:py-24">
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
                {/* Top section: stack on mobile, row from lg */}
                <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:justify-start lg:gap-8 xl:gap-10">
                    <div className="order-2 min-w-0 w-full max-w-xl shrink space-y-4 lg:order-1 lg:max-w-2xl">
                        <h2 className="max-w-xl text-balance text-4xl font-regular tracking-tight text-foreground md:text-5xl">
                            Run memorable and rewarding hackathons
                        </h2>
                        <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                            Design events that drive real engagement, adoption,
                            and lasting loyalty. Built for small teams and large
                            organizations.
                        </p>
                        <Link
                            href="/go"
                            className="inline-flex w-fit items-center gap-1.5 font-medium text-blue-600 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Explore Pacepard Go
                            <ArrowRight className="size-4" aria-hidden />
                        </Link>
                    </div>
                    <div className="relative order-1 flex w-full max-w-md shrink-0 items-start justify-start sm:max-w-lg lg:order-2 lg:max-w-[440px] lg:items-center">
                        <Image
                            src="/blocks/damola-dark.svg"
                            alt="Illustration of use cases and workflows"
                            width={520}
                            height={130}
                            className="h-auto w-full max-w-full object-contain object-left"
                            priority={false}
                        />
                    </div>
                </div>

                {/* Use case cards grid: 2 rows × 4 columns */}
                <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
                    {useCases.map(
                        ({ icon: Icon, label, description, iconWrapClass }) => (
                            <div
                                key={label}
                                className={cn(
                                    'group flex flex-col rounded-lg border border-border bg-card p-5 text-left shadow-sm transition-colors',
                                    'hover:border-primary/30 hover:bg-muted/50',
                                )}
                            >
                                <span
                                    className={cn(
                                        'mb-3 inline-flex size-9 items-center justify-center rounded-md transition-colors',
                                        iconWrapClass,
                                        'group-hover:bg-primary/15 group-hover:text-primary dark:group-hover:bg-primary/20',
                                    )}
                                >
                                    <Icon className="size-5" aria-hidden />
                                </span>
                                <span className="font-medium text-lg text-foreground">
                                    {label}
                                </span>
                                <p className="mt-2 text-lg leading-relaxed text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </section>
    );
}
