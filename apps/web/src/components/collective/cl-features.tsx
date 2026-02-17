'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
    Home,
    FileText,
    MessageCircle,
    Map,
    Bug,
    Box,
    Wrench,
    Megaphone,
    Palette,
    Globe,
} from 'lucide-react';
import { cn } from '@pacepard/ui/lib/utils';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@pacepard/ui/components/tabs';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

/** Put screenshot at public/blocks/cl-features.png to use the image in the UI. */
const FEATURES_IMAGE = '/blocks/cl-features.png';

const topTabs = [
    {
        id: 'knowledge-base',
        label: 'Knowledge base',
        description:
            'One searchable home for your specs, OKRs, and legacy docs',
        icon: FileText,
        iconColor: 'text-[#4285F4]',
    },
    {
        id: 'customer-feedback',
        label: 'Customer Feedback',
        description: 'Turn user feedback into actionable insights',
        icon: MessageCircle,
        iconColor: 'text-[#FBBF24]',
    },
    {
        id: 'roadmap-planning',
        label: 'Roadmap planning',
        description:
            'Build effective roadmaps your whole team can shape, and ship',
        icon: Map,
        iconColor: 'text-[#EA4335]',
    },
    {
        id: 'project-tracking',
        label: 'Project and issue tracking',
        description:
            'Track every sprint, bug, launch across all your tools & teams',
        icon: Bug,
        iconColor: 'text-[#673AB7]',
    },
] as const;

const teamspaces = [
    { id: 'company-os', label: 'Company OS', icon: Home },
    { id: 'product', label: 'Product', icon: Box },
    { id: 'engineering', label: 'Engineering', icon: Wrench },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'it', label: 'IT', icon: Globe },
] as const;

const policiesItems = [
    { label: 'Expense Policy', icon: '📜' },
    { label: 'Vacation & PTO', icon: '📅' },
    { label: 'Employee Handbook', icon: '📖' },
] as const;

const companyItems = [
    { label: 'Annual Strategy', icon: '📊' },
    { label: "What's New?", icon: '✨' },
    { label: 'Meetings', icon: '📅' },
    { label: 'Docs', icon: '📄' },
    { label: 'Teams & Org Chart', icon: '👥' },
] as const;

