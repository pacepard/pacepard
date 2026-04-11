import Image from 'next/image'

import { cn } from '@pacepard/ui/lib/utils'

export type TrackCardVariant = 'mint' | 'pale'

const VARIANT = {
    mint: {
        surface: '#f91ce4', //#E0EAE9',
        gold: '#f91ce4', //#F2D36B',
        article:
            'rounded border border-zinc-900/10 shadow-lg shadow-zinc-950/10',
    },
    pale: {
        surface: '#F1F5F4',
        gold: '#ffdc5d',
        article: 'rounded border border-zinc-900/[0.06] shadow-sm shadow-zinc-950/5',
    },
} as const

export type TrackBadgeVariant = 'ai' | 'live' | 'growth' | 'product'

export type TrackBadge = { label: string; variant: TrackBadgeVariant }

function badgeClass(variant: TrackCardVariant, b: TrackBadgeVariant): string {
    const shapePale = 'rounded-md px-3 py-1'
    const shapeMint = 'rounded-md px-2.5 py-1'
    const shape = variant === 'pale' ? shapePale : shapeMint
    const type = 'text-xs font-semibold tracking-wide'

    if (b === 'live') {
        return cn(shape, type, variant === 'pale' ? 'text-zinc-900' : 'text-white')
    }
    if (variant === 'pale') {
        return cn(shapePale, type, 'bg-[#E8EEEC] text-zinc-900 ring-1 ring-zinc-900/8')
    }
    if (b === 'ai') {
        return cn(shapeMint, type, 'bg-white text-zinc-950')
    }
    return cn(shapeMint, type, 'bg-white/90 text-zinc-900 ring-1 ring-zinc-900/10')
}

export type TrackCardProps = {
    badges: TrackBadge[]
    title: string
    description: string
    instructor: string
    imageSrc: string
    imageAlt: string
    /** Product/tool logos shown in a horizontal row below the instructor name. */
    productImages?: { src: string; alt?: string }[]
    className?: string
    /** `pale` matches the masonry grid reference (light card + brighter gold). */
    cardVariant?: TrackCardVariant
}

export function TrackCard({
    badges,
    title,
    description,
    instructor,
    imageSrc,
    imageAlt,
    productImages,
    className,
    cardVariant = 'mint',
}: TrackCardProps) {
    const v = VARIANT[cardVariant]

    return (
        <article className={cn('relative overflow-hidden ', v.article, className)}>
            <div className="relative px-6 pb-28 pt-6" style={{ backgroundColor: v.surface }}>
                <div className="flex flex-wrap items-center gap-2">
                    {badges.map((b) => (
                        <span
                            key={`${b.label}-${b.variant}`}
                            className={badgeClass(cardVariant, b.variant)}
                            style={b.variant === 'live' ? { backgroundColor: v.gold } : undefined}>
                            {b.label}
                        </span>
                    ))}
                </div>
                <h2 className="mt-5 text-balance text-xl font-bold tracking-tight text-zinc-950 sm:text-[21px] sm:leading-snug">
                    {title}
                </h2>
                <p className="mt-3 max-w-[178px] text-pretty text-[13px] leading-relaxed text-zinc-900 sm:max-w-none sm:text-sm md:text-[15px]">
                    {description}
                </p>
                <p className="mt-6 text-sm font-semibold text-zinc-950 sm:text-base">{instructor}</p>
                {productImages && productImages.length > 0 && (
                    <div className="mt-3 flex flex-row items-center gap-3">
                        {productImages.map((img, i) => (
                            <div key={i} className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                                <Image
                                    src={img.src}
                                    alt={img.alt ?? ''}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div
                className="relative h-[61px] w-full sm:h-[72px] md:h-[85px]"
                style={{
                    backgroundColor: v.gold,
                    backgroundImage:
                        'repeating-linear-gradient(105deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 6px)',
                }}
                aria-hidden
            />
            <div className="pointer-events-none absolute bottom-0 right-0 h-[min(52vw,168px)] w-[min(52vw,142px)] sm:h-[180px] sm:w-[150px] md:h-[200px] md:w-[168px]">
                <div className="relative h-full w-full">
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        className="object-contain object-bottom"
                        sizes="(max-width: 768px) 52vw, 168px"
                    />
                </div>
            </div>
        </article>
    )
}

const INSTRUCTOR_IMAGE = '/blocks/damola.png'

export default function SingleTrack() {
    return (
        <section>
            <div className="py-24">
                <div className="mx-auto w-full max-w-4xl px-6">
                    <TrackCard
                        cardVariant="mint"
                        badges={[
                            { label: 'AI', variant: 'ai' },
                            { label: 'Live', variant: 'live' },
                        ]}
                        title="AI Prototyping"
                        description="Learn how to use AI-powered prototyping to test concepts, validate assumptions, and ship better products faster."
                        instructor="With Damola Oladipo"
                        imageSrc={INSTRUCTOR_IMAGE}
                        imageAlt="Damola Oladipo"
                        className="mx-auto w-full max-w-[274px] sm:max-w-[320px] md:max-w-[380px]"
                    />
                </div>
            </div>
        </section>
    )
}
