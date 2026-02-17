'use client';

import React from 'react';
import { cn } from '@pacepard/ui/lib/utils';

const VIDEO_SRC = '/blocks/agent.mp4';

export default function Separator() {
    return (
        <section
            className={cn(
                'w-full py-20',
                'bg-background',
            )}
        >
                <div className="relative overflow-hidden ">
                    <video
                        src={VIDEO_SRC}
                        className=" aspect-video"
                        autoPlay
                        playsInline
                        preload="metadata"
                        aria-label="Agent demonstration video"
                    >
                        <track kind="captions" />
                    </video>
                </div>
        </section>
    );
}
