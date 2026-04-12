import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { InputTitleNodeView } from './input-title-node-view';

export interface InputTitleNodeOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        inputTitle: {
            setInputTitle: (attrs?: {
                level?: number;
                placeholder?: string;
            }) => ReturnType;
            toggleInputTitle: (attrs?: {
                level?: number;
                placeholder?: string;
            }) => ReturnType;
        };
    }
}

const DEFAULT_PLACEHOLDER = 'Type a question';

/**
 * Standalone heading-like node for form section titles (default level 2).
 * Placeholder when empty: "Type a question". Always shows required badge.
 */
export const InputTitleNode = Node.create<InputTitleNodeOptions>({
    name: 'inputTitle',

    group: 'block',

    content: 'inline*',

    defining: true,

    addOptions() {
        return { HTMLAttributes: {} };
    },

    addAttributes() {
        return {
            level: {
                default: 2,
                parseHTML: (element) => {
                    const level = element.getAttribute('data-level');
                    const n = level ? parseInt(level, 10) : 2;
                    return n >= 1 && n <= 6 ? n : 2;
                },
                renderHTML: (attrs) => {
                    if (attrs.level !== 2) {
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
            { tag: 'h2[data-type="input-title"]' },
            { tag: 'h1[data-type="input-title"]' },
            { tag: 'h3[data-type="input-title"]' },
            { tag: 'h4[data-type="input-title"]' },
            { tag: 'h5[data-type="input-title"]' },
            { tag: 'h6[data-type="input-title"]' },
        ];
    },

    renderHTML({ node, HTMLAttributes }) {
        const level = node.attrs.level ?? 2;
        const tag = 'h' + Math.min(6, Math.max(1, level));
        const placeholder = node.attrs.placeholder ?? DEFAULT_PLACEHOLDER;
        return [
            tag,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                'data-type': 'input-title',
                'data-level': level,
                'data-placeholder': placeholder,
            }),
            0,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(InputTitleNodeView);
    },

    addCommands() {
        return {
            setInputTitle:
                (attrs?: { level?: number; placeholder?: string }) =>
                ({ commands }) =>
                    commands.setNode('inputTitle', {
                        level: 2,
                        placeholder: DEFAULT_PLACEHOLDER,
                        ...attrs,
                    }),
            toggleInputTitle:
                (attrs?: { level?: number; placeholder?: string }) =>
                ({ commands }) =>
                    commands.toggleNode('paragraph', 'inputTitle', {
                        level: 2,
                        placeholder: DEFAULT_PLACEHOLDER,
                        ...attrs,
                    }),
        };
    },
});

export default InputTitleNode;
