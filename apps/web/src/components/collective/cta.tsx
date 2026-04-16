import { Button } from '@/components/ui/button';
import { cn } from '@pacepard/ui/lib/utils';
import { ArrowRightToLineIcon, Calendar } from 'lucide-react';
import Link from 'next/link';

const PpGoCTA = () => {
    return (
        <section>
            <div className="py-24 bg-neutral-50">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <h2 className="text-foreground text-balance text-3xl font-regular lg:text-4xl">
                            What do I do to become AI-native?
                            </h2>
                        </div>
                        <div className="flex flex-wrap items-center justify-start gap-4 md:justify-center">
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
                                    href="/pricing"
                                    className="inline-flex items-center gap-2"
                                >
                                   Choose a plan
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
                                    href="https://tally.so/r/44NJNX"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2"
                                >
                                    <Calendar
                                        className="size-4"
                                        strokeWidth={2.5}
                                        aria-hidden
                                    />
                                    Clarity session
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PpGoCTA;
