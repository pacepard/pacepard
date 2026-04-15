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
    productImages: { src: string; alt?: string }[];
    /** Bottom stripe only (Live badge is always yellow in the card component). */
    stripeColor: string;
};

/**
 * Columns left-to-right match the masonry reference: two cards per column.
 * Stagger (xl+) approximates waterfall offsets — col 1 lowest, col 2 near top, 3 mid, 4 slightly below 3.
 */
const TRACK_COLUMNS: TrackEntry[][] = [
    [
        {
            badges: [
                { label: 'AI', variant: 'ai' },
                { label: 'Live', variant: 'live' },
            ],
            title: 'Technical Product Management',
            description:
                'Learn how to use AI-native product skills  to test concepts, validate assumptions, and ship better products faster.',
            instructor: 'With apprenticeships on:',
            imageSrc: '/blocks/damola.png',
            imageAlt: 'Ravi Mehta',
            productImages: [
                { src: '/blocks/cal.avif', alt: 'Cal.com' },
                { src: '/logos/anything-llm.png', alt: 'AnythingLLM' },
                { src: '/logos/posthog.png', alt: 'PostHog' },
                { src: '/logos/excalidraw.png', alt: 'Excalidraw' },
            ],
            stripeColor: '#475569',
        },
        {
            badges: [
                { label: 'AI', variant: 'ai' },
            ],
            title: 'AI Productivity',
            description:
                'Adopt AI workflows that compound: research, specs, and delivery habits that save hours every week.',
                instructor: 'With workflows on:',
            imageSrc: '/blocks/damola-me.png',
            imageAlt: 'Jenny Wanger',
            productImages: [
                { src: '/logos/n8n.png', alt: 'N8N' },
                { src: '/logos/claude.png', alt: 'Claude' },
                { src: '/logos/notion.png', alt: 'Notion' },
                { src: '/logos/cursor.png', alt: 'Cursor' },
            ],
            stripeColor: '#7dd3fc',
        },
    ],
    [
        {
            badges: [
                { label: 'AI', variant: 'ai' },
            ],
            title: 'AI-Native Foundations',
            description:
                'Learn the 0 to 1, the building blocks of everything from foundation models to multi agent systems.',
            instructor: 'With workflows on:',
            imageSrc: '/blocks/dml.png',
            imageAlt: 'Damola Oladipo',
            productImages: [
                { src: '/logos/claude.png', alt: 'Claude' },
                { src: '/logos/anything-llm.png', alt: 'AnythingLLM' },
                { src: '/logos/warp.png', alt: 'Warp' },
                { src: '/logos/cmux.png', alt: 'Cmux' },
            ],
            stripeColor: '#a78bfa',
        },
        {
            badges: [
                { label: 'AI', variant: 'ai' },
                { label: 'Live', variant: 'live' },
            ],
            title: 'Data & Machine Learning',
            description:
                'Get value from your data with AI upskilling. Drive business growth. Create data-empowered teams. Fix your data skills gap. For good.',
            instructor: 'With apprenticeships on:',
            imageSrc: '/blocks/madebydam.png',
            imageAlt: 'Fareed Mosavat and Elena Verna',
            productImages: [
                { src: '/logos/anything-llm.png', alt: 'AnythingLLM' },
                { src: '/logos/listmonk.png', alt: 'Listmonk' },
                { src: '/logos/supabase.png', alt: 'Supabase' },
                { src: '/logos/cmux.png', alt: 'Cmux' },
            ],
            stripeColor: '#fb923c',
        },
    ],
    [
        {
            badges: [
                { label: 'AI', variant: 'ai' },
                { label: 'Live', variant: 'live' },
            ],
            title: 'AI Software Engineering',
            description:
                'Engineering for the AI era. Develop the product mindset and systems-thinking skills you need to ship secure, reliable software - faster.',
            instructor: 'With apprenticeships on:',
            imageSrc: '/blocks/eng.png',
            imageAlt: 'Brian Balfour',
            productImages: [
                { src: '/logos/brave.png', alt: 'Brave' },
                { src: '/logos/opencode.png', alt: 'OpenCode' },
                { src: '/logos/tauri.png', alt: 'Tauri' },
                { src: '/logos/cmux.png', alt: 'Cmux' },
            ],
            stripeColor: '#2dd4bf',
        },
        {
            badges: [
                { label: 'AI', variant: 'ai' },
                { label: 'Live', variant: 'live' },
            ],
            title: 'Growth Engineering',
            description:
                'Master the levers, flywheels, cold start, and retention loops so growth compounds instead of stalling at scale.',
            instructor: 'With apprenticeships on:',
            imageSrc: '/blocks/damolapic.png',
            imageAlt: 'Anand Subramani and Alex Allain',
            productImages: [
                { src: '/logos/posthog.png', alt: 'PostHog' },
                { src: '/logos/supabase.png', alt: 'Supabase' },
                { src: '/logos/listmonk.png', alt: 'Listmonk' },
            ],
            stripeColor: '#f472b6',
        },
    ],
    [
        {
            badges: [{ label: 'AI', variant: 'ai' }],
            title: 'AI for Business Value',
            description:
                'Build reliable business-AI operating rhythms, align teams on outcomes, and AI tradeoffs that shape what you can ship.',
            instructor: 'With workflows on:',
            imageSrc: '/blocks/learner.png',
            imageAlt: 'Sachin Rekhi',
            productImages: [
                { src: '/logos/anything-llm.png', alt: 'AnythingLLM' },
                { src: '/logos/claude.png', alt: 'Claude' },
                { src: '/logos/cursor.png', alt: 'Cursor' },
                { src: '/logos/n8n.png', alt: 'N8N' },
            ],
            stripeColor: '#4ade80',
        },
        {
            badges: [
                { label: 'AI', variant: 'ai' },
                { label: 'Live', variant: 'live' },
            ],
            title: 'Applied Product Design',
            description:
                'Design human-AI-centric experiences and products.  Create interactions and flows for prompts, responses, and agent behavior. ',
            instructor: 'With apprenticeships on:',
            imageSrc: '/blocks/collective.png',
            imageAlt: 'Instructors',
            productImages: [
                { src: '/logos/warp.png', alt: 'Warp' },
                { src: '/logos/cmux.png', alt: 'Cmux' },
                { src: '/logos/void.png', alt: 'Void' },
            ],
            stripeColor: '#c4b5fd',
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
        <section className="bg-neutral-200">
            <div className="py-20 md:py-24">
                <div className="mx-auto w-full min-w-8xl max-w-8xl px-6">
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
                                        stripeColor={track.stripeColor}
                                        className="w-full rounded-lg"
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
