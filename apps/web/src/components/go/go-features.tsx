import Image from 'next/image';
import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { DashedLine } from '@/components/dashed-line';
import { Card, CardContent } from '@/components/ui/card';

const items = [
    {
        title: 'Organise online, in-person, or hybrid hackathons all in one place',
        image: '/blocks/@create-hackk.png',
    },
    {
        title: 'Get thousands to stick around your product and technology',
        image: '/features/cycle-card.svg',
    },
    {
        title: 'Build consistent usage momentum and a healthy feedback loop',
        image: '/features/overview-card.svg',
    },
];

export default function GoFeatures() {
    return (
        <section id="feature-modern-teams" className="pb-28 lg:pb-32">
            <div className="container">
                {/* Top dashed line with text */}
                <div className="relative flex items-center justify-center">
                    <DashedLine className="text-muted-foreground" />
                    <span className="bg-neutral-50 text-muted-foreground absolute px-3 font-mono text-sm font-medium tracking-wide max-md:hidden">
                        PACEPARD GO. PACEPARD GO.
                    </span>
                </div>

                {/* Content */}
                <div className="mx-auto mt-10 grid max-w-4xl items-center gap-4 md:gap-6 lg:mt-24 lg:grid-cols-2">
                    <h2 className="text-4xl font-regular tracking-tight text-foreground md:text-5xl">
                        Built for world-class hackathons
                    </h2>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        Pacepard is built on the habits that make the best
                        hackathons successful: knowledgeable participants, fast
                        engagement, and launching high-quality initiatives
                        without the usual headaches.
                    </p>
                </div>

                {/* Features Card */}
                <Card className="mt-8 rounded-3xl md:mt-12 lg:mt-20 ">
                    <CardContent className="flex p-0 max-md:flex-col">
                        {items.map((item, i) => (
                            <div
                                key={i}
                                className="flex flex-1 max-md:flex-col"
                            >
                                <div className="flex-1 p-4 pe-0! md:p-6">
                                    <div className="relative aspect-[1.28/1] overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={`${item.title} interface`}
                                            fill
                                            className="object-cover object-left-top ps-4 pt-2"
                                        />
                                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-neutral-100 via-transparent to-transparent" />
                                    </div>

                                    <Link
                                        href="#"
                                        className={
                                            'group flex items-center justify-between gap-4 pe-4 pt-4 md:pe-6 md:pt-6'
                                        }
                                    >
                                        <h3 className="max-w-60 text-xl font-regular tracking-tight text-foreground">
                                            {item.title}
                                        </h3>
                                        <div className="rounded-full border p-2">
                                            <ChevronRight className="size-6 transition-transform group-hover:translate-x-1 lg:size-9" />
                                        </div>
                                    </Link>
                                </div>
                                {i < items.length - 1 && (
                                    <div className="relative hidden md:block">
                                        <DashedLine orientation="vertical" />
                                    </div>
                                )}
                                {i < items.length - 1 && (
                                    <div className="relative block md:hidden">
                                        <DashedLine orientation="horizontal" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
