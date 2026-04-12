import * as React from 'react';
import Link from 'next/link';
import { cn } from '@pacepard/ui/lib/utils';

export type AgentUseCase = {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
    highlight?: boolean;
};

function IconTriageBlue() {
    return (
        <span className="flex size-10 items-center justify-center rounded-full bg-blue-500">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
                aria-hidden
            >
                <path d="M5.2 4.8h11.1l-.3 14.3H4.9z" fill="white" />
                <path d="M5.2 4.8h11.1l-.3 14.3H4.9z" />
                <path d="m8 12.4 2.1 3.7 4.4-7.2" />
                <circle cx="8.7" cy="8.8" r="0.8" fill="#111" stroke="none" />
                <circle cx="11.9" cy="8.8" r="0.8" fill="#111" stroke="none" />
            </svg>
        </span>
    );
}

function IconSupportOrange() {
    return (
        <span className="flex size-10 items-center justify-center rounded-full bg-orange-500">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
                aria-hidden
            >
                <path d="m6 12 3-5h8l3 5-3 5H9z" fill="white" />
                <path d="m6 12 3-5h8l3 5-3 5H9z" />
                <circle cx="10.4" cy="12" r="0.9" fill="#111" stroke="none" />
                <circle cx="13.8" cy="12" r="0.9" fill="#111" stroke="none" />
            </svg>
        </span>
    );
}

function IconSecurityRed() {
    return (
        <span className="flex size-10 items-center justify-center rounded-full bg-red-500">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
                aria-hidden
            >
                <path d="M4.8 5.2h14.4v13.4H4.8z" fill="white" />
                <path d="M4.8 5.2h14.4v13.4H4.8z" />
                <path d="M7.3 8.9h9.4" />
                <path d="M7.3 12h7.2" />
                <path d="M7.3 15.1h6.2" />
                <circle cx="17.5" cy="16.5" r="1.1" fill="#111" stroke="none" />
            </svg>
        </span>
    );
}

function IconReportingGreen() {
    return (
        <span className="flex size-10 items-center justify-center rounded-full bg-green-500">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
                aria-hidden
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
                <circle cx="10.2" cy="9.8" r="0.8" fill="#111" stroke="none" />
                <circle cx="14.1" cy="9.8" r="0.8" fill="#111" stroke="none" />
            </svg>
        </span>
    );
}

function IconCustomDark() {
    return (
        <span className="flex items-center">
            <span className="flex size-9 items-center justify-center rounded-full bg-blue-500 ring-2 ring-white z-30">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#111"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                    aria-hidden
                >
                    <path d="M5.2 4.8h11.1l-.3 14.3H4.9z" fill="white" />
                    <path d="M5.2 4.8h11.1l-.3 14.3H4.9z" />
                    <path d="m8 12.4 2.1 3.7 4.4-7.2" />
                </svg>
            </span>
            <span className="flex size-9 -ml-1 items-center justify-center rounded-full bg-orange-500 ring-2 ring-white z-20">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#111"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                    aria-hidden
                >
                    <path d="m6 12 3-5h8l3 5-3 5H9z" fill="white" />
                    <path d="m6 12 3-5h8l3 5-3 5H9z" />
                    <circle
                        cx="10.4"
                        cy="12"
                        r="0.9"
                        fill="#111"
                        stroke="none"
                    />
                    <circle
                        cx="13.8"
                        cy="12"
                        r="0.9"
                        fill="#111"
                        stroke="none"
                    />
                </svg>
            </span>
            <span className="flex size-9 -ml-1 items-center justify-center rounded-full bg-green-500 ring-2 ring-w z-10">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#111"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                    aria-hidden
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
                </svg>
            </span>
        </span>
    );
}

const defaultUseCases: AgentUseCase[] = [
    {
        id: 'triage',
        label: 'Triage product feedback',
        href: '#',
        icon: <IconTriageBlue />,
    },
    {
        id: 'support',
        label: 'Resolve support tickets in Slack',
        href: '#',
        icon: <IconSupportOrange />,
    },
    {
        id: 'security',
        label: 'Respond to security alerts faster',
        href: '#',
        icon: <IconSecurityRed />,
    },
    {
        id: 'reporting',
        label: 'Automate weekly reporting',
        href: '#',
        icon: <IconReportingGreen />,
    },
    {
        id: 'custom',
        label: 'Create your own Custom Agent',
        href: '#',
        icon: <IconCustomDark />,
        highlight: true,
    },
];

export function PPAgentUsecases({
    className,
    label = '  See what you can do as an AI-native talent',
    useCases = defaultUseCases,
}: {
    className?: string;
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
                {label && (
                    <p className="mb-4 text-lg text-muted-foreground">
                        {label}
                    </p>
                )}
                <div className="flex flex-wrap gap-3">
                    {useCases.map((item) => (
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
                                <span className="inline-block transition-transform group-hover:translate-x-0.5">
                                    →
                                </span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PPAgentUsecases;
