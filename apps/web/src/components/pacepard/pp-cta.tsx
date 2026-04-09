import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRightToLineIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@pacepard/ui/lib/utils';

export default function PPCTA() {
    return (
        <section className="w-full bg-neutral-50">
            <div className="container mx-auto max-w-6xl px-4 md:px-6 py-16 md:py-24">
                <div className="flex flex-col items-center gap-12 md:flex-row md:items-center md:justify-between md:gap-16">
                    {/* Left: illustration */}
                    <div className="relative flex shrink-0 items-center justify-center w-full max-w-md md:max-w-[400px]">
                        <Image
                            src="/blocks/eng.svg"
                            alt="Pacepard platform illustration"
                            width={400}
                            height={280}
                            className="h-auto w-full object-contain max-h-[280px]"
                            priority={false}
                        />
                    </div>

                    {/* Right: headline, description, CTA */}
                    <div className="flex-1 min-w-0 space-y-6 text-left">
                        <h2 className="text-4xl font-regular tracking-tight text-foreground  md:text-5xl">
                            <span className="text-muted-foreground">
                                The world's best got{' '}
                            </span><br />
                            better by doing.
                        </h2>
                        <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                            Join open hackathons, co-create with global companies,
                            or host your own innovation challenges.
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
                                    <Calendar
                                        className="size-4"
                                        strokeWidth={2.5}
                                        aria-hidden
                                    />
                                    Request demo
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
