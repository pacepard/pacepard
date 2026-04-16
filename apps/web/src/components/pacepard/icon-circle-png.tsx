'use client';

import Image from 'next/image';

import { cn } from '@pacepard/ui/lib/utils';

/** Icon paths and `pickIconAt` live in `./pacepard-icon-paths` (no `'use client'`) for RSC-safe imports. */

export type IconCirclePngProps = {
    src: string;
    alt: string;
    /** Circle fill when not using Tailwind `bgClassName` (e.g. hex accents). */
    backgroundColor?: string;
    /** Tailwind background on the circle (e.g. `bg-blue-500`). */
    bgClassName?: string;
    className?: string;
    /** Override outer circle size (default `size-10`). */
    circleClassName?: string;
    /** Pixel size for the inner PNG (default 22; fits the white inset inside `size-10`). */
    imageSize?: number;
};

export function IconCirclePng({
    src,
    alt,
    backgroundColor,
    bgClassName,
    className,
    circleClassName,
    imageSize = 32,
}: IconCirclePngProps) {
    return (
        <span
            className={cn(
                'relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full',
                bgClassName,
                className,
                circleClassName,
            )}
            style={
                bgClassName || !backgroundColor
                    ? undefined
                    : { backgroundColor }
            }
        >
            <span
                className="pointer-events-none absolute inset-1 rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.08)]"
                aria-hidden
            />
            <Image
                src={src}
                alt={alt}
                width={imageSize}
                height={imageSize}
                className="relative z-[1] object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)]"
            />
        </span>
    );
}
