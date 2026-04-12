'use client';

import * as React from 'react';
import { cn } from '@/utils/base-helper';
import './required-badge.scss';

export interface RequiredBadgeProps {
    className?: string;
    title?: string;
}

/**
 * Reusable required indicator for inputs only: small circular badge with asterisk.
 * Position: top-right of the input, slightly outside the border (parent sets position).
 * Labels use a different treatment: inline asterisk after the text, not this badge.
 */
export const RequiredBadge = React.forwardRef<
    HTMLSpanElement,
    RequiredBadgeProps
>(({ className, title = 'Required', ...props }, ref) => (
    <span
        ref={ref}
        aria-hidden="true"
        className={cn('required-badge', className)}
        title={title}
        {...props}
    >
        *
    </span>
));
RequiredBadge.displayName = 'RequiredBadge';
