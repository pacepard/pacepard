import Image from 'next/image';

import { DashedLine } from '@/components/dashed-line';
import { cn } from '@pacepard/ui/lib/utils';

const topItems = [
    {
        title: 'Simple, customisable setup:',
        description:
            'Create challenges, register participants, and set timelines in minutes,  no complicated tools needed.',
        images: [
            {
                src: '/blocks/@reg.png',
                alt: 'Issue template interface',
                width: 495,
                height: 186,
            },
        ],
        className:
            'flex-1 [&>.title-container]:mb-5 md:[&>.title-container]:mb-8 xl:[&>.image-container]:translate-x-6 [&>.image-container]:translate-x-2',
        fade: [''],
    },
    {
        title: 'Reusable event templates:',
        description:
            'Draft challenges and hackathons with our smart instructions and templates. No need to start from scratch each time.',
        images: [
            {
                src: '/blocks/@marketing.png',
                alt: 'Graveyard interface',
                width: 3505,
                height: 680,
            },
        ],
        className:
            'flex-1 [&>.title-container]:mb-5 md:[&>.title-container]:mb-8 md:[&>.title-container]:translate-x-2 xl:[&>.title-container]:translate-x-4 [&>.title-container]:translate-x-0',
        fade: [],
    },
];

const bottomItems = [
    {
        title: 'Know what’s happening at every stage:',
        description:
            'Track everything from start to finish: who’s participating, what they’re building, and how projects are progressing.',
        images: [
            {
                src: '/blocks/@manage.png',
                alt: 'Graveyard interface',
                width: 3505,
                height: 680,
            },
        ],
        className:
            '[&>.title-container]:mb-5 md:[&>.title-container]:mb-8 xl:[&>.image-container]:translate-x-6 [&>.image-container]:translate-x-2',
        fade: ['bottom'],
    },
    {
        title: 'Knowledgebase for participants:',
        description:
            'Get participants up to speed quickly so they can create better projects and add real value to your product.',
        images: [
            {
                src: '/blocks/base.png',
                alt: 'Task discussions interface',
                width: 320,
                height: 103,
            },
        ],
        className:
            'justify-normal [&>.title-container]:mb-5 md:[&>.title-container]:mb-0 [&>.image-container]:flex-1 md:[&>.image-container]:place-items-center md:[&>.image-container]:-translate-y-3',
        fade: [''],
    },
    {
        title: 'Friendly Feedback Channels:',
        description:
            'Integrate channels for continuous feedback and insights from participants.',
        images: [
            {
                src: '/blocks/feedback.png',
                alt: 'Notifications interface',
                width: 305,
                height: 280,
            },
        ],
        className:
            '[&>.title-container]:mb-5 md:[&>.title-container]:mb-8 xl:[&>.image-container]:translate-x-6 [&>.image-container]:translate-x-2',
        fade: ['bottom'],
    },
];

const GoUsecase = () => {
    return (
        <section
            id="resource-allocation"
            className="overflow-hidden pb-28 lg:pb-32"
        >
            <div className="">
                <h2 className="container text-left text-4xl font-regular tracking-tight text-balance text-foreground md:text-center md:text-5xl lg:text-6xl">
                    Everything you need to run the best hackathons.
                </h2>

                <div className="mt-8 md:mt-12 lg:mt-20">
                    <DashedLine
                        orientation="horizontal"
                        className="container scale-x-105"
                    />

                    {/* Top Features Grid - 2 items */}
                    <div className="relative container flex max-md:flex-col">
                        {topItems.map((item, i) => (
                            <Item
                                key={i}
                                item={item}
                                isLast={i === topItems.length - 1}
                            />
                        ))}
                    </div>
                    <DashedLine
                        orientation="horizontal"
                        className="container max-w-7xl scale-x-110"
                    />

                    {/* Bottom Features Grid - 3 items */}
                    <div className="relative container grid max-w-7xl md:grid-cols-3">
                        {bottomItems.map((item, i) => (
                            <Item
                                key={i}
                                item={item}
                                isLast={i === bottomItems.length - 1}
                                className="md:pb-0"
                            />
                        ))}
                    </div>
                </div>
                <DashedLine
                    orientation="horizontal"
                    className="container max-w-7xl scale-x-110"
                />
            </div>
        </section>
    );
};

interface ItemProps {
    item: (typeof topItems)[number] | (typeof bottomItems)[number];
    isLast?: boolean;
    className?: string;
}

const Item = ({ item, isLast, className }: ItemProps) => {
    return (
        <div
            className={cn(
                'relative flex flex-col justify-between px-0 py-6 md:px-6 md:py-8',
                className,
                item.className,
            )}
        >
            <div className="title-container text-balance">
                <h3 className="inline text-lg font-medium text-foreground">
                    {item.title}{' '}
                </h3>
                <span className="text-lg leading-relaxed text-muted-foreground">
                    {' '}
                    {item.description}
                </span>
            </div>

            {item.fade.includes('bottom') && (
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-muted/80 via-transparent to-transparent md:hidden" />
            )}
            {item.images.length > 4 ? (
                <div className="relative overflow-hidden">
                    <div className="flex flex-col gap-5">
                        {/* First row - right aligned */}
                        <div className="flex translate-x-4 justify-end gap-5">
                            {item.images.slice(0, 4).map((image, j) => (
                                <div
                                    key={j}
                                    className="bg-background grid aspect-square size-16 place-items-center rounded-2xl p-2 lg:size-20"
                                >
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        width={image.width}
                                        height={image.height}
                                        className="object-contain object-left-top"
                                    />
                                    <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-muted/80 to-transparent" />
                                </div>
                            ))}
                        </div>
                        {/* Second row - left aligned */}
                        <div className="flex -translate-x-4 gap-5">
                            {item.images.slice(4).map((image, j) => (
                                <div
                                    key={j}
                                    className="bg-background grid aspect-square size-16 place-items-center rounded-2xl lg:size-20"
                                >
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        width={image.width}
                                        height={image.height}
                                        className="object-contain object-left-top"
                                    />
                                    <div className="absolute inset-y-0 bottom-0 left-0 z-10 w-14 bg-gradient-to-r from-muted to-transparent" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="image-container grid grid-cols-1 gap-4">
                    {item.images.map((image, j) => (
                        <Image
                            key={j}
                            src={image.src}
                            alt={image.alt}
                            width={image.width}
                            height={image.height}
                            className="object-contain object-left-top"
                        />
                    ))}
                </div>
            )}

            {!isLast && (
                <>
                    <DashedLine
                        orientation="vertical"
                        className="absolute top-0 right-0 max-md:hidden"
                    />
                    <DashedLine
                        orientation="horizontal"
                        className="absolute inset-x-0 bottom-0 md:hidden"
                    />
                </>
            )}
        </div>
    );
};

export default GoUsecase;
