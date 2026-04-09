import { Button } from '@/components/ui/button';
import { ArrowRightToLineIcon, Calendar, Lightbulb, Pencil, PencilRuler } from 'lucide-react';
import Link from 'next/link';
import { CSSProperties } from 'react';

const PPDivider = () => {
    return (
        <section>
            <div className="py-24 bg-neutral-50">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <h2 className="text-foreground text-balance text-3xl font-light lg:text-4xl">
                                Pacepard is a research lab and technology
                                company dedicated to ensuring that artificial
                                intelligence serves human learning goals and
                                systems.
                            </h2>
                        </div>

                        <div className="@gap-6 text-sm">
            

                
                    <div className="@xl:grid-cols-3 mt-12 grid grid-cols-2 gap-6 text-sm">
                    <div className="border-y py-6">
                        <p className="text-muted-foreground text-xl">
                            <span className="text-foreground font-medium">99.9%</span> Uptime guarantee.
                        </p>
                    </div>

                    <div className="border-y py-6">
                        <p className="text-muted-foreground text-xl">
                            <span className="text-foreground font-medium">10M+</span> API requests processed daily.
                        </p>
                    </div>

                    <div className="border-y py-6">
                        <p className="text-muted-foreground text-xl">
                            <span className="text-foreground font-medium">500+</span> Enterprise customers.
                        </p>
                    </div>
                    <div className="border-y py-6">
                        <p className="text-muted-foreground text-xl">
                            <span className="text-foreground font-medium">500+</span> Enterprise customers.
                        </p>
                    </div>
                </div>
            </div>
            <div
                aria-hidden
                className="mx-auto flex h-72 max-w-5xl items-end justify-between gap-0.5 px-6">
                {Array.from({ length: 48 }, (_, i) => {
                    const progress = i / 47
                    const base = Math.pow(progress, 2.2)
                    const noise = Math.sin(i * 0.7) * 0.08 + Math.sin(i * 1.3) * 0.05
                    const height = Math.min(1, Math.max(0.05, base + noise * (0.3 + progress * 0.7)))
                    return (
                        <div
                            key={i}
                            className="after:h-(--line-height) after:bg-foreground/15 hover:after:bg-primary relative h-full w-px rounded-full duration-200 before:absolute before:inset-0 before:-inset-x-6 after:absolute after:inset-0 after:mt-auto hover:mx-2"
                            style={{ '--line-height': `${height * 100}%` } as CSSProperties}
                        />
                    )
                })}
        


               
                    </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PPDivider;
