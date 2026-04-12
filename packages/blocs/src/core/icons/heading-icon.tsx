import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

/**
 * Heading/title icon (Lucide "heading" style): for Title block.
 */
export const HeadingIcon = memo(({ className, ...props }: SvgProps) => {
    return (
        <svg
            width="24"
            height="24"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M6 4v16" />
            <path d="M18 4v16" />
            <path d="M6 12h12" />
        </svg>
    );
});

HeadingIcon.displayName = 'HeadingIcon';
