'use client';

import Image from 'next/image';

import {
    CirclesThreePlus,
    ChartBar,
    DiamondsFour,
    SquaresFour,
    Calendar,
    ArrowRight,
} from 'phosphor-react';

import { DashedLine } from '@/components/dashed-line';
import { Button } from '@/components/ui/button';

type Feature = {
    title: string;
    description: string;
    icon: React.ComponentType<{
        size?: number;
        weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill';
        className?: string;
    }>;
};

const features: Feature[] = [
    {
        title: 'Unlock superhuman potential',
        description:
            'Grow the skills, habits, and competence that make you job ready.',
        icon: CirclesThreePlus,
    },
    {
        title: 'AI-Assisted learning and mastery',
        description:
            'Solve user and product problems with Pacepard AI by your side.',
        icon: SquaresFour,
    },
    {
        title: 'Hackathons that actually converts',
        description:
            'Organize events that drive engagement, adoption, and lasting loyalty.',
        icon: DiamondsFour, // scale your developer relations
    },
    {
        title: 'Scale your learning outcomes',
        description:
            'Use Pacepard to deliver consistent results that are useful in today’s workplace',
        icon: ChartBar,
    },
];

const GoHero = () => {
    return (
        <section className="py-28 pt-12 lg:py-24 lg:pt-20">
            <div className="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
                {/* Left side - Main content */}
                <div className="flex-1">
                    <h1 className="text-foreground max-w-160 text-4xl tracking-tight md:text-4xl lg:text-6xl xl:whitespace-nowrap">
                        Everyone needs a <br className="hidden lg:block" />{' '}
                        Superpower, Get <br className="hidden lg:block" /> the
                        perfect one.
                    </h1>

                    <p className="text-muted-foreground text-1xl mt-5 md:text-2xl">
                        Pacepard is where talents learn and grow by doing, and
                        organisations drive long-term product adoption,
                        engagement and loyalty.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4 lg:flex-nowrap">
                        <Button asChild>
                            <a
                                href="https://github.com/pacepard"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Start now
                                <ArrowRight
                                    size={20}
                                    weight="regular"
                                    className="inline ml-1"
                                />
                            </a>
                        </Button>
                        {/* <Button
              variant="outline"
              className="from-background h-auto gap-2 bg-linear-to-r to-transparent shadow-md"
              asChild
            >
              <a
                href="https://calendly.com/pacepard"
                target="_blank"
                rel="noopener noreferrer"
                className="max-w-56 truncate text-start md:max-w-none"
              >
                Book a demo
                <Calendar size={20} weight="regular" className="inline ml-1" />
              </a>
            </Button> */}
                        <Button
                            variant="outline"
                            className="from-background h-auto gap-2 bg-linear-to-r to-transparent shadow-md"
                            asChild
                        >
                            <a
                                href="/book-a-demo"
                                className="max-w-56 truncate text-start md:max-w-none"
                            >
                                Book a demo
                                <Calendar
                                    size={20}
                                    weight="regular"
                                    className="inline ml-1"
                                />
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Right side - Features */}
                <div className="relative flex flex-1 flex-col justify-center space-y-5 max-lg:pt-10 lg:pl-10">
                    <DashedLine
                        orientation="vertical"
                        className="absolute top-0 left-0 max-lg:hidden"
                    />
                    <DashedLine
                        orientation="horizontal"
                        className="absolute top-0 lg:hidden"
                    />
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="flex gap-2.5 lg:gap-5"
                            >
                                <Icon
                                    size={20}
                                    weight="regular"
                                    className="text-foreground mt-1 shrink-0 lg:size-5"
                                />
                                <div>
                                    <h2 className="font-text text-foreground font-regular text-lg">
                                        {feature.title}
                                    </h2>
                                    <p className="text-muted-foreground max-w-76 text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-12 max-lg:ml-6 max-lg:h-[550px] max-lg:overflow-hidden md:mt-20 lg:container lg:mt-24">
                <div className="relative h-[793px] w-full">
                    <Image
                        src="/hero-ui.png"
                        alt="hero"
                        fill
                        className="rounded-2xl object-cover object-left-top shadow-lg max-lg:rounded-tr-none"
                    />
                </div>
            </div>
        </section>
    );
};

export default GoHero;
