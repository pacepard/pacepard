import Image from 'next/image';

import { ArrowRight } from 'lucide-react';

import { DashedLine } from '@/components/dashed-line';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@pacepard/ui/lib/utils';

const items = [
    {
        quote: 'Pacepard cut out all the messy parts on how to attempt real user problems.',
        author: 'Ruhamah Ifere',
        role: 'Founder/E.D',
        company: 'Trully Verify Africa',
        image: '/pacepard/ruhamah.png',
    },
    {
        quote: 'The best hands-on learning ​experience I’ve ever had, the results show up fast.',
        author: 'Adetomiwa Odunlade',
        role: 'Founder',
        company: 'Mercury Finance',
        image: '/pacepard/zoe.png',
    },
    {
        quote: 'It’s the closest thing to working inside a top product team.',
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
        quote: 'I stopped overthinking and started building. Now I’m  confident and I’ve consistent habits.',
        author: 'Harry',
        role: 'Nodejs Engineer',
        company: 'Troott',
        image: '/pacepard/harry.png',
    },
    //I went from zero to building real features.
    // {
    //   quote: "I was able to replace 80% of my team with Mainline bots.",
    //   author: "Jonas Kotara",
    //   role: "Lead Engineer",
    //   company: "Mercury Finance",
    //   image: "/pacepard/ruhamah.png",
    // },
    // {
    //   quote: "Founder Mode is hard enough without having a really nice PM app.",
    //   author: "Kevin Yam",
    //   role: "Founder",
    //   company: "Mercury Finance",
    //   image: "/pacepard/ruhamah.png",
    // },
    // {
    //   quote: "I can use the tool as a substitute from my PM.",
    //   author: "Kundo Marta",
    //   role: "Founder",
    //   company: "Mercury Finance",
    //   image: "/testimonials/kundo-marta.webp",
    // },
];

export const Testimonials = ({
    className,
    dashedLineClassName,
}: {
    className?: string;
    dashedLineClassName?: string;
}) => {
    return (
        <>
            <section
                className={cn('overflow-hidden py-28 lg:py-32', className)}
            >
                <div className="container">
                    <div className="space-y-4">
                        <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
                            Be the best by doing.
                        </h2>
                        <p className="text-muted-foreground max-w-md leading-snug">
                            Pacepard is built on the habits that make our
                            superhumans; learn and grow by doing, and generate
                            high-quality outputs without the usual headaches.
                        </p>
                        <Button variant="outline" className="shadow-md">
                            Read our sucess Stories{' '}
                            <ArrowRight className="size-4" />
                        </Button>
                    </div>

                    <div className="relative mt-8 -mr-[max(3rem,calc((100vw-80rem)/2+3rem))] md:mt-12 lg:mt-20">
                        <Carousel
                            opts={{
                                align: 'start',
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="">
                                {items.map((testimonial, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="xl:basis-1/3.5 grow basis-4/5 sm:basis-3/5 md:basis-2/5 lg:basis-[28%] 2xl:basis-[24%]"
                                    >
                                        <Card className="bg-muted h-full overflow-hidden border-none">
                                            <CardContent className="flex h-full flex-col p-0">
                                                <div className="relative h-[288px] lg:h-[328px]">
                                                    <Image
                                                        src={testimonial.image}
                                                        alt={testimonial.author}
                                                        fill
                                                        className="object-cover object-top"
                                                    />
                                                </div>
                                                <div className="flex flex-1 flex-col justify-between gap-10 p-6">
                                                    <blockquote className="font-display text-lg leading-none! font-medium md:text-xl lg:text-2xl">
                                                        {testimonial.quote}
                                                    </blockquote>
                                                    <div className="space-y-0.5">
                                                        <div className="text-black font-regular">
                                                            {testimonial.author}
                                                            , {testimonial.role}
                                                        </div>
                                                        <div className="text-muted-foreground text-sm">
                                                            {
                                                                testimonial.company
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <div className="mt-8 flex gap-3">
                                <CarouselPrevious className="bg-muted hover:bg-muted/80 static size-14.5 translate-x-0 translate-y-0 transition-colors [&>svg]:size-6 lg:[&>svg]:size-8" />
                                <CarouselNext className="bg-muted hover:bg-muted/80 static size-14.5 translate-x-0 translate-y-0 transition-colors [&>svg]:size-6 lg:[&>svg]:size-8" />
                            </div>
                        </Carousel>
                    </div>
                </div>
            </section>
            <DashedLine
                orientation="horizontal"
                className={cn('mx-auto max-w-[80%]', dashedLineClassName)}
            />
        </>
    );
};
