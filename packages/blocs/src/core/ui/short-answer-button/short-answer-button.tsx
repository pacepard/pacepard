import { forwardRef, useCallback } from 'react';

// --- Hooks ---
import { usePacepardEditor } from '@/hooks/use-pacepard-editor';

// --- Tiptap UI ---
import type { UseShortAnswerConfig } from './use-short-answer';
import { useShortAnswer } from './use-short-answer';

// --- UI Primitives ---
import type { ButtonProps } from '@/core/primitives/button';
import { Button } from '@/core/primitives/button';

export interface ShortAnswerButtonProps
    extends Omit<ButtonProps, 'type'>, UseShortAnswerConfig {
    text?: string;
}

/**
 * Button component for turning the current block into a short answer in a Tiptap editor.
 * For custom implementations, use the `useShortAnswer` hook instead.
 */
export const ShortAnswerButton = forwardRef<
    HTMLButtonElement,
    ShortAnswerButtonProps
>(
    (
        {
            editor: providedEditor,
            text,
            hideWhenUnavailable = false,
            onToggled,
            onClick,
            children,
            ...buttonProps
        },
        ref,
    ) => {
        const { editor } = usePacepardEditor(providedEditor);
        const { isVisible, isActive, canToggle, handleToggle, label, Icon } =
            useShortAnswer({
                editor,
                hideWhenUnavailable,
                onToggled,
            });

        const handleClick = useCallback(
            (event: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                handleToggle();
            },
            [handleToggle, onClick],
        );

        if (!isVisible) return null;

        return (
            <Button
                type="button"
                data-style="ghost"
                data-active-state={isActive ? 'on' : 'off'}
                role="button"
                tabIndex={-1}
                disabled={!canToggle}
                data-disabled={!canToggle}
                aria-label={label}
                tooltip={label}
                onClick={handleClick}
                {...buttonProps}
                ref={ref}
            >
                {children ?? (
                    <>
                        <Icon className="tiptap-button-icon" />
                        {(text ?? label) && (
                            <span className="tiptap-button-text">
                                {text ?? label}
                            </span>
                        )}
                    </>
                )}
            </Button>
        );
    },
);

ShortAnswerButton.displayName = 'ShortAnswerButton';
