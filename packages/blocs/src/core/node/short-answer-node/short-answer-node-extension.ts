import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import {
    Plugin,
    PluginKey,
    NodeSelection,
    TextSelection,
} from '@tiptap/pm/state';
import { keymap } from '@tiptap/pm/keymap';
import type { Node as PMNode } from '@tiptap/pm/model';
import { ShortAnswerNodeComponent } from './short-answer-node.tsx';
import type { ShortAnswerAttrs } from './short-answer-types.ts';
import { shortAnswerAttributes } from '@/lib/attribute-config.ts';

export type {
    ShortAnswerAttrs,
    InputType,
    InputMode,
} from './short-answer-types';

export interface ShortAnswerNodeOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        shortAnswer: {
            /**
             * Insert a short-answer node with one heading (title) and optional attrs.
             */
            insertShortAnswer: (
                attrs?: Partial<ShortAnswerAttrs>,
            ) => ReturnType;
        };
    }
}

const SHORT_ANSWER_NODE_NAME = 'shortAnswer';
const SHORT_ANSWER_INPUT_NODE_NAME = 'shortAnswerInput';

/**
 * Normalize short-answer content to exactly one heading (level 2) and one shortAnswerInput.
 * Used on paste and when content is invalid.
 */
function normalizeShortAnswerContent(
    node: PMNode,
    shortAnswerTypeName: string,
): PMNode | null {
    if (node.type.name !== shortAnswerTypeName) return null;
    const schema = node.type.schema;
    const headingType = schema.nodes.heading;
    const inputType = schema.nodes[SHORT_ANSWER_INPUT_NODE_NAME];
    if (!headingType || !inputType) return null;

    const childCount = node.childCount;
    const first = node.firstChild;
    const second = node.childCount > 1 ? node.child(1) : null;
    const hasValidHeading =
        first &&
        first.type === headingType &&
        first.attrs.level >= 1 &&
        first.attrs.level <= 6;
    const hasValidInput = second && second.type === inputType;
    if (childCount === 2 && hasValidHeading && hasValidInput) return null;

    let text = 'Question';
    if (first && first.isTextblock) {
        text = first.textContent.trim() || 'Question';
    }
    const heading = headingType.create({ level: 2 }, schema.text(text));
    const inputNode = inputType.create({
        value:
            second && second.type === inputType
                ? (second.attrs.value ?? '')
                : '',
    });
    return node.type.create(node.attrs, [heading, inputNode]);
}

export const ShortAnswerNode = Node.create<ShortAnswerNodeOptions>({
    name: SHORT_ANSWER_NODE_NAME,

    group: 'block customNode',

    content: 'heading shortAnswerInput?',

    draggable: true,

    selectable: true,

    atom: false,

    addOptions() {
        return { HTMLAttributes: {} };
    },

    addAttributes() {
        return { ...shortAnswerAttributes };
    },

    parseHTML() {
        return [{ tag: 'div[data-type="short-answer-node"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                'data-type': 'short-answer-node',
            }),
            0,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ShortAnswerNodeComponent, {
            stopEvent: ({ event }) => {
                const el = (event.target as HTMLElement) ?? null;
                if (!el) return false;
                if (el.closest('.short-answer-node__input-wrap')) return true;
                return false;
            },
        });
    },

    addProseMirrorPlugins() {
        const extension = this;
        const shortAnswerTypeName = extension.name;

        const normalizationPlugin = new Plugin({
            key: new PluginKey('shortAnswerNormalization'),
            appendTransaction(_transactions, _oldState, newState) {
                const replacements: {
                    pos: number;
                    node: PMNode;
                    fixed: PMNode;
                }[] = [];
                newState.doc.descendants((node, pos) => {
                    if (node.type.name !== shortAnswerTypeName) return;
                    const fixed = normalizeShortAnswerContent(
                        node,
                        shortAnswerTypeName,
                    );
                    if (fixed != null) replacements.push({ pos, node, fixed });
                });
                if (replacements.length === 0) return null;
                let tr = newState.tr;
                replacements
                    .sort((a, b) => b.pos - a.pos)
                    .forEach(({ pos, node, fixed }) => {
                        tr = tr.replaceWith(pos, pos + node.nodeSize, fixed);
                    });
                return tr;
            },
        });

        const keymapPlugin = keymap({
            Backspace: (state, dispatch) => {
                const { selection } = state;
                const { $from } = selection;
                const shortAnswerNode = $from.node(1);
                if (shortAnswerNode.type.name !== shortAnswerTypeName)
                    return false;
                if ($from.parent.type.name !== 'heading') return false;
                if ($from.parentOffset > 0) return false;
                const from = $from.before(1);
                const to = from + shortAnswerNode.nodeSize;
                if (dispatch) {
                    const tr = state.tr.delete(from, to);
                    dispatch(tr);
                }
                return true;
            },
            Delete: (state, dispatch) => {
                const { selection } = state;
                if (!(selection instanceof NodeSelection)) return false;
                const node = selection.node;
                if (node.type.name !== shortAnswerTypeName) return false;
                if (dispatch) {
                    const from = selection.from;
                    const to = selection.to;
                    const tr = state.tr.delete(from, to);
                    dispatch(tr);
                }
                return true;
            },
            Enter: (state, dispatch) => {
                const { selection } = state;
                const { $from } = selection;
                const shortAnswerNode = $from.node(1);
                if (shortAnswerNode.type.name !== shortAnswerTypeName)
                    return false;
                if ($from.parent.type.name !== 'heading') return false;
                const paragraph = state.schema.nodes.paragraph;
                if (!paragraph) return false;
                const nodeEnd = $from.end(1);
                if (dispatch) {
                    let tr = state.tr.replaceWith(
                        nodeEnd,
                        nodeEnd,
                        paragraph.create(),
                    );
                    tr = tr.setSelection(
                        TextSelection.near(tr.doc.resolve(nodeEnd + 1)),
                    );
                    dispatch(tr);
                }
                return true;
            },
        });
        return [normalizationPlugin, keymapPlugin];
    },

    addCommands() {
        return {
            insertShortAnswer:
                (attrs = {}) =>
                ({ chain, state }) => {
                    const schema = state.schema;
                    if (!schema.nodes.heading) return false;
                    const { title: _title, ...restAttrs } =
                        attrs as Partial<ShortAnswerAttrs> & { title?: string };
                    const titleText = _title ?? 'Question';
                    const inputTypeName = state.schema.nodes[
                        SHORT_ANSWER_INPUT_NODE_NAME
                    ]
                        ? SHORT_ANSWER_INPUT_NODE_NAME
                        : null;
                    if (!inputTypeName) return false;
                    return chain()
                        .insertContent({
                            type: this.name,
                            attrs: {
                                inputType: 'text',
                                inputMode: null,
                                placeholder: null,
                                defaultAnswer: null,
                                required: false,
                                minChars: null,
                                maxChars: null,
                                minValue: null,
                                maxValue: null,
                                pattern: null,
                                hidden: false,
                                conditionalLogic: null,
                                ...restAttrs,
                            },
                            content: [
                                {
                                    type: 'heading',
                                    attrs: { level: 2 },
                                    content: [
                                        { type: 'text', text: titleText },
                                    ],
                                },
                                { type: inputTypeName, attrs: { value: '' } },
                            ],
                        })
                        .run();
                },
        };
    },
});

export default ShortAnswerNode;
