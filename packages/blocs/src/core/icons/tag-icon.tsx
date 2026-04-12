import { memo } from 'react';

type SvgProps = React.ComponentPropsWithoutRef<'svg'>;

/**
 * Tag/label icon (Lucide "tag" style): for Label block.
 */
export const TagIcon = memo(({ className, ...props }: SvgProps) => {
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
            <path d="M12 2H2v10l9.244 9.244a1.5 1.5 0 0 0 2.122 0L22 12.244V2H12Z" />
            <path d="M7 7h.01" />
        </svg>
    );
});

TagIcon.displayName = 'TagIcon';
