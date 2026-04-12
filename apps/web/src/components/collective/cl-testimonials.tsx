'use client';

import React from 'react';
import Image from 'next/image';
import { Marquee } from '@pacepard/ui/components/marquee';
import { cn } from '@pacepard/ui/lib/utils';

const testimonials = [
    {
        quote: 'Pacepard cut out all the messy parts on how to attempt real user problems.',
        author: 'Ruhamah Ifere',
        role: 'Founder/E.D',
        company: 'Trully Verify Africa',
        image: '/pacepard/ruhamah.png',
    },
    {
        quote: "The best hands-on learning experience I've ever had, the results show up fast.",
        author: 'Adetomiwa Odunlade',
        role: 'Founder',
        company: 'Mercury Finance',
        image: '/pacepard/zoe.png',
    },
    {
        quote: "It's the closest thing to working inside a top product team.",
        author: 'Peter Odejobi',
        role: 'Mobile Engineer',
        company: 'First Bank',
        image: '/pacepard/peter.png',
    },
    {
        quote: 'With respect to the format. This is the best I have ever participated in.',
        author: 'Aduragbemi Afe',
        role: 'PM',
        company: 'Learnpally',
        image: '/pacepard/adura.png',
    },
    {
        quote: 'Since I started, I saw myself have a real behavior change to coding.',
        author: 'Favour Brodrick',
        role: 'Technical PM',
        company: 'Pacepard',
        image: '/pacepard/favour.png',
    },
    {
        quote: "I stopped overthinking and started building. Now I'm confident and I've consistent habits.",
        author: 'Harry',
        role: 'Nodejs Engineer',
        company: 'Troott',
        image: '/pacepard/harry.png',
    },
] as const;

function TestimonialCard({
    quote,
    author,
    role,
    company,
    image,
    className,
}: {
    quote: string;
    author: string;
    role: string;
    company: string;
    image: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'flex w-[300px] shrink-0 flex-col gap-4 rounded-xl border border-border',
                'bg-card p-5 shadow-sm',
                'transition-shadow hover:shadow-md',
                className,
            )}
        >
            <div className="flex items-start gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted">
                    <Image
                        src={image}
                        alt={author}
                        width={48}
                        height={48}
                        className="object-cover"
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{author}</p>
                    <p className="text-sm text-muted-foreground">
                        {role}
                        {company && ` · ${company}`}
                    </p>
                </div>
            </div>
            <p className="flex-1 text-sm leading-relaxed text-foreground">
                {quote}
            </p>
        </div>
    );
}

export default function ClTestimonials() {
    return (
        <section className="w-full py-16 md:py-24 bg-background">
            <div className="mx-auto  px-4 md:px-6">
                {/* Title: "The people." / "They love us." */}
                <div className="mb-12 text-left md:mb-16 md:text-center">
                    <h2 className="text-4xl font-regular tracking-tight text-foreground md:text-5xl">
                        The people.
                    </h2>
                    <h2 className="mt-1 text-4xl font-regular tracking-tight text-muted-foreground md:text-5xl">
                        They love us.
                    </h2>
                </div>

                {/* Moving marquee: 2 rows of horizontally scrolling cards */}
                <div className="relative overflow-hidden">
                    <div className="flex flex-col gap-6 md:gap-8">
                        {/* Top row — inverse: last 3 cards, scrolls right */}
                        <Marquee
                            pauseOnHover
                            reverse
                            trackClassName="!gap-0 flex-row pe-[var(--gap)]"
                            className="[--duration:55s] [--gap:1.5rem] sm:[--gap:1.75rem] md:[--gap:1rem] md:[--duration:50s]"
                            repeat={4}
                        >
                            {testimonials
                                .slice(3, 6)
                                .map(
                                    ({
                                        quote,
                                        author,
                                        role,
                                        company,
                                        image,
                                    }) => (
                                        <TestimonialCard
                                            key={author}
                                            quote={quote}
                                            author={author}
                                            role={role}
                                            company={company}
                                            image={image}
                                            className="me-[var(--gap)] last:me-0"
                                        />
                                    ),
                                )}
                        </Marquee>
                        {/* Bottom row — inverse: first 3 cards, scrolls left */}
                        <Marquee
                            pauseOnHover
                            trackClassName="!gap-0 flex-row pe-[var(--gap)]"
                            className="[--duration:50s] [--gap:1.5rem] sm:[--gap:1.75rem] md:[--gap:1rem] md:[--duration:45s]"
                            repeat={4}
                        >
                            {testimonials
                                .slice(0, 3)
                                .map(
                                    ({
                                        quote,
                                        author,
                                        role,
                                        company,
                                        image,
                                    }) => (
                                        <TestimonialCard
                                            key={author}
                                            quote={quote}
                                            author={author}
                                            role={role}
                                            company={company}
                                            image={image}
                                            className="me-[var(--gap)] last:me-0"
                                        />
                                    ),
                                )}
                        </Marquee>
                    </div>
                </div>
            </div>
        </section>
    );
}
