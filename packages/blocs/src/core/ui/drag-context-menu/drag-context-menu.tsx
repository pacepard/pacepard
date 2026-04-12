import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Node as TiptapNode } from '@tiptap/pm/model';
import { offset } from '@floating-ui/react';
import { DragHandle } from '@tiptap/extension-drag-handle-react';

// Hooks
import { usePacepardEditor } from '@/hooks/use-pacepard-editor';
import { useIsBreakpoint } from '@/hooks/use-is-breakpoint';
import { useUiEditorState } from '@/hooks/use-ui-editor-state';
import { selectNodeAndHideFloating } from '@/hooks/use-floating-toolbar-visibility';

// Primitive UI Components
import { Button, ButtonGroup } from '@/core/primitives/button';
import { Spacer } from '@/core/primitives/spacer';
import {
    Menu,
    MenuContent,
    MenuItem,
    MenuGroup,
    MenuGroupLabel,
    MenuButton,
} from '@/core/primitives/menu';
import { Combobox, ComboboxList } from '@/core/primitives/combobox';
import { Separator } from '@/core/primitives/separator';

// Tiptap UI
import { useImageDownload } from '@/core/ui/image-download-button';
import {
    DuplicateShortcutBadge,
    useDuplicate,
} from '@/core/ui/duplicate-button';
import {
    CopyToClipboardShortcutBadge,
    useCopyToClipboard,
} from '@/core/ui/copy-to-clipboard-button';
import {
    DeleteNodeShortcutBadge,
    useDeleteNode,
    deleteNodeAtPosition,
} from '@/core/ui/delete-node-button';
import {
    CopyAnchorLinkShortcutBadge,
    useCopyAnchorLink,
} from '@/core/ui/copy-anchor-link-button';
import { useResetAllFormatting } from '@/core/ui/reset-all-formatting-button';
import { SlashCommandTriggerButton } from '@/core/ui/slash-command-trigger-button';
import { AskAiShortcutBadge, useAiAsk } from '@/core/ui/ai-ask-button';
import { useText } from '@/core/ui/text-button';
import { useHeading } from '@/core/ui/heading-button';
import { useList } from '@/core/ui/list-button';
import { useBlockquote } from '@/core/ui/blockquote-button';
import { useCodeBlock } from '@/core/ui/code-block-button';
import { ColorMenu } from '@/core/ui/color-menu';
import { TableAlignMenu } from '@/core/node/table-node/ui/table-alignment-menu';
import { useTableFitToWidth } from '@/core/node/table-node/ui/table-fit-to-width-button';
import { useTableClearRowColumnContent } from '@/core/node/table-node/ui/table-clear-row-column-content-button';

// Utils
import {
    getNodeDisplayName,
    isTextSelectionValid,
} from '@/utils/collab-helper';
import { SR_ONLY } from '@/utils/base-helper';

import type {
    DragContextMenuProps,
    MenuItemProps,
    NodeChangeData,
} from '@/core/ui/drag-context-menu/drag-context-menu-types';

// Icons
import { GripVerticalIcon } from '@/core/icons/grip-vertical-icon';
import { ChevronRightIcon } from '@/core/icons/chevron-right-icon';
import { Repeat2Icon } from '@/core/icons/repeat-2-icon';
import { TrashIcon } from '@/core/icons/trash-icon';
import { TypeIcon } from '@/core/icons/type-icon';
import './drag-context-menu.scss';
import { Label } from '@/core/primitives/label';
import { useTocShowTitle } from '@/core/node/toc-node/ui/toc-show-title-button';
import { useShortAnswer } from '@/core/ui/short-answer-button/use-short-answer';
import { isNodeTypeSelected } from '@/utils/base-helper';
import { NodeSelection } from '@tiptap/pm/state';
import type {
    ShortAnswerAttrs,
    InputType,
} from '@/core/node/short-answer-node/short-answer-types';
import type { FormInputAttrs } from '@/core/node/form-input/form-input-types';
import type { TextAreaNodeAttrs } from '@/core/node/textarea-node/textarea-node-types';
import { Input } from '@/core/primitives/input';
import { Switch } from '@/core/primitives/switch';
import '@/core/primitives/switch/switch.scss';

