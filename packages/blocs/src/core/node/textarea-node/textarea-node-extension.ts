/**
 * Extension for standalone textarea node.
 * Multi-line text input field with validation support.
 */

import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { createStringAttr, createBooleanAttr, createNumberAttr } from "@/lib/attribute-config"
import { TextAreaNodeView } from "./textarea-node-view"
import type { TextAreaNodeAttrs } from "./textarea-node-types"

export interface TextAreaNodeOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    longAnswer: {
      insertLongAnswer: (attrs?: Partial<TextAreaNodeAttrs>) => ReturnType
    }
  }
}

const DEFAULT_PLACEHOLDER = "Type your answer..."

/** Attribute specs for textarea node. */
const textareaAttributes = {
  value: createStringAttr("value", "data-value"),
  placeholder: createStringAttr("placeholder", "data-placeholder"),
  required: createBooleanAttr("required", "data-required"),
  minChars: createNumberAttr("minChars", "data-min-chars"),
  maxChars: createNumberAttr("maxChars", "data-max-chars"),
  rows: createNumberAttr("rows", "data-rows"),
} as const

export const TextAreaNode = Node.create<TextAreaNodeOptions>({
  name: "longAnswer",

  group: "block customNode",

  atom: true,

  selectable: true,

  draggable: true,

  addOptions() {
    return { HTMLAttributes: {} }
  },

  addAttributes() {
    return { ...textareaAttributes }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="long-answer-node"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "long-answer-node",
      }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(TextAreaNodeView, {
      stopEvent: () => true,
    })
  },

  addCommands() {
    const nodeName = "longAnswer"
    return {
      insertLongAnswer:
        (attrs: Partial<TextAreaNodeAttrs> = {}) =>
        ({ chain }) =>
          chain()
            .insertContent({
              type: nodeName,
              attrs: {
                value: "",
                placeholder: DEFAULT_PLACEHOLDER,
                required: false,
                minChars: null,
                maxChars: null,
                rows: 4,
                ...attrs,
              },
            })
            .run(),
    }
  },
})

export default TextAreaNode
