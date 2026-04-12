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

/** Replace these SVGs with your own assets while keeping the same props API. */
export function FeatureIconQa(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111111"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            {...props}
        >
            <path d="M5.2 4.8h11.1l-.3 14.3H4.9z" fill="white" />
            <path d="M5.2 4.8h11.1l-.3 14.3H4.9z" />
            <path d="m8 12.4 2.1 3.7 4.4-7.2" />
            <circle cx="8.7" cy="8.8" r="0.8" fill="#111111" stroke="none" />
            <circle cx="11.9" cy="8.8" r="0.8" fill="#111111" stroke="none" />
            <path d="M13.6 6.6 16.4 2.9" />
        </svg>
    );
}

export function FeatureIconTaskRouting(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111111"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            {...props}
        >
            <path d="m6 12 3-5h8l3 5-3 5H9z" fill="white" />
            <path d="m6 12 3-5h8l3 5-3 5H9z" />
            <circle cx="10.4" cy="12" r="0.9" fill="#111111" stroke="none" />
            <circle cx="13.8" cy="12" r="0.9" fill="#111111" stroke="none" />
        </svg>
    );
}

export function FeatureIconReporting(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111111"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            {...props}
        >
            <path
                d="M4.4 8.1c2.4-1.3 4.4-1.3 7 0v10.3c-2.3-1.4-4.5-1.4-7 0z"
                fill="white"
            />
            <path
                d="M11.4 8.1c2.6-1.3 4.6-1.3 8 0v10.3c-2.8-1.4-5.2-1.4-8 0z"
                fill="white"
            />
            <path d="M4.4 8.1c2.4-1.3 4.4-1.3 7 0v10.3c-2.3-1.4-4.5-1.4-7 0z" />
            <path d="M11.4 8.1c2.6-1.3 4.6-1.3 8 0v10.3c-2.8-1.4-5.2-1.4-8 0z" />
            <path d="M11.4 8.1v10.3" />
            <circle cx="10.2" cy="9.8" r="0.8" fill="#111111" stroke="none" />
            <circle cx="14.1" cy="9.8" r="0.8" fill="#111111" stroke="none" />
        </svg>
    );
}

export function FeatureIconCreate(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111111"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            {...props}
        >
            <path d="M4.8 5.2h14.4v13.4H4.8z" fill="white" />
            <path d="M4.8 5.2h14.4v13.4H4.8z" />
            <path d="M7.3 8.9h9.4" />
            <path d="M7.3 12h7.2" />
            <path d="M7.3 15.1h6.2" />
            <circle cx="17.5" cy="16.5" r="1.1" fill="#111111" stroke="none" />
        </svg>
    );
}

function IconCircle({
    color,
    children,
    className,
}: {
    color: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-full text-black',
                className,
            )}
            style={{ backgroundColor: color }}
        >
            {children}
        </span>
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
} as const;

const PANEL_BG = '#E6F4F1';

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
        title: 'Custom hackathons setup',
        description:
            'Run hackathons your way, in-person or online! Define your themes, tracks, and judging criteria.',
        accent: ACCENT.orange,
        icon: (
            <IconCircle color={ACCENT.orange}>
                <FeatureIconQa className="size-5" />
            </IconCircle>
        ),
    },
    {
        id: 'routing',
        title: 'Reusable event templates',
        description:
            'Draft challenges and hackathons with our smart instructions and templates. No need to start from scratch each time.',
        accent: ACCENT.purple,
        icon: (
            <IconCircle color={ACCENT.purple}>
                <FeatureIconTaskRouting className="size-5" />
            </IconCircle>
        ),
    },
    {
        id: 'reporting',
        title: 'Track progress at every stage',
        description:
            'See where teams stand from kickoff through build to demo day.',
        accent: ACCENT.teal,
        icon: (
            <IconCircle color={ACCENT.teal}>
                <FeatureIconReporting className="size-5" />
            </IconCircle>
        ),
    },
    {
        id: 'custom',
        title: 'Knowledgebase for participants',
        description:
            'Self-serve answers so organizers spend less time repeating the basics.',
        accent: ACCENT.pink,
        icon: (
            <IconCircle color={ACCENT.pink}>
                <FeatureIconCreate className="size-5" />
            </IconCircle>
        ),
    },
];

export function PPFeatureShowcase({
    className,
    items = defaultItems,
    defaultOpenId = 'reporting',
    staticPreviewSrc = '/blocks/hack-without-side.png',
    staticPreviewAlt = 'Feature showcase preview',
    staticPreviewBg = '#F4A080', //green
}: {
    className?: string;
    items?: PPFeatureShowcaseItem[];
    /** Which accordion item is open initially. */
    defaultOpenId?: string;
    /** Static image shown on the right side. */
    staticPreviewSrc?: string;
    staticPreviewAlt?: string;
    /** Background colour of the image panel. */
    staticPreviewBg?: string;
}) {
    const [open, setOpen] = React.useState(defaultOpenId);

    return (
        <section
            className={cn('py-16 md:py-24 lg:py-28', className)}
            aria-labelledby="pp-feature-showcase-heading"
        >
            <div className="container max-w-6xl px-4 md:px-6">
                <div className="flex flex-col items-stretch gap-10 lg:flex-row lg:gap-14">
                    {/* Accordion: left on desktop, bottom on mobile */}
                    <div className="order-2 flex min-w-0 flex-1 flex-col justify-start space-y-8 lg:order-1 lg:justify-center">
                        <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                            <div className="space-y-4 text-left">
                                <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                    <span>Pacepard Go</span>
                                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                                        Coming soon
                                    </span>
                                </p>
                                <h2
                                    id="pp-feature-showcase-heading"
                                    className="max-w-md text-4xl font-regular tracking-tight text-foreground md:text-5xl"
                                >
                                    Run memorable and rewarding hackathons
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="inline-flex items-center gap-1.5 text-foreground transition-opacity hover:opacity-80 hover:underline"
                                aria-label="Learn more"
                            >
                                Learn more
                                <ChevronRightCircle className="size-8" />
                            </button>
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

export default PPFeatureShowcase;