const FORM_INPUT_NODE_NAMES = [
    'formInputText',
    'formInputEmail',
    'formInputNumber',
    'formInputUrl',
    'formInputTel',
] as const;

const LONG_ANSWER_NODE_NAME = 'longAnswer' as const;

const useNodeTransformActions = () => {
    const text = useText();
    const heading1 = useHeading({ level: 1 });
    const heading2 = useHeading({ level: 2 });
    const heading3 = useHeading({ level: 3 });
    const bulletList = useList({ type: 'bulletList' });
    const orderedList = useList({ type: 'orderedList' });
    const taskList = useList({ type: 'taskList' });
    const blockquote = useBlockquote();
    const codeBlock = useCodeBlock();
    const shortAnswer = useShortAnswer();

    const mapper = (
        action: ReturnType<
            | typeof useText
            | typeof useHeading
            | typeof useList
            | typeof useBlockquote
            | typeof useCodeBlock
            | typeof useShortAnswer
        >,
    ) => ({
        icon: action.Icon,
        label: action.label,
        onClick: action.handleToggle,
        disabled: !action.canToggle,
        isActive: action.isActive,
    });

    const actions = [
        mapper(text),
        ...[heading1, heading2, heading3].map(mapper),
        mapper(bulletList),
        mapper(orderedList),
        mapper(taskList),
        mapper(blockquote),
        mapper(codeBlock),
        mapper(shortAnswer),
    ];

    const allDisabled = actions.every((a) => a.disabled);

    return allDisabled ? null : actions;
};

const BaseMenuItem: React.FC<MenuItemProps> = ({
    icon: Icon,
    label,
    onClick,
    disabled = false,
    isActive = false,
    shortcutBadge,
}) => (
    <MenuItem
        render={
            <Button
                type="button"
                data-style="ghost"
                data-active-state={isActive ? 'on' : 'off'}
            />
        }
        onClick={onClick}
        disabled={disabled}
    >
        <Icon className="tiptap-button-icon" />
        <span className="tiptap-button-text">{label}</span>
        {shortcutBadge}
    </MenuItem>
);

const SubMenuTrigger: React.FC<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    children: React.ReactNode;
}> = ({ icon: Icon, label, children }) => (
    <Menu
        placement="right"
        trigger={
            <MenuItem
                render={
                    <MenuButton
                        render={
                            <Button data-style="ghost">
                                <Icon className="tiptap-button-icon" />
                                <span className="tiptap-button-text">
                                    {label}
                                </span>
                                <Spacer />
                                <ChevronRightIcon className="tiptap-button-icon" />
                            </Button>
                        }
                    />
                }
            />
        }
    >
        <MenuContent portal>
            <ComboboxList>{children}</ComboboxList>
        </MenuContent>
    </Menu>
);

const TransformActionGroup: React.FC = () => {
    const actions = useNodeTransformActions();
    const { canReset, handleResetFormatting, label, Icon } =
        useResetAllFormatting({
            hideWhenUnavailable: true,
            preserveMarks: ['inlineThread'],
        });

    if (!actions && !canReset) return null;

    return (
        <>
            {actions && (
                <SubMenuTrigger icon={Repeat2Icon} label="Turn Into">
                    <MenuGroup>
                        <MenuGroupLabel>Turn into</MenuGroupLabel>
                        {actions.map((action) => (
                            <BaseMenuItem key={action.label} {...action} />
                        ))}
                    </MenuGroup>
                </SubMenuTrigger>
            )}

            {canReset && (
                <BaseMenuItem
                    icon={Icon}
                    label={label}
                    disabled={!canReset}
                    onClick={handleResetFormatting}
                />
            )}
        </>
    );
};

