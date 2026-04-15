'use client';

import { useEffect, useState } from 'react';

import {
    Code,
    Users,
    PuzzlePiece,
    Rocket,
    ArrowRight,
    Calendar,
} from 'phosphor-react';

import { Button } from '@/components/ui/button';
import { Mockup } from '@/components/ui/mockup';
import Screenshot from '@/components/ui/screenshot';

export default function LensShowcase() {
    const images = [
        '/blocks/step-one.png',
        '/blocks/step-two.svg',
        '/blocks/step-three.svg',
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((current) => (current + 1) % images.length);
        }, 1500);

        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* LEFT: only one image shown at a time */}
                    <div className="flex justify-center">
                        <Mockup type="responsive">
                            <Screenshot
                                src={images[index] ?? images[0] ?? ''}
                                alt="Lens App"
                                width={275}
                                height={380}
                            />
                        </Mockup>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="space-y-8">
                        <h2 className="text-4xl font-medium lg:text-5xl max-w-xl leading-tight">
                            Become a Pacepard Superhuman
                        </h2>

                        <p className="text-muted-foreground">
                            We are here to help you{' '}
                            <span className="font-semibold">
                                learn and grow by doing
                            </span>{' '}
                            without any limits. AI is making the world move fast
                            and we don't want you to be behind. We give you the
                            right tools, you do the building!
                        </p>

                        <p className="text-muted-foreground">
                            Collaborate with software engineers, product
                            managers,product designers, data folks, and other
                            lifelong learners in a high-performing team. How:
                        </p>

                        {/* <p className="text-muted-foreground">
                            How:
                        </p> */}

                        {/* Feature List with Icons */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Users
                                    size={24}
                                    weight="fill"
                                    className="text-primary"
                                />
                                <span>
                                    Build Machine Learning and AI products.
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Code
                                    size={24}
                                    weight="fill"
                                    className="text-primary"
                                />
                                <span>
                                    Contribute to open source (pacepard)
                                    softwares.
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <PuzzlePiece
                                    size={24}
                                    weight="fill"
                                    className="text-primary"
                                />
                                <span>
                                    Experience how the best product companies
                                    work.
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Rocket
                                    size={24}
                                    weight="fill"
                                    className="text-primary"
                                />
                                <span>
                                    Improve your taste by observing other top
                                    talents.
                                </span>
                            </div>
                        </div>

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
                            <Button
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
                                    <Calendar
                                        size={20}
                                        weight="regular"
                                        className="inline ml-1"
                                    />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
