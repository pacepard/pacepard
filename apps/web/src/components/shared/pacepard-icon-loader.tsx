import Image from 'next/image';

import { cn } from '@pacepard/ui/lib/utils';

export type PacepardIconLoaderProps = {
    className?: string;
    /** Pixel width and height (square). Default 48. */
    size?: number;
    /** Announced to assistive technology. */
    label?: string;
};

export function PacepardIconLoader({
    className,
    size = 48,
    label = 'Loading',
}: PacepardIconLoaderProps) {
    return (
        <div
            className={cn(
                'inline-flex flex-col items-center justify-center',
                className,
            )}
            role="status"
            aria-live="polite"
        >
            <span className="animate-pacepard-loader inline-flex will-change-transform">
                <Image
                    src="/blocks/pacepard-icon.svg"
                    alt=""
                    width={size}
                    height={size}
                    className="block select-none"
                    aria-hidden
                    priority
                />
            </span>
            <span className="sr-only">{label}</span>
        </div>
    );
}