const TableFitToWidth: React.FC = () => {
    const { canFitToWidth, handleFitToWidth, label, Icon } = useTableFitToWidth(
        {
            hideWhenUnavailable: true,
        },
    );
    const clearAllContents = useTableClearRowColumnContent({
        resetAttrs: true,
    });

    return (
        <>
            {canFitToWidth && (
                <BaseMenuItem
                    icon={Icon}
                    label={label}
                    disabled={!canFitToWidth}
                    onClick={handleFitToWidth}
                />
            )}

            {clearAllContents.canClearRowColumnContent && (
                <BaseMenuItem
                    icon={clearAllContents.Icon}
                    label={'Clear all contents'}
                    disabled={!clearAllContents.canClearRowColumnContent}
                    onClick={clearAllContents.handleClear}
                />
            )}
        </>
    );
};

const TocShowTitle: React.FC = () => {
    const { canToggle, handleToggle, label, Icon } = useTocShowTitle({
        hideWhenUnavailable: true,
    });

    if (!canToggle) return null;

    return (
        <BaseMenuItem
            icon={Icon}
            label={label}
            disabled={!canToggle}
            onClick={handleToggle}
        />
    );
};

const INPUT_TYPE_OPTIONS: { value: InputType; label: string }[] = [
    { value: 'text', label: 'Short answer' },
    { value: 'email', label: 'Email' },
    { value: 'number', label: 'Number' },
    { value: 'url', label: 'URL' },
    { value: 'tel', label: 'Phone' },
];

const TYPED_NODE_TO_INPUT_TYPE: Record<string, InputType> = {
    shortAnswerText: 'text',
    shortAnswerEmail: 'email',
    shortAnswerNumber: 'number',
    shortAnswerUrl: 'url',
    shortAnswerTel: 'tel',
};

const SHORT_ANSWER_NODE_NAMES = [
    'shortAnswer',
    'shortAnswerText',
    'shortAnswerEmail',
    'shortAnswerNumber',
    'shortAnswerUrl',
    'shortAnswerTel',
] as const;

function getInputTypeFromNodeName(nodeName: string): InputType {
    return (
        TYPED_NODE_TO_INPUT_TYPE[nodeName] ??
        (nodeName === 'shortAnswer' ? 'text' : 'text')
    );
}

