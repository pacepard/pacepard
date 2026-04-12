import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { keymap } from '@tiptap/pm/keymap';
import { NodeSelection } from '@tiptap/pm/state';
import { ShortAnswerInputNodeComponent } from './short-answer-input-node.tsx';

const SHORT_ANSWER_INPUT_NODE_NAME = 'shortAnswerInput';

export interface ShortAnswerInputNodeOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    HTMLAttributes: Record<string, any>;
}

export const ShortAnswerInputNode = Node.create<ShortAnswerInputNodeOptions>({
    name: SHORT_ANSWER_INPUT_NODE_NAME,

    group: 'block',
    content: '',
    atom: true,
    selectable: true,
    draggable: false,

    addOptions() {
        return { HTMLAttributes: {} };
    },

    addAttributes() {
        return {
            value: {
                default: '',
                parseHTML: (el: HTMLElement) =>
                    el.getAttribute('data-value') ?? '',
                renderHTML: (attrs: { value?: string | null }) =>
                    attrs.value != null && attrs.value !== ''
                        ? { 'data-value': attrs.value }
                        : {},
            },
        };
    },

    parseHTML() {
        return [{ tag: 'div[data-type="short-answer-input-node"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                'data-type': 'short-answer-input-node',
            }),
            0,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ShortAnswerInputNodeComponent, {
            stopEvent: () => true,
        });
    },

    addProseMirrorPlugins() {
        const extension = this;
        const name = extension.name;

        return [
            keymap({
                Backspace: (state, dispatch) => {
                    const { selection } = state;
                    if (!(selection instanceof NodeSelection)) return false;
                    if (selection.node.type.name !== name) return false;
                    const { from } = selection;
                    const tr = state.tr.setNodeMarkup(from, undefined, {
                        value: '',
                    });
                    if (dispatch) dispatch(tr);
                    return true;
                },
                Delete: (state, dispatch) => {
                    const { selection } = state;
                    if (!(selection instanceof NodeSelection)) return false;
                    if (selection.node.type.name !== name) return false;
                    const { from } = selection;
                    const tr = state.tr.setNodeMarkup(from, undefined, {
                        value: '',
                    });
                    if (dispatch) dispatch(tr);
                    return true;
                },
            }),
        ];
    },
});

export default ShortAnswerInputNode;
