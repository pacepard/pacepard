import * as React from 'react';
import { cn } from '@pacepard/ui/lib/utils';

import { IconCirclePng } from './icon-circle-png';
import { ICON_SRC } from './pacepard-icon-paths';

/** Same ring colors as apprenticeship / showcase accordions. */
const ACCENT = {
    orange: '#F97316',
    purple: '#A855F7',
    teal: '#0D9488',
    pink: '#EC4899',
} as const;

function lovedByFeatureIcon(accent: string, title: string, src: string) {
    return (
        <IconCirclePng
            backgroundColor={accent}
            src={src}
            alt={title}
            imageSize={24}
        />
    );
}

export type AgentUseCase = {
    id: string;
    label: string;
    icon: React.ReactNode;
    highlight?: boolean;
};

const defaultUseCases: AgentUseCase[] = [
    {
        id: 'triage',
        label: 'Learn and ship like a real product team.',
        icon: lovedByFeatureIcon(
            ACCENT.orange,
            'Learn and ship like a real product team.',
            ICON_SRC.comp,
        ),
    },
    {
        id: 'support',
        label: 'Train inside open source and socio-good products.',
        icon: lovedByFeatureIcon(
            ACCENT.purple,
            'Train inside open source and socio-good products.',
            ICON_SRC.edu,
        ),
    },
    {
        id: 'security',
        label: 'Join office hours to get direct and immediate feedback.',
        icon: lovedByFeatureIcon(
            ACCENT.teal,
            'Join office hours to get direct and immediate feedback.',
            ICON_SRC.feedback,
        ),
    },
    {
        id: 'reporting',
        label: 'Build deep technical and non-technical skills. ',
        icon: lovedByFeatureIcon(
            ACCENT.pink,
            'Build deep technical and non-technical skills.',
            ICON_SRC.star,
        ),
    },
];

export function PPLovedBy({
    className,
    useCases = defaultUseCases,
}: {
    className?: string;
    /** Optional; reserved if a subtitle above the grid is re-enabled. */
    label?: string;
    useCases?: AgentUseCase[];
}) {
    return (
        <div className="bg-neutral-100 py-24">
            <div
                className={cn(
                    'container mx-auto w-full max-w-6xl px-4  md:px-6',
                    className,
                )}
            >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
                    <div className="space-y-4">
                        <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span>The Pacepard way</span>
                            <span className="rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                                Learn
                            </span>
                        </p>
                        <h2
                            id="pp-feature-showcase-heading"
                            className="max-w-2xl text-4xl font-regular tracking-tight text-foreground md:text-5xl"
                        >
                            Hands-on through apprenticeship-based training 
                        </h2>
                    </div>
                </div>

                {/* {label && (
                    <p className="mb-4 text-lg text-muted-foreground">
                        {label}
                    </p>
                )} */}
                <div className="flex flex-wrap gap-3">
                    {useCases.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                'group flex flex-1 basis-[180px] flex-col gap-3 rounded-xl border p-4 transition-colors',
                                item.highlight
                                    ? 'border-transparent bg-[#1e2433] text-white hover:bg-[#252d40]'
                                    : 'border-border bg-card text-foreground hover:bg-muted',
                            )}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            <span
                                className={cn(
                                    'text-lg font-regular leading-snug ',
                                    item.highlight
                                        ? 'text-white'
                                        : 'text-muted-foreground',
                                )}
                            >
                                {item.label}{' '}
                                {/* <span className="inline-block transition-transform group-hover:translate-x-0.5">
                                    →
                                </span> */}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PPLovedBy;
