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
    Check,
    CalendarDaysIcon,
    ArrowRightToLineIcon,
} from 'lucide-react';
import { cn } from '@pacepard/ui/lib/utils';
import { Button } from '../ui/button';

const guarantees = [
    '1B AI-native talents',
    'Pay as you go',
    'Join teams & products',
] as const;

const useCases = [
    {
        href: '#',
        icon: HelpCircle,
        label: 'Simple, customisable setup',
        iconWrapClass:
            'bg-amber-100 text-amber-800',
    },
    {
        href: '#',
        icon: List,
        label: 'Reusable event templates',
        iconWrapClass:
            'bg-sky-100 text-sky-800',
    },
    {
        href: '#',
        icon: FolderOpen,
        label: 'Track progress at every stage',
        iconWrapClass:
            'bg-emerald-100 text-emerald-800',
    },
    {
        href: '#',
        icon: User,
        label: 'Knowledgebase for participants',
        iconWrapClass:
            'bg-violet-100 text-violet-800',
    },
    {
        href: '#',
        icon: Globe,
        label: 'Organise online, in-person, or hybrid',
        iconWrapClass:
            'bg-cyan-100 text-cyan-800',
    },
    {
        href: '#',
        icon: Map,
        label: 'Friendly feedback channels',
        iconWrapClass:
            'bg-orange-100 text-orange-800',
    },
    {
        href: '#',
        icon: UtensilsCrossed,
        label: 'Drive engagement and adoption',
        iconWrapClass:
            'bg-teal-100 text-teal-800',
    },
    {
        href: '#',
        icon: Target,
        label: 'Build lasting loyalty',
        iconWrapClass:
            'bg-rose-100 text-rose-800',
    },
] as const;

