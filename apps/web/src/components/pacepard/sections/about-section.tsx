"use client";

import { useRef } from "react";

import { ABOUT_SECTION_HEADLINE } from "@/_data/pacepard/about";
import { TimelineContent } from "@/components/ui/timeline-animation";

export default function AboutSection() {
    const heroRef = useRef<HTMLDivElement>(null);

    // Animation variants are structural/component logic, so they remain here.
    const revealVariants = {
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 1.5,
                duration: 0.7,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            y: 40,
            opacity: 0,
        },
    };
    const textVariants = {
        visible: (i: number) => ({
            filter: "blur(0px)",
            opacity: 1,
            transition: {
                delay: i * 0.3,
                duration: 0.7,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            opacity: 0,
        },
    };

    return (
        <section className="py-20 md:py-32 px-4 bg-secondary dark:bg-yellow-100 mt-20 overflow-hidden ">
            <div className="max-w-5xl mx-auto" ref={heroRef}>
                <div className="flex flex-col lg:flex-row items-start gap-8">
                    {/* Right side - Content */}
                    <div className="flex-1">
                        {/* Main H1 container that wraps all content */}
                        <TimelineContent
                            as="h1"
                            animationNum={0}
                            timelineRef={heroRef}
                            customVariants={revealVariants}
                            className="text-4xl md:text-5xl !leading-[110%] font-semibold text-gray-900 mb-8"
                        >
                            {ABOUT_SECTION_HEADLINE.map((segment, index) => {
                                // Determine which animation variants to use
                                const variantsToUse = segment.isHighlighted ? textVariants : revealVariants;
                                
                                // The initial animationNum for the whole block is 0. 
                                // We use the segment's defined animationNum for highlighted words (1, 2, 3), 
                                // and fallback to the container's 0 for continuous text.
                                const animationIndex = segment.isHighlighted ? segment.animationNum : 0;

                                return (
                                    <TimelineContent
                                        key={index}
                                        as={segment.as as keyof HTMLElementTagNameMap}
                                        animationNum={animationIndex as number}
                                        timelineRef={heroRef}
                                        customVariants={variantsToUse}
                                        className={segment.className}
                                    >
                                        {segment.text}
                                    </TimelineContent>
                                );
                            })}
                        </TimelineContent>
                    </div>
                </div>
            </div>
        </section>
    );
}
