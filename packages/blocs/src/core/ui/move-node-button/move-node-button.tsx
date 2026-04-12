import { forwardRef, useCallback } from 'react';

// --- Lib ---
import { parseShortcutKeys } from '@/utils/base-helper';

// --- Hooks ---
import { usePacepardEditor } from '@/hooks/use-pacepard-editor';

// --- Tiptap UI ---
import type { UseMoveNodeConfig } from '@/core/ui/move-node-button';
import { useMoveNode } from '@/core/ui/move-node-button';

// --- UI Primitives ---
import type { ButtonProps } from '@/core/primitives/button';
import { Button } from '@/core/primitives/button';
import { Badge } from '@/core/primitives/badge';

export interface MoveNodeButtonProps
    extends Omit<ButtonProps, 'type'>, UseMoveNodeConfig {
    /**
     * Optional text to display alongside the icon.
     */
    text?: string;
    /**
     * Optional show shortcut keys in the button.
     * @default false
     */
    showShortcut?: boolean;
}

export function MoveNodeShortcutBadge({
    shortcutKeys,
}: {
    shortcutKeys: string;
}) {
    return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for moving a node up or down in a Tiptap editor.
 */
export const MoveNodeButton = forwardRef<
    HTMLButtonElement,
    MoveNodeButtonProps
>(
    (
        {
            editor: providedEditor,
            text,
            direction,
            hideWhenUnavailable = false,
            onMoved,
            showShortcut = false,
            onClick,
            children,
            ...buttonProps
        },
        ref,
    ) => {
        const { editor } = usePacepardEditor(providedEditor);
        const {
            isVisible,
            handleMoveNode,
            canMoveNode,
            label,
            shortcutKeys,
            Icon,
        } = useMoveNode({
            editor,
            direction,
            hideWhenUnavailable,
            onMoved,
        });

        const handleClick = useCallback(
            (event: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                handleMoveNode();
            },
            [handleMoveNode, onClick],
        );

        if (!isVisible) {
            return null;
        }

        const tooltip = direction === 'up' ? 'Move Up' : 'Move Down';

        return (
            <Button
                type="button"
                data-style="ghost"
                role="button"
                tabIndex={-1}
                aria-label={label}
                tooltip={tooltip}
                disabled={!canMoveNode}
                onClick={handleClick}
                {...buttonProps}
                ref={ref}
            >
                {children ?? (
                    <>
                        <Icon className="tiptap-button-icon" />
                        {text && (
                            <span className="tiptap-button-text">{text}</span>
                        )}
                        {showShortcut && (
                            <MoveNodeShortcutBadge
                                shortcutKeys={shortcutKeys}
                            />
                        )}
                    </>
                )}
            </Button>
        );
    },
);

MoveNodeButton.displayName = 'MoveNodeButton';
