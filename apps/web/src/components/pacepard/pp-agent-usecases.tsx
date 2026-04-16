import * as React from 'react';
import Link from 'next/link';
import { cn } from '@pacepard/ui/lib/utils';

import { IconCirclePng } from './icon-circle-png';
import { ICON_SRC } from './pacepard-icon-paths';

export type AgentUseCase = {
    id: string;
    label: string;
    href: string;
    icon?: React.ReactNode;
    highlight?: boolean;
};

const defaultUseCases: AgentUseCase[] = [
    {
        id: 'triage',
        label: 'Break down product problems into execution steps.',
        href: '#',
        icon: (
            <IconCirclePng
                bgClassName="bg-blue-500"
                src={ICON_SRC.decision}
                alt="Break down product problems into execution steps."
                imageSize={24}
            />
        ),
    },
    {
        id: 'support',
        label: 'Work directly inside live systems and codebases',
        href: '#',
        icon: (
            <IconCirclePng
                bgClassName="bg-orange-500"
                src={ICON_SRC.comp}
                alt="Work directly inside live systems and codebases"
                imageSize={24}
            />
        ),
    },
    {
        id: 'security',
        label: 'Use AI to plan, debug, and accelerate decisions.',
        href: '#',
        icon: (
            <IconCirclePng
                bgClassName="bg-red-500"
                src={ICON_SRC.converse}
                alt="Use AI to plan, debug, and accelerate decisions."
                imageSize={24}
            />
        ),
    },
    {
        id: 'reporting',
        label: 'Fluency in agentic tooling, workflows, and AI systems',
        href: '#',
        icon: (
            <IconCirclePng
                bgClassName="bg-green-500"
                src={ICON_SRC.settings}
                alt="Fluency in agentic tooling, workflows, and AI systems"
                imageSize={24}
            />
        ),
    },
    {
        id: 'custom',
        label: 'Expand your Human AI collaboration today. ',
        href: '/pricing',
        icon: (
            <IconCirclePng
                bgClassName="bg-violet-600"
                src={ICON_SRC.star}
                alt="Expand your Human AI collaboration today."
                imageSize={24}
            />
        ),
        highlight: true,
    },
];

export function PPAgentUsecases({
    className,
    useCases = defaultUseCases,
}: {
    className?: string;
    /** Optional; reserved for alternate headings above the grid. */
    label?: string;
    useCases?: AgentUseCase[];
}) {
    return (
        <div className="bg-neutral-50 py-24">
            <div
                className={cn(
                    'container mx-auto w-full max-w-6xl px-4  md:px-6',
                    className,
                )}
            >
                 <div className="flex flex-wrap items-start justify-between gap-4 mb-10">
                    <div className="space-y-4">
                        {/* <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span>The Pacepard way</span>
                            <span className="rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                                Learn
                            </span>
                        </p> */}
                        <h2
                            id="pp-feature-showcase-heading"
                            className="max-w-2xl text-4xl font-regular tracking-tight text-foreground md:text-5xl"
                        >
                            AI-native and job-ready capabilities you will unlock
                        </h2>
                    </div>
                </div>

                {/* {label && (
                    <p className="mb-4 text-lg text-muted-foreground">
                        {label}
                    </p>
                )} */}
                <div className="flex flex-wrap gap-3">
                    {useCases.map((item, index) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                'group flex flex-1 basis-[180px] flex-col gap-3 rounded-2xl border p-4 transition-colors',
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
                                {index === useCases.length - 1 ? (
                                    <span className="ml-1 inline-block text-2xl leading-none transition-transform group-hover:translate-x-0.5">
                                        
                                    </span>
                                ) : null}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PPAgentUsecases;
