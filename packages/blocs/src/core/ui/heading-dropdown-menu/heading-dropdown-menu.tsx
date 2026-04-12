import { forwardRef, useCallback, useState } from 'react';

// --- Icons ---
import { ChevronDownIcon } from '@/core/icons/chevron-down-icon';

// --- Hooks ---
import { usePacepardEditor } from '@/hooks/use-pacepard-editor';

// --- Tiptap UI ---
import { HeadingButton } from '@/core/ui/heading-button';
import type { UseHeadingDropdownMenuConfig } from '@/core/ui/heading-dropdown-menu';
import { useHeadingDropdownMenu } from '@/core/ui/heading-dropdown-menu';

// --- UI Primitives ---
import type { ButtonProps } from '@/core/primitives/button';
import { Button, ButtonGroup } from '@/core/primitives/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/core/primitives/dropdown-menu';
import { Card, CardBody } from '@/core/primitives/card';

export interface HeadingDropdownMenuProps
    extends Omit<ButtonProps, 'type'>, UseHeadingDropdownMenuConfig {
    /**
     * Whether to render the dropdown menu in a portal
     * @default false
     */
    portal?: boolean;
    /**
     * Callback for when the dropdown opens or closes
     */
    onOpenChange?: (isOpen: boolean) => void;
}

/**
 * Dropdown menu component for selecting heading levels in a Tiptap editor.
 *
 * For custom dropdown implementations, use the `useHeadingDropdownMenu` hook instead.
 */
export const HeadingDropdownMenu = forwardRef<
    HTMLButtonElement,
    HeadingDropdownMenuProps
>(
    (
        {
            editor: providedEditor,
            levels = [1, 2, 3, 4, 5, 6],
            hideWhenUnavailable = false,
            portal = false,
            onOpenChange,
            ...buttonProps
        },
        ref,
    ) => {
        const { editor } = usePacepardEditor(providedEditor);
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const { isVisible, isActive, canToggle, Icon } = useHeadingDropdownMenu(
            {
                editor,
                levels,
                hideWhenUnavailable,
            },
        );

        const handleOpenChange = useCallback(
            (open: boolean) => {
                if (!editor || !canToggle) return;
                setIsOpen(open);
                onOpenChange?.(open);
            },
            [canToggle, editor, onOpenChange],
        );

        if (!isVisible) {
            return null;
        }

        return (
            <DropdownMenu modal open={isOpen} onOpenChange={handleOpenChange}>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        data-style="ghost"
                        data-active-state={isActive ? 'on' : 'off'}
                        role="button"
                        tabIndex={-1}
                        disabled={!canToggle}
                        data-disabled={!canToggle}
                        aria-label="Format text as heading"
                        aria-pressed={isActive}
                        tooltip="Heading"
                        {...buttonProps}
                        ref={ref}
                    >
                        <Icon className="tiptap-button-icon" />
                        <ChevronDownIcon className="tiptap-button-dropdown-small" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" portal={portal}>
                    <Card>
                        <CardBody>
                            <ButtonGroup>
                                {levels.map((level) => (
                                    <DropdownMenuItem
                                        key={`heading-${level}`}
                                        asChild
                                    >
                                        <HeadingButton
                                            editor={editor}
                                            level={level}
                                            text={`Heading ${level}`}
                                            showTooltip={false}
                                        />
                                    </DropdownMenuItem>
                                ))}
                            </ButtonGroup>
                        </CardBody>
                    </Card>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
);

HeadingDropdownMenu.displayName = 'HeadingDropdownMenu';

export default HeadingDropdownMenu;
