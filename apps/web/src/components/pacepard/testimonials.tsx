import Image from 'next/image';
import { cn } from '@pacepard/ui/lib/utils';

const testimonials = [
    {
        quote: 'Become the person others trust with the hardest user problems.',
        author: 'Product & Design folks',
        role: 'Build advanced tools like Git, S3 buckets, and CLIs from scratch.',
        image: '/blocks/product.png',
    },
    {
        quote: 'Build advanced tools like Git, S3 buckets, and CLIs from scratch.',
        author: 'Engineers',
        role: 'Build advanced tools like Git, S3 buckets, and CLIs from scratch.',
        image: '/blocks/eng.png',
    },
    {
        quote: 'Build ML Models and pipelines for the toughest data challenges.',
        author: 'Data & AI Professionals',
        role: 'AI & Data',
        image: '/blocks/ai.png',
    },
    {
        quote: 'Uncover hidden failures and security flaws on live systems.',
        author: 'Security & testing folks',
        role: 'Security',
        image: '/blocks/security.png',
    },
    {
        quote: 'Drive adoption, and engagement for socio-good products.',
        author: 'Marketing & sales',
        role: 'Growth',
        image: '/blocks/market.png',
    },
    {
        quote: 'We hold your hands as you learn by doing tasks beyond basics.',
        author: 'Learners',
        role: 'Learning',
        image: '/blocks/learner.png',
    },
    {
        quote: 'Become the person others trust with the hardest user problems.',
        author: 'Design folks',
        role: 'Design',
        image: '/blocks/product.png',
    },
    {
        quote: 'Build advanced tools like Git, S3 buckets, and CLIs from scratch.',
        author: 'Product Folks',
        role: 'Engineering',
        image: '/blocks/eng.png',
    },
    {
        quote: 'Build ML Models and pipelines for the toughest data challenges.',
        author: 'Data & AI Professionals',
        role: 'AI & Data',
        image: '/blocks/ai.png',
    },
    {
        quote: 'Uncover hidden failures and security flaws on live systems.',
        author: 'Security & testing folks',
        role: 'Security',
        image: '/blocks/security.png',
    },
];

const row1 = testimonials.slice(0, 5);
const row2 = testimonials.slice(5, 10);

function TestimonialCard({
    quote,
    author,
    role,
    image,
    className,
}: {
    quote: string;
    author: string;
    role: string;
    image: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'flex w-[280px] shrink-0 flex-col gap-4 rounded-xl border border-border',
                'bg-card p-5 shadow-sm',
                className,
            )}
        >
            <div className="flex items-start gap-3">
                <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-muted">
                    <Image
                        src={image}
                        alt={author}
                        fill
                        className="object-cover"
                        sizes="44px"
                    />
                </div>
                <div className="min-w-0">
                    <p className="font-regular leading-tight text-foreground">
                        {author}
                    </p>
                    <p className="text-lg md:text-sm text-muted-foreground">
                        {quote}
                    </p>
                </div>
            </div>
        </div>
    );
}

export function Testimonials({ className }: { className?: string }) {
    return (
        <section className={cn('w-full overflow-hidden py-16 md:py-24 bg-neutral-50', className)}>
            <div className="mb-12 px-4 text-center md:mb-16 md:px-6">
                <h2 className="text-4xl font-regular tracking-tight text-foreground sm:text-5xl md:text-6xl">
                    Join other
                </h2>
                <h2 className="mt-1 text-4xl font-regular tracking-tight text-muted-foreground sm:text-5xl md:text-6xl">
                    AI-native talents. 
                </h2>
                {/* Join other AI-native talents who are learning and growing by doing. */}
            </div>

            {/* Mobile: single column, first 6 cards */}
            <div className="flex flex-col gap-4 px-4 md:hidden">
                {testimonials.slice(0, 6).map((t, i) => (
                    <TestimonialCard
                        key={`mob-${i}`}
                        {...t}
                        className="w-full"
                    />
                ))}
            </div>

            {/* Desktop: two offset rows bleeding off edges */}
            <div className="hidden flex-col gap-5 md:flex">
                {/* Row 1 — starts offset so first card bleeds off the left edge */}
                <div className="flex gap-5 -translate-x-[160px]">
                    {row1.map((t, i) => (
                        <TestimonialCard key={`r1-${i}`} {...t} />
                    ))}
                </div>

                {/* Row 2 — starts flush left, bleeds off the right edge */}
                <div className="flex gap-5 pl-6">
                    {row2.map((t, i) => (
                        <TestimonialCard key={`r2-${i}`} {...t} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