const ShortAnswerPropertyGroup: React.FC = () => {
    const { editor } = usePacepardEditor();

    if (!editor || !isNodeTypeSelected(editor, [...SHORT_ANSWER_NODE_NAMES]))
        return null;

    const { selection } = editor.state;
    if (!(selection instanceof NodeSelection)) return null;

    const nodeName = selection.node.type.name;
    const attrs = (selection.node.attrs ?? {}) as ShortAnswerAttrs;
    const inputType =
        nodeName === 'shortAnswer'
            ? ((attrs.inputType ?? 'text') as InputType)
            : getInputTypeFromNodeName(nodeName);

    const update = useCallback(
        (next: Partial<ShortAnswerAttrs>) => {
            editor.chain().focus().updateAttributes(nodeName, next).run();
        },
        [editor, nodeName],
    );

    const convertTo = useCallback(
        (targetType: InputType) => {
            const targetNodeName =
                targetType === 'text'
                    ? 'shortAnswerText'
                    : 'shortAnswer' +
                      targetType.charAt(0).toUpperCase() +
                      targetType.slice(1);
            const { state } = editor;
            const schema = state.schema;
            const targetNodeType = schema.nodes[targetNodeName];
            if (!targetNodeType) return;
            const node = selection.node;
            const from = selection.from;
            const to = selection.to;
            const newNode = targetNodeType.create(
                { ...node.attrs, inputType: targetType },
                node.content,
            );
            const tr = state.tr.replaceWith(from, to, newNode);
            editor.view.dispatch(tr);
        },
        [editor, selection],
    );

    const isTypedNode = nodeName !== 'shortAnswer';
    const isNumber = inputType === 'number';
    const currentInputTypeLabel =
        INPUT_TYPE_OPTIONS.find((opt) => opt.value === inputType)?.label ??
        'Short answer';

    return (
        <MenuGroup className="short-answer-property-group">
            <MenuGroupLabel>Short answer</MenuGroupLabel>

            {/* Input type dropdown (legacy shortAnswer) or Convert to (typed nodes) */}
            <Menu
                placement="right"
                trigger={
                    <MenuItem
                        render={
                            <MenuButton
                                render={
                                    <Button
                                        data-style="ghost"
                                        className="property-row"
                                    >
                                        <span className="property-label">
                                            {isTypedNode
                                                ? 'Convert to'
                                                : 'Input type'}
                                        </span>
                                        <Spacer />
                                        <span className="property-value">
                                            {currentInputTypeLabel}
                                        </span>
                                        <ChevronRightIcon className="tiptap-button-icon" />
                                    </Button>
                                }
                            />
                        }
                    />
                }
            >
                <MenuContent portal>
                    <ComboboxList>
                        {(isTypedNode
                            ? INPUT_TYPE_OPTIONS.filter(
                                  (opt) => opt.value !== inputType,
                              )
                            : INPUT_TYPE_OPTIONS
                        ).map(({ value, label }) => (
                            <BaseMenuItem
                                key={value}
                                icon={TypeIcon}
                                label={label}
                                isActive={!isTypedNode && inputType === value}
                                disabled={false}
                                onClick={(e?: React.MouseEvent) => {
                                    e?.preventDefault();
                                    e?.stopPropagation();
                                    if (isTypedNode) {
                                        convertTo(value);
                                    } else {
                                        update({ inputType: value });
                                    }
                                }}
                            />
                        ))}
                    </ComboboxList>
                </MenuContent>
            </Menu>

            <Separator orientation="horizontal" />

            {/* Required toggle */}
            <div
                className="property-row"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <Label className="property-label">Required</Label>
                <Switch
                    checked={!!attrs.required}
                    onCheckedChange={(checked: boolean) =>
                        update({ required: checked })
                    }
                />
            </div>

            {/* Default answer toggle and input */}
            <div
                className="property-row"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <Label className="property-label">Default answer</Label>
                <Switch
                    checked={attrs.defaultAnswer != null}
                    onCheckedChange={(checked: boolean) => {
                        if (!checked) {
                            update({ defaultAnswer: null });
                        } else if (attrs.defaultAnswer == null) {
                            update({ defaultAnswer: '' });
                        }
                    }}
                />
            </div>
            {attrs.defaultAnswer != null && (
                <div className="property-input-row">
                    <Input
                        type="text"
                        value={attrs.defaultAnswer ?? ''}
                        placeholder="Optional"
                        onChange={(e) =>
                            update({ defaultAnswer: e.target.value || null })
                        }
                        className="short-answer-property-input"
                    />
                </div>
            )}

            {/* Min/Max characters (for text/email/url) */}
            {!isNumber && (
                <>
                    <div
                        className="property-row"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Label className="property-label">Min characters</Label>
                        <Switch
                            checked={attrs.minChars != null}
                            onCheckedChange={(checked: boolean) => {
                                if (!checked) {
                                    update({ minChars: null });
                                }
                            }}
                        />
                    </div>
                    {attrs.minChars != null && (
                        <div className="property-input-row">
                            <Input
                                type="number"
                                min={0}
                                value={attrs.minChars ?? ''}
                                placeholder="—"
                                onChange={(e) => {
                                    const v = e.target.value;
                                    update({
                                        minChars: v === '' ? null : Number(v),
                                    });
                                }}
                                className="short-answer-property-input"
                                onBlur={(e) => {
                                    if (e.target.value === '') {
                                        update({ minChars: null });
                                    }
                                }}
                            />
                        </div>
                    )}

                    <div
                        className="property-row"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Label className="property-label">Max characters</Label>
                        <Switch
                            checked={attrs.maxChars != null}
                            onCheckedChange={(checked: boolean) => {
                                if (!checked) {
                                    update({ maxChars: null });
                                }
                            }}
                        />
                    </div>
                    {attrs.maxChars != null && (
                        <div className="property-input-row">
                            <Input
                                type="number"
                                min={0}
                                value={attrs.maxChars ?? ''}
                                placeholder="—"
                                onChange={(e) => {
                                    const v = e.target.value;
                                    update({
                                        maxChars: v === '' ? null : Number(v),
                                    });
                                }}
                                className="short-answer-property-input"
                                onBlur={(e) => {
                                    if (e.target.value === '') {
                                        update({ maxChars: null });
                                    }
                                }}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Min/Max value (for number) */}
            {isNumber && (
                <>
                    <div
                        className="property-row"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Label className="property-label">Min value</Label>
                        <Switch
                            checked={attrs.minValue != null}
                            onCheckedChange={(checked: boolean) => {
                                if (!checked) {
                                    update({ minValue: null });
                                }
                            }}
                        />
                    </div>
                    {attrs.minValue != null && (
                        <div className="property-input-row">
                            <Input
                                type="number"
                                value={attrs.minValue ?? ''}
                                placeholder="—"
                                onChange={(e) => {
                                    const v = e.target.value;
                                    update({
                                        minValue: v === '' ? null : Number(v),
                                    });
                                }}
                                className="short-answer-property-input"
                                onBlur={(e) => {
                                    if (e.target.value === '') {
                                        update({ minValue: null });
                                    }
                                }}
                            />
                        </div>
                    )}

                    <div
                        className="property-row"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Label className="property-label">Max value</Label>
                        <Switch
                            checked={attrs.maxValue != null}
                            onCheckedChange={(checked: boolean) => {
                                if (!checked) {
                                    update({ maxValue: null });
                                }
                            }}
                        />
                    </div>
                    {attrs.maxValue != null && (
                        <div className="property-input-row">
                            <Input
                                type="number"
                                value={attrs.maxValue ?? ''}
                                placeholder="—"
                                onChange={(e) => {
                                    const v = e.target.value;
                                    update({
                                        maxValue: v === '' ? null : Number(v),
                                    });
                                }}
                                className="short-answer-property-input"
                                onBlur={(e) => {
                                    if (e.target.value === '') {
                                        update({ maxValue: null });
                                    }
                                }}
                            />
                        </div>
                    )}
                </>
            )}

            <Separator orientation="horizontal" />

            {/* Hide toggle */}
            <div
                className="property-row"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <Label className="property-label">Hide</Label>
                <Switch
                    checked={!!attrs.hidden}
                    onCheckedChange={(checked: boolean) =>
                        update({ hidden: checked })
                    }
                />
            </div>

            {/* Add conditional logic */}
            <BaseMenuItem
                icon={TypeIcon}
                label="Add conditional logic"
                disabled={false}
                onClick={(e?: React.MouseEvent<HTMLElement>) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    update({ conditionalLogic: attrs.conditionalLogic ?? {} });
                }}
            />
        </MenuGroup>
    );
};

/** Property group for standalone form input nodes (formInputText, formInputEmail, etc.). Required switch adds the required badge. */
const FormInputPropertyGroup: React.FC = () => {
    const { editor } = usePacepardEditor();

    if (!editor || !isNodeTypeSelected(editor, [...FORM_INPUT_NODE_NAMES]))
        return null;

    const { selection } = editor.state;
    if (!(selection instanceof NodeSelection)) return null;

    const nodeName = selection.node.type.name;
    const attrs = (selection.node.attrs ?? {}) as FormInputAttrs;

    const update = useCallback(
        (next: Partial<FormInputAttrs>) => {
            editor.chain().focus().updateAttributes(nodeName, next).run();
        },
        [editor, nodeName],
    );

    return (
        <MenuGroup className="form-input-property-group">
            <MenuGroupLabel>Form input</MenuGroupLabel>
            <div
                className="property-row"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <Label className="property-label">Required</Label>
                <Switch
                    checked={!!attrs.required}
                    onCheckedChange={(checked: boolean) =>
                        update({ required: checked })
                    }
                />
            </div>
            <div
                className="property-row property-input-row"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <Label className="property-label">Placeholder</Label>
                <Input
                    type="text"
                    value={attrs.placeholder ?? ''}
                    placeholder="Optional"
                    onChange={(e) =>
                        update({ placeholder: e.target.value || null })
                    }
                    className="short-answer-property-input"
                />
            </div>
        </MenuGroup>
    );
};

/** Property group for long answer node. Required switch adds the required badge. */
const TextAreaPropertyGroup: React.FC = () => {
    const { editor } = usePacepardEditor();

    if (!editor || !isNodeTypeSelected(editor, [LONG_ANSWER_NODE_NAME]))
        return null;

    const { selection } = editor.state;
    if (!(selection instanceof NodeSelection)) return null;

    const nodeName = selection.node.type.name;
    const attrs = (selection.node.attrs ?? {}) as TextAreaNodeAttrs;

    const update = useCallback(
        (next: Partial<TextAreaNodeAttrs>) => {
            editor.chain().focus().updateAttributes(nodeName, next).run();
        },
        [editor, nodeName],
    );

    return (
        <MenuGroup className="textarea-property-group">
            <MenuGroupLabel>Long Answer</MenuGroupLabel>
            <div
                className="property-row"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <Label className="property-label">Required</Label>
                <Switch
                    checked={!!attrs.required}
                    onCheckedChange={(checked: boolean) =>
                        update({ required: checked })
                    }
                />
            </div>
            <div
                className="property-row property-input-row"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <Label className="property-label">Placeholder</Label>
                <Input
                    type="text"
                    value={attrs.placeholder ?? ''}
                    placeholder="Optional"
                    onChange={(e) =>
                        update({ placeholder: e.target.value || null })
                    }
                    className="short-answer-property-input"
                />
            </div>
            <div
                className="property-row property-input-row"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <Label className="property-label">Rows</Label>
                <Input
                    type="number"
                    value={attrs.rows ?? 4}
                    placeholder="4"
                    onChange={(e) => {
                        const val = e.target.value;
                        update({
                            rows: val ? parseInt(val, 10) || null : null,
                        });
                    }}
                    className="short-answer-property-input"
                    min="1"
                />
            </div>
        </MenuGroup>
    );
};

const ImageActionGroup: React.FC = () => {
    const { canDownload, handleDownload, label, Icon } = useImageDownload({
        hideWhenUnavailable: true,
    });

    if (!canDownload) return null;

    return (
        <BaseMenuItem
            icon={Icon}
            label={label}
            disabled={!canDownload}
            onClick={handleDownload}
        />
    );
};

const CoreActionGroup: React.FC = () => {
    const {
        handleDuplicate,
        canDuplicate,
        label,
        Icon: DuplicateIcon,
    } = useDuplicate();
    const {
        handleCopyToClipboard,
        canCopyToClipboard,
        label: copyLabel,
        Icon: CopyIcon,
    } = useCopyToClipboard();
    const {
        handleCopyAnchorLink,
        canCopyAnchorLink,
        label: copyAnchorLinkLabel,
        Icon: CopyAnchorLinkIcon,
    } = useCopyAnchorLink();

    return (
        <>
            <Separator orientation="horizontal" />

            <MenuGroup>
                <BaseMenuItem
                    icon={DuplicateIcon}
                    label={label}
                    onClick={(e?: React.MouseEvent<HTMLElement>) => {
                        e?.preventDefault();
                        e?.stopPropagation();
                        handleDuplicate();
                    }}
                    disabled={!canDuplicate}
                    shortcutBadge={<DuplicateShortcutBadge />}
                />
                <BaseMenuItem
                    icon={CopyIcon}
                    label={copyLabel}
                    onClick={(e?: React.MouseEvent<HTMLElement>) => {
                        e?.preventDefault();
                        e?.stopPropagation();
                        handleCopyToClipboard();
                    }}
                    disabled={!canCopyToClipboard}
                    shortcutBadge={<CopyToClipboardShortcutBadge />}
                />
                <BaseMenuItem
                    icon={CopyAnchorLinkIcon}
                    label={copyAnchorLinkLabel}
                    onClick={(e?: React.MouseEvent<HTMLElement>) => {
                        e?.preventDefault();
                        e?.stopPropagation();
                        handleCopyAnchorLink();
                    }}
                    disabled={!canCopyAnchorLink}
                    shortcutBadge={<CopyAnchorLinkShortcutBadge />}
                />
            </MenuGroup>

            <Separator orientation="horizontal" />
        </>
    );
};

const AIActionGroup: React.FC = () => {
    const { handleAiAsk, canAiAsk, Icon: AiAskIcon } = useAiAsk();

    if (!canAiAsk) return null;

    return (
        <>
            <MenuGroup>
                {canAiAsk && (
                    <BaseMenuItem
                        icon={AiAskIcon}
                        label="Ask AI"
                        onClick={handleAiAsk}
                        shortcutBadge={<AskAiShortcutBadge />}
                    />
                )}
            </MenuGroup>

            <Separator orientation="horizontal" />
        </>
    );
};

const DeleteActionGroup: React.FC = () => {
    const { handleDeleteNode, canDeleteNode, label, Icon } = useDeleteNode();

    return (
        <MenuGroup>
            <BaseMenuItem
                icon={Icon}
                label={label}
                onClick={(e?: React.MouseEvent<HTMLElement>) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    handleDeleteNode();
                }}
                disabled={!canDeleteNode}
                shortcutBadge={<DeleteNodeShortcutBadge />}
            />
        </MenuGroup>
    );
};

export const DragContextMenu: React.FC<DragContextMenuProps> = ({
    editor: providedEditor,
    withSlashCommandTrigger = true,
    mobileBreakpoint = 768,
    ...props
}) => {
    const { editor } = usePacepardEditor(providedEditor);
    const { aiGenerationActive, isDragging } = useUiEditorState(editor);
    const isMobile = useIsBreakpoint('max', mobileBreakpoint);
    const [open, setOpen] = useState(false);
    const [node, setNode] = useState<TiptapNode | null>(null);
    const [nodePos, setNodePos] = useState<number>(-1);

    const handleNodeChange = useCallback((data: NodeChangeData) => {
        if (data.node) setNode(data.node);
        setNodePos(data.pos);
    }, []);

    useEffect(() => {
        if (!editor) return;
        editor.commands.setLockDragHandle(open);
        editor.commands.setMeta('lockDragHandle', open);
    }, [editor, open]);

    const mainAxisOffset = 16;

    const dynamicPositions = useMemo(() => {
        return {
            middleware: [
                offset((props) => {
                    const { rects } = props;
                    const nodeHeight = rects.reference.height;
                    const dragHandleHeight = rects.floating.height;

                    const crossAxis = nodeHeight / 2 - dragHandleHeight / 2;

                    return {
                        mainAxis: mainAxisOffset,
                        // if height is more than 40px, then it's likely a block node
                        crossAxis: nodeHeight > 40 ? 0 : crossAxis,
                    };
                }),
            ],
        };
    }, []);

    const handleOnMenuClose = useCallback(() => {
        if (editor) {
            editor.commands.setMeta('hideDragHandle', true);
        }
    }, [editor]);

    const onElementDragStart = useCallback(() => {
        if (!editor) return;
        editor.commands.setIsDragging(true);
    }, [editor]);

    const onElementDragEnd = useCallback(() => {
        if (!editor) return;
        editor.commands.setIsDragging(false);

        setTimeout(() => {
            editor.view.dom.blur();
            editor.view.focus();
        }, 0);
    }, [editor]);

    if (!editor) return null;

    const nodeName = getNodeDisplayName(editor);

    return (
        <div
            style={
                {
                    '--drag-handle-main-axis-offset': `${mainAxisOffset}px`,
                } as React.CSSProperties
            }
        >
            <DragHandle
                editor={editor}
                onNodeChange={handleNodeChange}
                computePositionConfig={dynamicPositions}
                onElementDragStart={onElementDragStart}
                onElementDragEnd={onElementDragEnd}
                {...props}
            >
                <ButtonGroup
                    orientation="horizontal"
                    style={{
                        ...(aiGenerationActive ||
                        isMobile ||
                        isTextSelectionValid(editor)
                            ? { opacity: 0, pointerEvents: 'none' }
                            : {}),
                        ...(isDragging ? { opacity: 0 } : {}),
                    }}
                >
                    <Button
                        data-style="ghost"
                        data-weight="small"
                        tabIndex={-1}
                        aria-label="Delete"
                        tooltip={
                            <>
                                <div>Delete block</div>
                                <DeleteNodeShortcutBadge />
                            </>
                        }
                        disabled={!node || nodePos < 0}
                        onClick={() => {
                            if (editor && node && nodePos >= 0) {
                                deleteNodeAtPosition(
                                    editor,
                                    nodePos,
                                    node.nodeSize,
                                );
                            }
                        }}
                    >
                        <TrashIcon className="tiptap-button-icon" />
                    </Button>
                    {withSlashCommandTrigger && (
                        <SlashCommandTriggerButton
                            node={node}
                            nodePos={nodePos}
                            data-weight="small"
                        />
                    )}

                    <Menu
                        open={open}
                        onOpenChange={setOpen}
                        placement="left"
                        trigger={
                            <MenuButton
                                render={
                                    <Button
                                        data-style="ghost"
                                        tabIndex={-1}
                                        tooltip={
                                            <>
                                                <div>
                                                    Click open menu options
                                                </div>
                                                <div>Drag to move</div>
                                            </>
                                        }
                                        data-weight="small"
                                        style={{
                                            cursor: 'grab',
                                            ...(open
                                                ? { pointerEvents: 'none' }
                                                : {}),
                                        }}
                                        onMouseDown={() =>
                                            selectNodeAndHideFloating(
                                                editor,
                                                nodePos,
                                            )
                                        }
                                    >
                                        <GripVerticalIcon className="tiptap-button-icon" />
                                    </Button>
                                }
                            />
                        }
                    >
                        <MenuContent
                            onClose={handleOnMenuClose}
                            autoFocusOnHide={false}
                            preventBodyScroll={true}
                            portal
                        >
                            <Combobox style={SR_ONLY} />
                            <ComboboxList style={{ minWidth: '15rem' }}>
                                <Label>{nodeName}</Label>

                                <MenuGroup>
                                    <TocShowTitle />
                                    <ShortAnswerPropertyGroup />
                                    <FormInputPropertyGroup />
                                    <TextAreaPropertyGroup />
                                    <ColorMenu />
                                    <TableAlignMenu />
                                    <TableFitToWidth />
                                    <TransformActionGroup />
                                    <ImageActionGroup />
                                </MenuGroup>

                                <CoreActionGroup />

                                <AIActionGroup />

                                <DeleteActionGroup />
                            </ComboboxList>
                        </MenuContent>
                    </Menu>
                </ButtonGroup>
            </DragHandle>
        </div>
    );
};