export default function ClFeatures() {
    const [activeTeamspace, setActiveTeamspace] = useState('company-os');
    const [contentTab, setContentTab] = useState<'policies' | 'company'>(
        'policies',
    );
    const [imageError, setImageError] = useState(false);

    return (
        <section className="w-full py-16 md:py-24 bg-background">
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
                <div className="flex flex-row flex-wrap items-center justify-between gap-8 lg:gap-16">
                    <div className="min-w-0 flex-1 space-y-4 pb-10">
                        <h2 className="max-w-xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                            Let Pacepard Go handle the busywork.
                        </h2>
                        <p className="max-w-lg text-lg text-muted-foreground">
                            Pick a use case to see how Pacepard does the work
                            for you.
                        </p>
                    </div>
                    <div className="relative flex shrink-0 items-center justify-center min-w-[280px] sm:min-w-[360px] lg:min-w-[440px]">
                        <Image
                            src="/blocks/damola-dark.svg"
                            alt="Illustration of use cases and workflows"
                            width={520}
                            height={130}
                            className="h-auto w-[280px] sm:w-[360px] lg:w-[540px]"
                            priority={false}
                        />
                    </div>
                </div>
                {/* Primary horizontal tabs: feature cards with icon, title, description */}
                <Tabs defaultValue="knowledge-base" className="w-full">
                    <TabsList className="mb-8 grid h-auto w-full grid-cols-1 gap-4 bg-transparent p-0 sm:grid-cols-2 lg:grid-cols-4">
                        {topTabs.map(
                            ({
                                id,
                                label,
                                description,
                                icon: Icon,
                                iconColor,
                            }) => (
                                <TabsTrigger
                                    key={id}
                                    value={id}
                                    className={cn(
                                        'h-auto flex-col items-start gap-3 rounded-md border-0 bg-[#F9F9F9] px-5 py-5 text-left shadow-sm',
                                        'data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-border',
                                        'flex min-w-0 transition-all whitespace-normal',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'flex size-11 shrink-0 items-center justify-center rounded-md bg-white shadow-sm',
                                            iconColor,
                                        )}
                                    >
                                        <Icon className="size-5" aria-hidden />
                                    </span>
                                    <div className="min-w-0 flex-1 space-y-1.5 overflow-hidden">
                                        <span className="block font-semibold text-foreground">
                                            {label}
                                        </span>
                                        <span className="block text-sm leading-snug text-muted-foreground whitespace-normal break-words">
                                            {description}
                                        </span>
                                    </div>
                                </TabsTrigger>
                            ),
                        )}
                    </TabsList>

                    <TabsContent value="knowledge-base" className="-mt-5">
                        <Card className="overflow-hidden rounded-md border border-border shadow-lg">
                            <CardContent className="flex p-0 max-lg:flex-col">
                                {/* Left: Sidebar (vertical tabs for Teamspaces) */}
                                <aside className="w-56 shrink-0 border-r border-border bg-muted/30 p-4 lg:w-64">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Teamspaces
                                            </h3>
                                            <nav className="space-y-0.5">
                                                {teamspaces.map(
                                                    ({
                                                        id,
                                                        label,
                                                        icon: Icon,
                                                    }) => (
                                                        <button
                                                            key={id}
                                                            type="button"
                                                            onClick={() =>
                                                                setActiveTeamspace(
                                                                    id,
                                                                )
                                                            }
                                                            className={cn(
                                                                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                                                                activeTeamspace ===
                                                                    id
                                                                    ? 'bg-muted text-foreground'
                                                                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                                                            )}
                                                        >
                                                            <Icon
                                                                className="size-4 shrink-0"
                                                                aria-hidden
                                                            />
                                                            {label}
                                                        </button>
                                                    ),
                                                )}
                                            </nav>
                                        </div>
                                    </div>
                                </aside>

                                {/* Main content area: image or mock layout */}
                                <div className="flex flex-1">
                                    <div className="relative flex-1 p-6">
                                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted/50">
                                            {!imageError ? (
                                                <Image
                                                    src={FEATURES_IMAGE}
                                                    alt="Notion-like workspace with sidebar, main content, and AI assistant"
                                                    fill
                                                    className="object-contain object-top"
                                                    sizes="(max-width: 768px) 100vw, 60vw"
                                                    onError={() =>
                                                        setImageError(true)
                                                    }
                                                />
                                            ) : (
                                                <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
                                                    <p className="text-sm text-muted-foreground">
                                                        Add screenshot at{' '}
                                                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                                                            public/blocks/cl-features.png
                                                        </code>
                                                    </p>
                                                    <div className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-dashed border-border p-6">
                                                        <h4 className="font-semibold text-foreground">
                                                            Acme Inc.
                                                        </h4>
                                                        <Tabs
                                                            value={contentTab}
                                                            onValueChange={(
                                                                v,
                                                            ) =>
                                                                setContentTab(
                                                                    v as
                                                                        | 'policies'
                                                                        | 'company',
                                                                )
                                                            }
                                                            className="w-full"
                                                        >
                                                            <TabsList className="w-full">
                                                                <TabsTrigger
                                                                    value="policies"
                                                                    className="flex-1"
                                                                >
                                                                    Policies
                                                                </TabsTrigger>
                                                                <TabsTrigger
                                                                    value="company"
                                                                    className="flex-1"
                                                                >
                                                                    Company
                                                                </TabsTrigger>
                                                            </TabsList>
                                                            <TabsContent
                                                                value="policies"
                                                                className="mt-4 space-y-2"
                                                            >
                                                                {policiesItems.map(
                                                                    ({
                                                                        label,
                                                                        icon,
                                                                    }) => (
                                                                        <div
                                                                            key={
                                                                                label
                                                                            }
                                                                            className="flex items-center gap-2 text-sm text-muted-foreground"
                                                                        >
                                                                            <span>
                                                                                {
                                                                                    icon
                                                                                }
                                                                            </span>
                                                                            {
                                                                                label
                                                                            }
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </TabsContent>
                                                            <TabsContent
                                                                value="company"
                                                                className="mt-4 space-y-2"
                                                            >
                                                                {companyItems.map(
                                                                    ({
                                                                        label,
                                                                        icon,
                                                                    }) => (
                                                                        <div
                                                                            key={
                                                                                label
                                                                            }
                                                                            className="flex items-center gap-2 text-sm text-muted-foreground"
                                                                        >
                                                                            <span>
                                                                                {
                                                                                    icon
                                                                                }
                                                                            </span>
                                                                            {
                                                                                label
                                                                            }
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </TabsContent>
                                                        </Tabs>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: AI Assistant widget */}
                                    <div className="hidden w-72 shrink-0 border-l border-border p-4 lg:block">
                                        <div className="rounded-xl border border-border bg-muted/30 p-4 shadow-sm">
                                            <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                                                <span className="flex size-6 items-center justify-center rounded bg-primary/20 text-primary text-xs">
                                                    ✨
                                                </span>
                                                Career goals at Acme
                                            </h4>
                                            <p className="mb-3 text-xs text-muted-foreground">
                                                Today 10:44 AM
                                            </p>
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                Where can I learn more about
                                                career goals at Acme Labs?
                                            </p>
                                            <p className="mb-4 text-sm text-foreground">
                                                You can learn more about career
                                                goals at Acme labs by visiting
                                                the Career Progression page.
                                            </p>
                                            <p className="mb-2 text-xs font-medium text-muted-foreground">
                                                15 results
                                            </p>
                                            <ul className="space-y-1 text-sm text-primary">
                                                <li>Levels at Acme</li>
                                                <li>Teams & Org Chart</li>
                                                <li>
                                                    Performance Reviews 2025
                                                </li>
                                                <li>More ↓</li>
                                            </ul>
                                            <div className="mt-4 flex gap-2">
                                                <button
                                                    type="button"
                                                    className="rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-muted"
                                                >
                                                    Copy
                                                </button>
                                                <button
                                                    type="button"
                                                    className="rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-muted"
                                                >
                                                    Try again
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="customer-feedback" className="-mt-5">
                        <Card className="rounded-md border border-border p-8 text-center">
                            <MessageCircle
                                className="mx-auto mb-4 size-12 text-[#FBBF24]"
                                aria-hidden
                            />
                            <h3 className="text-xl font-semibold text-foreground">
                                Customer Feedback
                            </h3>
                            <p className="mt-2 text-muted-foreground">
                                Turn user feedback into actionable insights.
                            </p>
                        </Card>
                    </TabsContent>

                    <TabsContent value="roadmap-planning" className="-mt-5">
                        <Card className="rounded-md border border-border p-8 text-center">
                            <Map
                                className="mx-auto mb-4 size-12 text-[#EA4335]"
                                aria-hidden
                            />
                            <h3 className="text-xl font-semibold text-foreground">
                                Roadmap planning
                            </h3>
                            <p className="mt-2 text-muted-foreground">
                                Build effective roadmaps your whole team can
                                see, shape, and ship.
                            </p>
                        </Card>
                    </TabsContent>

                    <TabsContent value="project-tracking" className="-mt-5">
                        <Card className="rounded-md border border-border p-8 text-center">
                            <Bug
                                className="mx-auto mb-4 size-12 text-[#673AB7]"
                                aria-hidden
                            />
                            <h3 className="text-xl font-semibold text-foreground">
                                Project and issue tracking
                            </h3>
                            <p className="mt-2 text-muted-foreground">
                                Track every sprint, bug, launch across all your
                                tools & teams.
                            </p>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
}
