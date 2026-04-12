import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@pacepard/ui/components/button';
import { Plus } from 'lucide-react';
import PacepardLogo from '@/components/common/Logo';
import { cn } from '@pacepard/ui/lib/utils';

/**
 * Illustration: wireframe of a dashboard/list view with Pacepard header and 5 list rows.
 * Stylized document icons and placeholder lines in grayscale to match the empty-state design.
 */
const DashboardIllustration = () => {
    return (
        <div
            className={cn(
                'w-full max-w-[320px] mx-auto rounded-xl overflow-hidden',
                'bg-white dark:bg-muted/20',
                'border border-border/70 shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
                'ring-[1px] ring-black/[0.04] dark:ring-white/[0.04]',
            )}
            aria-hidden
        >
            {/* Header: logo + "Pacepard" — simulates app header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/80 bg-[#FAFAFA] dark:bg-muted/40">
                <div className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center opacity-90">
                    <PacepardLogo
                        width={20}
                        height={20}
                        className="opacity-80"
                    />
                </div>
                <span className="text-sm font-medium text-[#374151] dark:text-foreground/90 tracking-tight">
                    Pacepard
                </span>
            </div>
            {/* List body: 5 rows — wireframe list items */}
            <div className="p-3.5 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 py-1">
                        {/* Document/file icon — folded corner style */}
                        <div className="flex-shrink-0 w-9 h-9 rounded-md border border-[#E5E7EB] dark:border-border/80 bg-[#F3F4F6] dark:bg-muted/60 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-r border-t border-[#D1D5DB] dark:border-border rounded-tr-[2px]" />
                            <div className="w-3 h-3.5 rounded-[2px] border border-[#9CA3AF] dark:border-foreground/30 bg-[#E5E7EB] dark:bg-foreground/10 ml-0.5 -mt-0.5" />
                        </div>
                        {/* Title + subtitle placeholder lines */}
                        <div className="flex-1 min-w-0 space-y-2">
                            <div
                                className="h-2 rounded-sm bg-[#D1D5DB] dark:bg-foreground/25"
                                style={{ width: `${72 + (i % 3) * 8}%` }}
                            />
                            <div
                                className="h-1.5 rounded-sm bg-[#E5E7EB] dark:bg-foreground/15"
                                style={{ width: `${50 + (i % 2) * 15}%` }}
                            />
                        </div>
                        {/* Right: two short lines (data/status columns) */}
                        <div className="flex-shrink-0 flex flex-col gap-1.5 items-end">
                            <div className="h-1.5 rounded-sm bg-[#E5E7EB] dark:bg-foreground/15 w-7" />
                            <div className="h-1.5 rounded-sm bg-[#E5E7EB] dark:bg-foreground/15 w-10" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BusinessHackathonEmptyState = () => {
    const navigate = useNavigate();

    const handleNewHackathon = () => {
        navigate('/hackathon/create');
    };

    return (
        <div
            className={cn(
                'min-h-[calc(100vh-8rem)] flex items-center justify-center',
                'bg-[#F7F7F7] dark:bg-muted/40',
                'rounded-2xl sm:rounded-3xl',
                'px-4 py-10 sm:py-14',
            )}
        >
            <div
                className={cn(
                    'w-full max-w-lg',
                    'bg-background rounded-xl sm:rounded-2xl',
                    'shadow-sm border border-border/50',
                    'px-6 py-8 sm:px-10 sm:py-12',
                    'flex flex-col items-center text-center',
                    'space-y-8',
                )}
            >
                {/* Illustration */}
                <div className="w-full flex justify-center">
                    <DashboardIllustration />
                </div>

                {/* Heading */}
                <div className="space-y-3">
                    <h1
                        className={cn(
                            'text-2xl sm:text-3xl font-bold tracking-tight',
                            'text-[#333333] dark:text-foreground',
                            'leading-tight',
                        )}
                    >
                        Your hackathon journey starts here
                    </h1>
                    <p
                        className={cn(
                            'text-base sm:text-lg text-[#666666] dark:text-muted-foreground',
                            'max-w-md mx-auto leading-relaxed',
                        )}
                    >
                        Create your first hackathon to start accepting projects,
                        managing teams, and tracking progress in one place.
                    </p>
                </div>

                {/* CTA Button */}
                <Button
                    onClick={handleNewHackathon}
                    size="lg"
                    className={cn(
                        'rounded-lg px-6 py-6 h-auto',
                        'bg-[#343A40] hover:bg-[#2c3136] dark:bg-foreground dark:hover:bg-foreground/90',
                        'text-white font-medium',
                        'inline-flex items-center gap-2.5',
                        'shadow-sm border border-[#2c3136]/50 dark:border-transparent',
                    )}
                >
                    <span
                        className={cn(
                            'flex items-center justify-center w-7 h-7 rounded-full',
                            'bg-white/20 dark:bg-white/20',
                            'text-white',
                        )}
                        aria-hidden
                    >
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                    </span>
                    New hackathon
                </Button>
            </div>
        </div>
    );
};

export default BusinessHackathonEmptyState;
