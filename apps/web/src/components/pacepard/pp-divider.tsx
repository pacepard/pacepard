import { Button } from '@/components/ui/button';
import { ArrowRightToLineIcon, Calendar } from 'lucide-react';
import Link from 'next/link';

const PPDivider = () => {
    return (
        <section>
            <div className="py-24 bg-neutral-50">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <h2 className="text-foreground text-balance text-3xl font-semibold lg:text-4xl">
                                Pacepard is a research lab and technology
                                company dedicated to ensuring that artificial
                                intelligence serves human learning goals and
                                systems.
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PPDivider;
