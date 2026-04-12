import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { InputLabelNodeView } from './input-label-node-view';

export interface InputLabelNodeOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        inputLabel: {
            setInputLabel: (attrs?: {
                level?: number;
                placeholder?: string;
            }) => ReturnType;
            toggleInputLabel: (attrs?: {
                level?: number;
                placeholder?: string;
            }) => ReturnType;
        };
    }
}

const DEFAULT_PLACEHOLDER = 'label';

/**
 * Standalone heading-like node for form field labels (default level 4).
 * Placeholder when empty: "label". Always shows required badge.
 */
export const InputLabelNode = Node.create<InputLabelNodeOptions>({
    name: 'inputLabel',

    group: 'block',

    content: 'inline*',

    defining: true,

    addOptions() {
        return { HTMLAttributes: {} };
    },

    addAttributes() {
        return {
            level: {
                default: 4,
                parseHTML: (element) => {
                    const level = element.getAttribute('data-level');
                    const n = level ? parseInt(level, 10) : 4;
                    return n >= 1 && n <= 6 ? n : 4;
                },
                renderHTML: (attrs) => {
                    if (attrs.level !== 4) {
                        return { 'data-level': attrs.level };
                    }
                    return {};
                },
            },
            placeholder: {
                default: DEFAULT_PLACEHOLDER,
                parseHTML: (element) =>
                    element.getAttribute('data-placeholder') ??
                    DEFAULT_PLACEHOLDER,
                renderHTML: (attrs) => ({
                    'data-placeholder':
                        attrs.placeholder ?? DEFAULT_PLACEHOLDER,
                }),
            },
        };
    },

    parseHTML() {
        return [
            { tag: 'h4[data-type="input-label"]' },
            { tag: 'h1[data-type="input-label"]' },
            { tag: 'h2[data-type="input-label"]' },
            { tag: 'h3[data-type="input-label"]' },
            { tag: 'h5[data-type="input-label"]' },
            { tag: 'h6[data-type="input-label"]' },
        ];
    },

    renderHTML({ node, HTMLAttributes }) {
        const level = node.attrs.level ?? 4;
        const tag = 'h' + Math.min(6, Math.max(1, level));
        const placeholder = node.attrs.placeholder ?? DEFAULT_PLACEHOLDER;
        return [
            tag,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                'data-type': 'input-label',
                'data-level': level,
                'data-placeholder': placeholder,
            }),
            0,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(InputLabelNodeView);
    },

    addCommands() {
        return {
            setInputLabel:
                (attrs?: { level?: number; placeholder?: string }) =>
                ({ commands }) =>
                    commands.setNode('inputLabel', {
                        level: 4,
                        placeholder: DEFAULT_PLACEHOLDER,
                        ...attrs,
                    }),
            toggleInputLabel:
                (attrs?: { level?: number; placeholder?: string }) =>
                ({ commands }) =>
                    commands.toggleNode('paragraph', 'inputLabel', {
                        level: 4,
                        placeholder: DEFAULT_PLACEHOLDER,
                        ...attrs,
                    }),
        };
    },
});

export default InputLabelNode;
