'use client';

import * as React from 'react';
import Image from 'next/image';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@pacepard/ui/lib/utils';
import { Button } from '../ui/button';
import Link from 'next/link';

import { IconCirclePng } from './icon-circle-png';
import { pickIconAt } from './pacepard-icon-paths';

function apprenticeshipFeatureIcon(
    index: number,
    accent: string,
    title: string,
) {
    return (
        <IconCirclePng
            backgroundColor={accent}
            src={pickIconAt(index)}
            alt={title}
        />
    );
}

function ChevronRightCircle(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden {...props}>
            <circle cx="20" cy="20" r="20" fill="currentColor" />
            <path
                d="M18 12 26 20 18 28"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
}

const ACCENT = {
    orange: '#F97316',
    purple: '#A855F7',
    teal: '#0D9488',
    pink: '#EC4899',
    indigo: '#6366F1',
} as const;

export type PPFeatureShowcaseItem = {
    id: string;
    title: string;
    description: string;
    accent: string;
    icon: React.ReactNode;
};

const defaultItems: PPFeatureShowcaseItem[] = [
    {
        id: 'qa',
        title: 'Join a product sprint',
        description:
            'Understand the problem, scope, and expected outcomes based on the product context.',
        accent: ACCENT.orange,
        icon: apprenticeshipFeatureIcon(
            0,
            ACCENT.orange,
            'Join a product sprint',
        ),
    },
    {
        id: 'select-task',
        title: 'Learn through quests',
        description:
            'Apply learning by solving tasks inside open source and socio-good products.',
        accent: ACCENT.purple,
        icon: apprenticeshipFeatureIcon(
            1,
            ACCENT.purple,
            'Learn through quests',
        ),
    },
    {
        id: 'complete-task',
        title: 'Collaborate in teams',
        description:
            'Work in nano and micro teams, rotate across projects to gain cross-functional capabilities.',
        accent: ACCENT.teal,
        icon: apprenticeshipFeatureIcon(
            2,
            ACCENT.teal,
            'Collaborate in teams',
        ),
    },
    {
        id: 'get-feedback',
        title: 'Get human feedback',
        description:
            'Join group sessions and 1 on 1 mentor calls to get direct feedback from mentors and other builders.',
        accent: ACCENT.pink,
        icon: apprenticeshipFeatureIcon(
            3,
            ACCENT.pink,
            'Get human feedback',
        ),
    },
    {
        id: 'Iterate, grow, and ship',
        title: 'Improve weekly',
        description:
            'Improve through repetition, complete harder quests, and deliver real outcomes in live systems.',
        accent: ACCENT.indigo,
        icon: apprenticeshipFeatureIcon(4, ACCENT.indigo, 'Improve weekly'),
    },
];

export function PPApprenticeshipIntro({
    className,
    items = defaultItems,
    defaultOpenId,
    staticPreviewSrc = '/blocks/monoq.png',
    staticPreviewAlt = 'Feature showcase preview',
    staticPreviewBg = '#38b6ff', //'#ff751f', //green
}: {
    className?: string;
    items?: PPFeatureShowcaseItem[];
    /** Which accordion item is open initially; defaults to the first item. */
    defaultOpenId?: string;
    /** Static image shown on the right side. */
    staticPreviewSrc?: string;
    staticPreviewAlt?: string;
    /** Background colour of the image panel. */
    staticPreviewBg?: string;
}) {
    const [open, setOpen] = React.useState(
        () => defaultOpenId ?? items[0]?.id ?? '',
    );

    return (
        <section
            className={cn('py-16 md:py-24 lg:py-28', className)}
            aria-labelledby="pp-feature-showcase-heading"
        >
            <div className="container max-w-6xl px-4 md:px-6">
                <div className="flex flex-col items-stretch gap-10 lg:flex-row lg:gap-14">
                    {/* Accordion: left on desktop, bottom on mobile */}
                    <div className="order-2 flex min-w-0 flex-1 flex-col justify-center space-y-8 lg:order-1">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="space-y-4">
                                <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                    <span>Pacepard CLI</span>
                                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                                        New
                                    </span>
                                </p>
                                <h2
                                    id="pp-feature-showcase-heading"
                                    className="max-w-md md:max-w-lg text-4xl font-regular tracking-tight text-foreground md:text-5xl"
                                >
                                    Introducing Pacepard Apprenticeship 1.0
                                </h2>
                            </div>

                            <Button
                                type="button"
                                className="inline-flex items-center gap-1.5 text-foreground transition-opacity hover:opacity-80 hover:underline"
                                aria-label="Learn more"
                                variant="link"
                                asChild
                            >
                                <Link href="/learn">
                                    Learn more
                                    <ChevronRightCircle className="size-8" />
                                </Link>
                            </Button>
                        </div>

                        <Accordion
                            type="single"
                            collapsible={false}
                            className="w-full"
                            value={open}
                            onValueChange={(v) => v && setOpen(v)}
                        >
                            {items.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="border-b border-neutral-200 first:border-t"
                                >
                                    <AccordionTrigger className="items-center py-5 text-left text-base font-medium text-foreground hover:no-underline">
                                        <span className="flex flex-1 items-center gap-3 text-lg">
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="max-w-md pb-5 text-lg leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    {/* Image: right on desktop, top on mobile */}
                    {/* Outer: coloured background with padding — inner card floats on top */}
                    <div
                        className="order-1 flex min-h-[360px] w-full flex-col overflow-hidden pl-5 pt-5 sm:min-h-[440px] sm:pl-8 sm:pt-8 lg:order-2 lg:w-1/2 lg:shrink-0 lg:self-stretch"
                        style={{ backgroundColor: staticPreviewBg }}
                    >
                        <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-tl-xl bg-white shadow-md sm:min-h-[380px]">
                            <Image
                                src={staticPreviewSrc}
                                alt={staticPreviewAlt}
                                fill
                                className="object-cover object-left-top"
                                sizes="(min-width: 1024px) 50vw, 100vw"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PPApprenticeshipIntro;
