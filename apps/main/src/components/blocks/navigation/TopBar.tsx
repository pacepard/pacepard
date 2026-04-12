import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@pacepard/ui/components/button';
import { cn } from '@pacepard/ui/lib/utils';
import { ArrowLeft, ChevronsLeft } from 'lucide-react';
import { useSidebar } from '@pacepard/ui/components/sidebar';

interface TopBarProps {
    pageTitle?: string;
    showBack?: boolean;
    sticky?: boolean;
}

const TopBar = ({
    pageTitle,
    showBack = false,
    sticky = true,
}: TopBarProps) => {
    const navigate = useNavigate();
    const { toggleSidebar, open } = useSidebar();

    const handleGoBack = () => {
        navigate(-1);
    };

    const topBarClasses = cn(
        'w-full h-20 max-h-20 border-b border-border bg-background',
        sticky && 'sticky top-0 z-[800]',
    );

    const wrapperClasses =
        'w-full h-full max-h-full flex items-center px-4 py-0';

    return (
        <div className={topBarClasses}>
            <div className={wrapperClasses}>
                <div className="flex items-center gap-2">
                    {/* Sidebar Toggle - Always visible */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="h-9 w-9"
                        title={open ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        <ChevronsLeft
                            className={cn(
                                'h-4 w-4 transition-transform duration-200',
                                !open && 'rotate-180', // When collapsed, rotate to point right (>>) to expand
                            )}
                        />
                    </Button>

                    {/* Back Button - Only on sub-routes */}
                    {showBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleGoBack}
                            className="h-9 w-9 bg-green-100 rounded-full"
                            title="Go back"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}

                    {/* Page Title */}
                    {pageTitle && (
                        <h3 className="text-lg font-semibold text-foreground ml-2">
                            {pageTitle}
                        </h3>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
