'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Background } from '@/components/background';
import { DashedLine } from '@/components/dashed-line';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@pacepard/ui/lib/utils';

function SlackIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden
        >
            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.521-2.522v-2.522h2.521zM15.165 17.688a2.527 2.527 0 0 1-2.521-2.523 2.526 2.526 0 0 1 2.521-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
        </svg>
    );
}

export default function PPFunnel() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: wire to newsletter / API
    };

    return (
        <Background variant="bottom">
            <section className={cn('w-full')}>
                <DashedLine
                    orientation="horizontal"
                    className="container scale-x-105"
                />
                <div className="container mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
                    {/* Left: Stay in the loop — email signup */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Stay in the loop
                        </h2>
                        <p className="max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
                            Get the latest on empathic AI research, product
                            updates, and company news.
                        </p>
                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 flex w-full max-w-md"
                        >
                            <div
                                className={cn(
                                    'flex w-full items-center gap-0 overflow-hidden rounded-md',
                                    'border border-zinc-600/80 bg-zinc-800/80 shadow-sm',
                                    'focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-500/20',
                                )}
                            >
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={cn(
                                        'h-12 flex-1 rounded-md border-0 bg-muted px-5 text-foreground',
                                        'placeholder:text-zinc-500',
                                        'focus-visible:ring-0 focus-visible:ring-offset-0',
                                    )}
                                    aria-label="Email address"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className={cn(
                                        'size-12 shrink-0 rounded-md',
                                        'bg-foreground text-background hover:bg-foreground/80',
                                        'mr-1.5',
                                    )}
                                    aria-label="Subscribe"
                                >
                                    <ArrowRight
                                        className="size-5"
                                        strokeWidth={2.5}
                                        aria-hidden
                                    />
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Right: Join the community — Slack CTA */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Join the community
                        </h2>
                        <p className="max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
                            Connect with other developers, share projects, and
                            get help from the team.
                        </p>
                        <Button
                            asChild
        
                            size="lg"
                            className={cn(
                                'mt-6 h-12 rounded-md px-6',
                                'bg-[#0075DE]/70 text-white hover:bg-neutral-600',
                                'border border-neutral-200/80',
                            )}
                        >
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3"
                            >
                                <SlackIcon className="size-5 shrink-0" />
                                Join our Slack
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
        </Background>
    );
}
