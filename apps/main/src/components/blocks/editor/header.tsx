import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@pacepard/ui/components/button';
import { cn } from '@pacepard/ui/lib/utils';
import { ArrowLeft, ChevronsLeft, Settings, User } from 'lucide-react';
import { useSidebar } from '@pacepard/ui/components/sidebar';
import { Avatar, AvatarFallback } from '@pacepard/ui/components/avatar';
import { ThemeToggle } from './theme-toggle';

interface IEditorHeader {
    pageTitle?: string;
    showBack?: boolean;
    sticky?: boolean;
}

const EditorHeader = ({
    pageTitle = 'Wema bank Hacakthon 2026',
    showBack = false,
    sticky = true,
}: IEditorHeader) => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const topBarClasses = cn(
        'w-full h-14 max-h-14 border-b border-border bg-background',
        sticky && 'sticky top-0 z-[800]',
    );

    const wrapperClasses =
        'w-full h-full max-h-full flex items-center justify-between px-4 py-0';

    return (
        <div className={topBarClasses}>
            <div className={wrapperClasses}>
                {/* Left: sidebar toggle, back, title */}
                <div className="flex items-center gap-2">
                    {showBack && (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleGoBack}
                            className="h-8 gap-1.5 text-neutral-700 dark:text-neutral-200 bg-neutral-200/70 dark:bg-neutral-700/70 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-md"
                            title="Go back"
                        >
                            <ArrowLeft className="h-4 w-4 shrink-0" />
                            back
                        </Button>
                    )}
                    {pageTitle && (
                        <h3 className="text-lg font-semibold text-foreground ml-2">
                            {pageTitle}
                        </h3>
                    )}
                </div>

                {/* Right: Theme, Settings, Preview, Publish */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-foreground hover:bg-muted rounded-md gap-1.5"
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 bg-muted text-foreground hover:bg-muted/80 dark:hover:bg-neutral-600 rounded-md"
                    >
                        Preview
                    </Button>

                    <Button
                        size="sm"
                        className="bg-primary text-white dark:text-neutral-900   hover:bg-primary rounded-md px-4"
                    >
                        Publish
                    </Button>

                    {/* <Avatar className="h-8 w-8 border-2 border-white/20">
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar> */}
                </div>
            </div>
        </div>
    );
};

export default EditorHeader;
