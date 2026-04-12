'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Slider, { Settings } from 'react-slick';

// Slider styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Team = (props: { teamdataNumber: string }) => {
    const { teamdataNumber } = props;
    const [teamData, setTeamData] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const fetchData = async () => {
            try {
                const res = await fetch('/api/page-data');
                const data = await res.json();
                setTeamData(data?.teamData);
            } catch (error) {
                console.error('Error fetching team data:', error);
            }
        };
        fetchData();
    }, []);

    const settings: Settings = {
        dots: true,
        infinite: (teamData?.data?.length || 0) > 4,
        speed: 500,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false,
        slidesToShow: 4,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 4 } },
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } },
        ],
    };

    if (!isMounted) return null;

    return (
        <section className="dark:bg-darkblack py-20 md:py-40 overflow-hidden">
            {/* 1. INJECT CUSTOM CSS TO LOCK WIDTH ON MOBILE */}
            <style jsx global>{`
                @media (max-width: 640px) {
                    .team-slider-wrapper .slick-slide {
                        width: 100vw !important; /* Force full width on mobile regardless of JS */
                    }
                    .team-slider-wrapper .slick-track {
                        display: flex !important;
                        align-items: flex-start !important;
                    }
                }
            `}</style>

            <div className="container mx-auto">
                {/* Header */}
                <div className="flex flex-col xl:flex-row items-start gap-8 mb-12 px-4">
                    <div className="flex items-center py-3 gap-4 md:gap-8 w-full max-w-xl">
                        <span className="bg-primary dark:text-secondary py-1.5 px-2.5 text-sm md:text-base rounded-full">
                            {teamdataNumber || teamData?.number || '01'}
                        </span>
                        <div className="h-px w-16 bg-black/12 dark:bg-white/12" />
                        <p className="section-bedge py-1.5 px-4 rounded-full">
                            The team
                        </p>
                    </div>
                    <h2 className="text-5xl sm:text-6xl font-black leading-[1.1] tracking-tight">
                        Meet our team
                    </h2>
                </div>

                {/* 2. SLIDER WRAPPER */}
                <div className="team-slider-wrapper w-full">
                    {teamData?.data ? (
                        <Slider {...settings}>
                            {teamData.data.map((item: any, index: number) => (
                                <div key={index} className="outline-none">
                                    {/* Padding inside the child to keep distance between slides */}
                                    <div className="group flex flex-col gap-4 items-center px-4">
                                        {/* Square Image */}
                                        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900">
                                            <Image
                                                src={item?.image}
                                                alt={item?.name || 'Member'}
                                                fill
                                                sizes="(max-width: 640px) 100vw, 25vw"
                                                className="object-cover"
                                                priority={index === 0}
                                            />
                                            <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                                                <div className="flex gap-3">
                                                    {item?.socialLinks?.map(
                                                        (
                                                            social: any,
                                                            idx: number,
                                                        ) => (
                                                            <a
                                                                key={idx}
                                                                href={
                                                                    social.link
                                                                }
                                                                className="bg-white p-2.5 rounded-full"
                                                            >
                                                                <Image
                                                                    src={
                                                                        social.icon
                                                                    }
                                                                    alt="icon"
                                                                    width={18}
                                                                    height={18}
                                                                />
                                                            </a>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Text Area */}
                                        <div className="text-left w-full">
                                            <h4 className="font-normal text-xl sm:text-2xl truncate">
                                                {item?.name}
                                            </h4>
                                            <span className="block text-lg sm:text-xl text-secondary/70 dark:text-white/70 truncate">
                                                {item?.position}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div className="px-4">
                            {/* Skeleton that exactly matches the 1-card mobile view */}
                            <div className="w-full aspect-square bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Team;
