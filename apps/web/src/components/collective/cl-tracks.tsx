import { TrackCard, type TrackBadge } from '@/components/collective/cl-track';

import { cn } from '@pacepard/ui/lib/utils';

const MENTOR_IMAGE = '/hack-ogbomoso/mentor.png';

type TrackEntry = {
    badges: TrackBadge[];
    title: string;
    description: string;
    instructor: string;
    imageAlt: string;
    /** Defaults to `/hack-ogbomoso/mentor.png` when omitted */
    imageSrc?: string;
    /** Product/tool logos shown in a horizontal row below the instructor name */
    productImages?: { src: string; alt?: string }[];
};

/**
 * Columns left-to-right match the masonry reference: two cards per column.
 * Stagger (xl+) approximates waterfall offsets — col 1 lowest, col 2 near top, 3 mid, 4 slightly below 3.
 */
const PRODUCT_IMAGES = [
    { src: '/blocks/cal.avif' },
    { src: '/blocks/go.png' },
    { src: '/blocks/terminal.png' },
];

const TRACK_COLUMNS: TrackEntry[][] = [
    [
        {
            badges: [
                { label: 'AI', variant: 'ai' },
                { label: 'Live', variant: 'live' },
            ],
            title: 'AI product Management',
            description:
                'Learn how to use AI-powered product management to test concepts, validate assumptions, and ship better products faster.',
            instructor: 'With Cal.com (Open Source)',
            imageSrc: '/blocks/damola.png',
            imageAlt: 'Ravi Mehta',
            productImages: PRODUCT_IMAGES,
        },
        {
            badges: [{ label: 'Product', variant: 'product' }],
            title: 'Mastering Product Operations',
            description:
                'Build reliable product operating rhythms, align teams on outcomes, and scale execution without losing quality.',
            instructor: 'With Jenny Wanger',
            imageSrc: '/blocks/damola.png',
            imageAlt: 'Jenny Wanger',
            productImages: PRODUCT_IMAGES,
        },
    ],
    [
        {
            badges: [{ label: 'AI', variant: 'ai' }],
            title: 'AI Software Engineering',
            description:
                'Lead product strategy in an AI-native world: roadmaps, governance, and customer value when models move fast.',
            instructor: 'With Cal.com (Open Source)',
            imageSrc: '/blocks/dml.png',
            imageAlt: 'Damola Oladipo',
            productImages: PRODUCT_IMAGES,
        },
        {
            badges: [{ label: 'Growth', variant: 'growth' }],
            title: 'Mastering Experimentation',
            description:
                'Design rigorous experiments, read results with confidence, and build a culture of learning over luck.',
            instructor: 'With Fareed Mosavat & Elena Verna',
            imageSrc: '/blocks/madebydam.png',
            imageAlt: 'Fareed Mosavat and Elena Verna',
            productImages: PRODUCT_IMAGES,
        },
    ],
    [
        {
            badges: [{ label: 'AI', variant: 'ai' }],
            title: 'AI Software Engineering',
            description:
                'Ground yourself in how modern AI systems work so you can scope builds, evaluate vendors, and de-risk bets.',
            instructor: 'With Brian Balfour',
            imageAlt: 'Brian Balfour',
            productImages: PRODUCT_IMAGES,
        },
        {
            badges: [{ label: 'Product', variant: 'product' }],
            title: 'Technical Foundations',
            description:
                'Partner effectively with engineering: APIs, data, and architecture tradeoffs that shape what you can ship.',
            instructor: 'With Anand Subramani & Alex Allain',
            imageAlt: 'Anand Subramani and Alex Allain',
            productImages: PRODUCT_IMAGES,
        },
    ],
    [
        {
            badges: [{ label: 'AI', variant: 'ai' }],
            title: 'AI Productivity',
            description:
                'Adopt AI workflows that compound: research, specs, and delivery habits that save hours every week.',
            instructor: 'With Sachin Rekhi',
            imageAlt: 'Sachin Rekhi',
            productImages: PRODUCT_IMAGES,
        },
        {
            badges: [{ label: 'Growth', variant: 'growth' }],
            title: 'Mastering Network Effects',
            description:
                'Understand flywheels, cold start, and retention loops so growth compounds instead of stalling at scale.',
            instructor: 'With guest instructors',
            imageAlt: 'Instructors',
            productImages: PRODUCT_IMAGES,
        },
    ],
];

const COLUMN_STAGGER = [
    'lg:pt-[8rem]',
    'lg:pt-1',
    'lg:pt-12',
    'lg:pt-[6rem]',
] as const;

export default function ClTracks() {
    return (
        <section className="bg-[#78B9B1]">
            <div className="py-20 md:py-24">
                <div className="mx-auto w-full min-w-0 max-w-8xl px-6">
                    <div className="grid grid-cols-1 items-start gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                        {TRACK_COLUMNS.map((columnTracks, colIndex) => (
                            <div
                                key={colIndex}
                                className={cn(
                                    'flex flex-col gap-7',
                                    COLUMN_STAGGER[colIndex],
                                )}
                            >
                                {columnTracks.map((track) => (
                                    <TrackCard
                                        key={track.title}
                                        cardVariant="pale"
                                        badges={track.badges}
                                        title={track.title}
                                        description={track.description}
                                        instructor={track.instructor}
                                        imageSrc={
                                            track.imageSrc ?? MENTOR_IMAGE
                                        }
                                        imageAlt={track.imageAlt}
                                        productImages={track.productImages}
                                        className="w-full"
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