export default function PPCollective() {
    return (
        <section className="w-full py-16 md:py-24 ">
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
                {/* Top section: text and image on same line */}
                <div className="space-y-4">
                    <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>Custom Agents</span>
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                            New
                        </span>
                    </p>
                </div>
                <div className="flex flex-col items-stretch justify-start gap-6 lg:flex-row lg:flex-wrap lg:items-center lg:gap-8 xl:gap-10">
                    <div className="order-2 min-w-0 max-w-xl shrink space-y-4 lg:order-1 lg:max-w-2xl">
                        <h2 className="max-w-xl text-balance font-regular tracking-tight text-foreground text-4xl md:text-5xl">
                            Introducing Pacepard Apprenticeship 1.0
                        </h2>
                        <p className="max-w-lg text-lg text-muted-foreground">
                            We invite you to join us as raise 1B AI-native
                            talents. We invite you to join us as raise 1B
                            AI-native talents AI-native talents.
                        </p>

                        <ul className="flex flex-wrap items-center gap-6 text-lg text-muted-foreground">
                            {guarantees.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-2"
                                >
                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                                        <Check className="size-3" aria-hidden />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-wrap items-left justify-start gap-4 mt-6">
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
                                    href="/apprenticeship"
                                    className="inline-flex items-center gap-2"
                                >
                                    Choose program
                                    <ArrowRightToLineIcon
                                        className="size-4"
                                        strokeWidth={2.5}
                                        aria-hidden
                                    />
                                </Link>
                            </Button>
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
                                    href="https://calendly.com/pacepard"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2"
                                >
                                    Request demo
                                    <ArrowRightToLineIcon
                                        className="size-4"
                                        strokeWidth={2.5}
                                        aria-hidden
                                    />
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="relative order-1 mx-auto flex w-full max-w-[280px] shrink-0 items-left justify-left sm:max-w-[360px] lg:order-2 lg:mx-0 lg:max-w-[400px]">
                        <Image
                            src="/blocks/collective.png"
                            alt="Illustration of use cases and workflows"
                            width={520}
                            height={130}
                            className="h-auto w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[540px]"
                            priority={false}
                        />
                    </div>
                </div>

                {/* Use case cards grid: 2 rows × 4 columns */}
                <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-[-20px] lg:grid-cols-4">
                    {useCases.map(({ icon: Icon, label, iconWrapClass }) => (
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
                                    'group-hover:bg-primary/15 group-hover:text-primary',
                                )}
                            >
                                <Icon className="size-5" aria-hidden />
                            </span>
                            <span className="font-medium text-lg text-foreground">
                                {label}
                            </span>
                            {/* <p className="mt-2 text-lg leading-relaxed text-muted-foreground">
                                    {label}
                                </p> */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// 'use client';

// import React from 'react';
// import { Check, Sparkles } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { cn } from '@pacepard/ui/lib/utils';

// const guarantees = [
//     '30-day money-back guarantee',
//     'Lifetime access',
//     'Commercial use included',
// ] as const;

// const featureCards = [
//     {
//         value: '10',
//         type: 'number' as const,
//         title: 'Next.js Templates',
//         description:
//             'Production-ready SaaS starters — auth, billing, and AI patterns. Free-tier friendly.',
//     },
//     {
//         value: '39',
//         type: 'number' as const,
//         title: 'Full-stack Blocks',
//         description:
//             'Pre-wired Stripe + Supabase + AI blocks — copy, paste, customize, ship.',
//     },
//     {
//         value: '38',
//         type: 'number' as const,
//         title: 'Marketing Components',
//         description:
//             'Conversion-ready heroes, features, and CTAs built with Shadcn + Framer Motion.',
//     },
//     {
//         value: null,
//         type: 'icon' as const,
//         title: 'Community (Coming Soon)',
//         description:
//             'Private Discord for support, office hours, showcases, and early drops.',
//     },
// ] as const;

// const pricingIncludes = [
//     'All current & future templates, blocks, and components',
//     'Commercial projects included',
//     'Ongoing updates — no renewal ever',
//     '30-day money-back guarantee',
// ] as const;

// export default function PPCollective() {
//     return (
//         <section className="w-full py-16 md:py-24">
//             <div className="container mx-auto max-w-6xl px-4 md:px-6">
//                 {/* Top: discount badge, title, subtitle, guarantee list */}
//                 <div className="mb-12 space-y-4 md:mb-16">
//                     {/* <Badge
//                         variant="default"
//                         className="bg-primary/5 text-primary rounded-md border-primary/30 px-3 py-1 text-sm font-medium"
//                     >
//                         $100 off for a limited time
//                     </Badge> */}
//                     <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
//                         What is Pacepard Apprenticeship?
//                     </h2>
//                     <p className="max-w-2xl text-lg text-muted-foreground">
//                     Over the past 6 months, my team and I at Pacepard have successfully ran an experiment.
//                         Working on a production application increased skill mastery and problem solving by over 68%.
//                         We are democratizing this process and we invite you to join us.
//                     </p>
//                     <ul className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
//                         {guarantees.map((item) => (
//                             <li key={item} className="flex items-center gap-2">
//                                 <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
//                                     <Check className="size-3" aria-hidden />
//                                 </span>
//                                 {item}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>

//                 {/* Two columns: feature cards left, pricing card right — always on same line */}
//                 <div className="flex flex-col lg:flex-row lg:flex-nowrap items-start gap-8 md:gap-12">
//                     {/* Left: stacked feature cards with vertical gap */}
//                     <div className="min-w-0 flex-1 flex flex-col gap-4">
//                         {featureCards.map((card, index) => {
//                             const decorativeColors = [
//                                 'bg-[var(--color-decorative-pink)]',
//                                 'bg-[var(--color-decorative-blue)]',
//                                 'bg-[var(--color-decorative-orange)]',
//                                 'bg-[var(--color-decorative-green)]',
//                             ];
//                             const decorativeColor = decorativeColors[index % decorativeColors.length];

//                             return (
//                             <div
//                                 key={card.title}
//                                 className={cn(
//                                     'flex items-start gap-5 rounded-xl border border-border bg-card p-5 shadow-sm',
//                                     'transition-colors hover:border-primary/20 hover:bg-muted/30',
//                                 )}
//                             >
//                                 <div className={cn(
//                                     'flex size-12 shrink-0 items-center justify-center rounded-lg text-white',
//                                     decorativeColor
//                                 )}>
//                                     {card.type === 'number' ? (
//                                         <span className="text-2xl font-bold tabular-nums">
//                                             {card.value}
//                                         </span>
//                                     ) : (
//                                         <Sparkles
//                                             className="size-6"
//                                             aria-hidden
//                                         />
//                                     )}
//                                 </div>
//                                 <div className="min-w-0 flex-1 space-y-1">
//                                     <h3 className="font-semibold text-foreground">
//                                         {card.title}
//                                     </h3>
//                                     <p className="text-sm text-muted-foreground leading-relaxed">
//                                         {card.description}
//                                     </p>
//                                 </div>
//                             </div>
//                         );
//                         })}
//                     </div>

//                     {/* Right: pricing card */}
//                     <div className="w-full lg:w-[380px] shrink-0 flex flex-col lg:sticky lg:top-8 self-start">
//                         <div
//                             className={cn(
//                                 'flex flex-col rounded-2xl border border-border p-6 shadow-lg',
//                                 'bg-foreground text-background',
//                             )}
//                         >
//                             <p className="text-xs font-semibold uppercase tracking-wider text-primary">
//                                 Lifetime License
//                             </p>
//                             <p className="mt-1 text-sm text-background/80">
//                                 One-time payment, lifetime access
//                             </p>
//                             <div className="mt-6 flex flex-wrap items-baseline gap-2">
//                                 <span className="text-4xl font-bold tracking-tight sm:text-5xl">
//                                     $179
//                                 </span>
//                                 <span className="text-lg text-background/60 line-through">
//                                     $279
//                                 </span>
//                                 <Badge
//                                     variant="default"
//                                     className="bg-red-400 text-primary-foreground border-0 h-8"
//                                 >
//                                     Save $100
//                                 </Badge>
//                             </div>
//                             <Button
//                                 size="lg"
//                                 className="mt-6 w-full bg-blue-500 text-primary-foreground hover:bg-primary/90"
//                                 asChild
//                             >
//                                 <a href="#">Join the cult for life</a>
//                             </Button>
//                             <ul className="mt-6 space-y-3 border-t border-background/20 pt-6">
//                                 {pricingIncludes.map((item) => (
//                                     <li
//                                         key={item}
//                                         className="flex items-start gap-3 text-sm"
//                                     >
//                                         <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-primary">
//                                             <Check
//                                                 className="size-3"
//                                                 aria-hidden
//                                             />
//                                         </span>
//                                         <span className="text-background/95">
//                                             {item}
//                                         </span>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }
