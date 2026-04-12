'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowRightToLineIcon } from 'lucide-react';
import { cn } from '@pacepard/ui/lib/utils';
import { Button } from '@/components/ui/button';

const HERO_IMAGE = '/blocks/pp.png';
//const HERO_IMAGE = '/blocks/hero.avif';

export default function PPHeroSection() {
    const [imageError, setImageError] = useState(false);

    return (
        <section className="mb-6 w-full bg-background pt-14 md:pt-1">
            <div className="container mx-auto max-w-9xl px-4 md:px-6">
                <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-start lg:gap-8 xl:gap-10">
                    {/* Left: headline, description, CTAs */}
                    <div className="min-w-0 max-w-xl shrink space-y-6 text-left lg:max-w-2xl">
                        <h1 className="font-bold tracking-tight text-foreground text-4xl md:text-5xl">
                            The growth platform for AI-native product teams.
                        </h1>
                        <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                            {/* Your projects, wikis and docs, all side by side. For
                            small teams to large organizations. */}
                            Pacepard is you become an AI-native talent by
                            learning and growing by doing, and organisations
                            drive long-term product adoption, engagement and
                            loyalty.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
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
                                    Choose a program
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
                                    Request a demo
                                    <ArrowRightToLineIcon
                                        className="size-4"
                                        strokeWidth={2.5}
                                        aria-hidden
                                    />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right: illustration — screenshot or SVG from /blocks */}
                    <div className="relative flex w-full max-w-lg shrink-0 -translate-x-2 items-center justify-center lg:max-w-2xl lg:-translate-x-4">
                        <Image
                            src={HERO_IMAGE}
                            alt="Pacepard"
                            width={560}
                            height={420}
                            className="h-auto w-full object-contain"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                            onError={() => setImageError(true)}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

// import React from 'react';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import { ArrowRight, ArrowRightToLineIcon, CalendarDaysIcon, ChevronRight, CornerDownRight, PlusIcon, PlusSquare, Sparkle } from 'lucide-react';
// import { Badge } from '../ui/badge';
// import { siteConfig } from '@/_data/site-config';

// export default function PPHeroSection() {
//     return (
//         <>
//             <main>
//                 <section className="before:bg-muted border-e-foreground relative overflow-hidden before:absolute before:inset-1 before:h-[calc(100%-8rem)] before:rounded-2xl sm:before:inset-2 md:before:rounded-[2rem] lg:before:h-[calc(100%-14rem)]">
//                     <div className="py-20 md:py-40 mb-56">
//                         <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
//                             <div>
//                                 <Link
//                                     href="no"
//                                     className="hover:bg-foreground/5 mx-auto flex w-fit items-center justify-center gap-2 rounded-md py-0.5 pl-1 pr-3 transition-colors duration-150"
//                                 >
//                                     <div
//                                         aria-hidden
//                                         className="border-background bg-linear-to-b dark:inset-shadow-2xs to-foreground from-primary relative flex size-5 items-center justify-center rounded border shadow-md shadow-black/20 ring-1 ring-black/10"
//                                     >
//                                         <div className="absolute inset-x-0 inset-y-1.5 border-y border-dotted border-white/25"></div>
//                                         <div className="absolute inset-x-1.5 inset-y-0 border-x border-dotted border-white/25"></div>
//                                         <Sparkle className="size-3 fill-white stroke-white drop-shadow" />
//                                     </div>
//                                     <span className="font-medium">
//                                         Introducing Pacepard Go v00.10
//                                     </span>
//                                     {/* <Badge
//                                         variant="outline"
//                                         className="animate-appear rounded"
//                                     >
//                                             <PlusSquare className="size-3" />

//                                         <span className="text-muted-foreground">
//                                         Introducing Pacepard Go v00.10
//                                         </span>
//                                         <a
//                                             href={siteConfig.getStartedUrl}
//                                             className="flex items-center gap-1"
//                                         >

//                                         </a>
//                                     </Badge> */}
//                                 </Link>
//                                 <h1 className="mx-auto mt-8 max-w-4xl text-balance text-6xl font-bold tracking-tight">
//                                     {/* max-w-md text-balance text-5xl font-medium md:text-6xl */}
//                                     Everyone needs a Superpower, Get the perfect
//                                     one.
//                                 </h1>
//                                 <p className="text-muted-foreground mx-auto my-6 max-w-2xl text-balance text-xl">
//                                     Pacepard is where talents learn and grow by
//                                     doing, and organisations drive long-term
//                                     product adoption, engagement and loyalty.
//                                 </p>

//                                 <div className="flex items-center justify-center gap-3">
//                                     <Button
//                                         asChild
//                                         size="lg"
//                                         className="pr-4.5"
//                                     >
//                                         <Link href="#link">
//                                             <span className="text-nowrap">
//                                                 Get Started
//                                             </span>
//                                             <ArrowRightToLineIcon className="opacity-60" />
//                                         </Link>
//                                     </Button>
//                                     <Button
//                                         key={2}
//                                         asChild
//                                         size="lg"
//                                         variant="outline"
//                                         className="pl-5"
//                                     >
//                                         <Link href="#link">
//                                             <span className="text-nowrap">
//                                                 Book a demo
//                                             </span>
//                                             <CalendarDaysIcon className="opacity-60" />
//                                         </Link>
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* <div className="relative">
//                             <div className="relative z-10 mx-auto max-w-5xl px-6">
//                                 <div className="mt-12 md:mt-16">
//                                     <div className="bg-background rounded-(--radius) relative mx-auto overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
//                                         <Image
//                                             src="/blocks/bg-2.png"
//                                             alt="app screen"
//                                             width="2880"
//                                             height="1842"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div> */}
//                     </div>
//                 </section>
//             </main>
//         </>
//     );
// }
