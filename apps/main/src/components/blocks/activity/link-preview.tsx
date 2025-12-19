import React from 'react';
import { Sparkle } from '@phosphor-icons/react';
import { cn } from '@pacepard/ui/lib/utils';

interface LinkPreviewProps {
    title?: string;
    subtitle?: string;
    description?: string;
    onCustomizeClick?: () => void;
    className?: string;
}

export function LinkPreview({
    title = 'Pacepard Hackathons',
    subtitle = 'Hack Ogbomoso by Ennovate Lab',
    description = 'Made with Pacepard, run memorable hackathons for free.',
    onCustomizeClick,
    className,
}: LinkPreviewProps) {
    return (
        <div className={cn('space-y-4', className)}>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                    Link Preview
                </h2>
                <p className="text-sm text-muted-foreground">
                    When you share a link, it will embed with a preview similar
                    to the one below on social media, messaging apps, and search
                    engines.
                </p>
            </div>

            <button
                onClick={onCustomizeClick}
                className="text-sm text-primary hover:underline"
            >
                Customize
            </button>

            <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <Sparkle
                                weight="fill"
                                className="size-5 text-yellow-500"
                            />
                            <Sparkle
                                weight="fill"
                                className="size-5 text-yellow-500"
                            />
                        </div>
                        <h3 className="text-base font-semibold text-card-foreground">
                            {title}
                        </h3>
                    </div>

                    <p className="text-sm text-muted-foreground">{subtitle}</p>

                    <p className="text-sm text-card-foreground">{description}</p>

                    <div className="flex items-center gap-2 pt-2">
                        <div className="size-2 rounded-full bg-muted-foreground/30" />
                        <div className="size-2 rounded-full bg-muted-foreground/30" />
                        <div className="size-2 rounded-full bg-muted-foreground/30" />
                    </div>
                </div>
            </div>
        </div>
    );
}
