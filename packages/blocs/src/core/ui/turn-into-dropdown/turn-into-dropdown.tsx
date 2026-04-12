import { forwardRef } from 'react';

// --- Tiptap UI ---
import type { UseTurnIntoDropdownConfig } from '@/core/ui/turn-into-dropdown';
import {
    useTurnIntoDropdown,
    getFilteredBlockTypeOptions,
} from '@/core/ui/turn-into-dropdown';

// --- Hooks ---
import { usePacepardEditor } from '@/hooks/use-pacepard-editor';

// --- Tiptap UI Components ---
import { TextButton } from '@/core/ui/text-button';
import { HeadingButton } from '@/core/ui/heading-button';
import { ListButton } from '@/core/ui/list-button';
import { BlockquoteButton } from '@/core/ui/blockquote-button';
import { CodeBlockButton } from '@/core/ui/code-block-button';
import { ShortAnswerButton } from '@/core/ui/short-answer-button';

// --- UI Primitives ---
import type { ButtonProps } from '@/core/primitives/button';
import { Button, ButtonGroup } from '@/core/primitives/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/core/primitives/dropdown-menu';
import {
    Card,
    CardBody,
    CardGroupLabel,
    CardItemGroup,
} from '@/core/primitives/card';

export interface TurnIntoDropdownContentProps {
    blockTypes?: string[];
    useCardLayout?: boolean;
}

export const TurnIntoDropdownContent: React.FC<
    TurnIntoDropdownContentProps
> = ({ blockTypes, useCardLayout = true }) => {
    const filteredOptions = getFilteredBlockTypeOptions(blockTypes);

    const renderButtons = () => (
        <ButtonGroup>
            {filteredOptions.map((option, index) =>
                renderBlockTypeButton(
                    option,
                    `${option.type}-${option.level ?? index}`,
                ),
            )}
        </ButtonGroup>
    );

    if (!useCardLayout) return renderButtons();

    return (
        <Card>
            <CardBody>
                <CardItemGroup>
                    <CardGroupLabel>Turn into</CardGroupLabel>
                    {renderButtons()}
                </CardItemGroup>
            </CardBody>
        </Card>
    );
};

function renderBlockTypeButton(
    option: ReturnType<typeof getFilteredBlockTypeOptions>[0],
    key: string,
) {
    switch (option.type) {
        case 'paragraph':
            return (
                <DropdownMenuItem key={key} asChild>
                    <TextButton showTooltip={false} text={option.label} />
                </DropdownMenuItem>
            );

        case 'heading':
            if (!option.level) {
                return null;
            }

            return (
                <DropdownMenuItem key={key} asChild>
                    <HeadingButton
                        level={option.level || 1}
                        showTooltip={false}
                        text={option.label}
                    />
                </DropdownMenuItem>
            );

        case 'bulletList':
            return (
                <DropdownMenuItem key={key} asChild>
                    <ListButton
                        type="bulletList"
                        showTooltip={false}
                        text={option.label}
                    />
                </DropdownMenuItem>
            );

        case 'orderedList':
            return (
                <DropdownMenuItem key={key} asChild>
                    <ListButton
                        type="orderedList"
                        showTooltip={false}
                        text={option.label}
                    />
                </DropdownMenuItem>
            );

        case 'taskList':
            return (
                <DropdownMenuItem key={key} asChild>
                    <ListButton
                        type="taskList"
                        showTooltip={false}
                        text={option.label}
                    />
                </DropdownMenuItem>
            );

        case 'blockquote':
            return (
                <DropdownMenuItem key={key} asChild>
                    <BlockquoteButton showTooltip={false} text={option.label} />
                </DropdownMenuItem>
            );

        case 'codeBlock':
            return (
                <DropdownMenuItem key={key} asChild>
                    <CodeBlockButton showTooltip={false} text={option.label} />
                </DropdownMenuItem>
            );

        case 'shortAnswer':
            return (
                <DropdownMenuItem key={key} asChild>
                    <ShortAnswerButton
                        showTooltip={false}
                        text={option.label}
                    />
                </DropdownMenuItem>
            );

        case 'inputTitle':
            return (
                <DropdownMenuItem key={key} asChild>
                    <InputTitleTurnIntoButton text={option.label} />
                </DropdownMenuItem>
            );

        case 'inputLabel':
            return (
                <DropdownMenuItem key={key} asChild>
                    <InputLabelTurnIntoButton text={option.label} />
                </DropdownMenuItem>
            );

        default:
            return null;
    }
}

function InputTitleTurnIntoButton({ text }: { text: string }) {
    const { editor } = usePacepardEditor();
    return (
        <Button
            type="button"
            data-style="ghost"
            onClick={() =>
                editor?.chain().focus().setInputTitle({ level: 2 }).run()
            }
        >
            <span className="tiptap-button-text">{text}</span>
        </Button>
    );
}

function InputLabelTurnIntoButton({ text }: { text: string }) {
    const { editor } = usePacepardEditor();
    return (
        <Button
            type="button"
            data-style="ghost"
            onClick={() =>
                editor?.chain().focus().setInputLabel({ level: 4 }).run()
            }
        >
            <span className="tiptap-button-text">{text}</span>
        </Button>
    );
}

export interface TurnIntoDropdownProps
    extends Omit<ButtonProps, 'type'>, UseTurnIntoDropdownConfig {
    /**
     * Whether to use card layout for the dropdown content
     * @default true
     */
    useCardLayout?: boolean;
}

/**
 * Dropdown component for transforming block types in a Tiptap editor.
 * For custom dropdown implementations, use the `useTurnIntoDropdown` hook instead.
 */
export const TurnIntoDropdown = forwardRef<
    HTMLButtonElement,
    TurnIntoDropdownProps
>(
    (
        {
            editor: providedEditor,
            hideWhenUnavailable = false,
            blockTypes,
            useCardLayout = true,
            onOpenChange,
            children,
            ...buttonProps
        },
        ref,
    ) => {
        const { editor } = usePacepardEditor(providedEditor);
        const {
            isVisible,
            canToggle,
            isOpen,
            activeBlockType,
            handleOpenChange,
            label,
            Icon,
        } = useTurnIntoDropdown({
            editor,
            hideWhenUnavailable,
            blockTypes,
            onOpenChange,
        });

        if (!isVisible) {
            return null;
        }

        return (
            <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        data-style="ghost"
                        disabled={!canToggle}
                        data-disabled={!canToggle}
                        role="button"
                        tabIndex={-1}
                        aria-label={label}
                        tooltip="Turn into"
                        {...buttonProps}
                        ref={ref}
                    >
                        {children ?? (
                            <>
                                <span className="tiptap-button-text">
                                    {activeBlockType?.label || 'Text'}
                                </span>
                                <Icon className="tiptap-button-dropdown-small" />
                            </>
                        )}
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start">
                    <TurnIntoDropdownContent
                        blockTypes={blockTypes}
                        useCardLayout={useCardLayout}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
);

TurnIntoDropdown.displayName = 'TurnIntoDropdown';
