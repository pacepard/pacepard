import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { Plugin, PluginKey, NodeSelection, TextSelection } from "@tiptap/pm/state"
import { keymap } from "@tiptap/pm/keymap"
import type { Node as PMNode } from "@tiptap/pm/model"
import { ShortAnswerNodeComponent } from "./short-answer-node.tsx"
import type {
  ShortAnswerAttrs,
  InputType,
  InputMode,
} from "./short-answer-types"

export type { ShortAnswerAttrs, InputType, InputMode } from "./short-answer-types"

export interface ShortAnswerNodeOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: Record<string, any>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    shortAnswer: {
      /**
       * Insert a short-answer node with one heading (title) and optional attrs.
       */
      insertShortAnswer: (attrs?: Partial<ShortAnswerAttrs>) => ReturnType
    }
  }
}

const SHORT_ANSWER_NODE_NAME = "shortAnswer"

function parseNumberAttr(
  element: HTMLElement,
  name: string
): number | null {
  const val = element.getAttribute(name)
  if (val == null || val === "") return null
  const num = Number(val)
  return Number.isFinite(num) ? num : null
}

function parseOptionalBool(element: HTMLElement, name: string): boolean | null {
  const val = element.getAttribute(name)
  if (val == null || val === "") return null
  if (val === "true") return true
  if (val === "false") return false
  return null
}

/**
 * Normalize short-answer content to exactly one heading (level 2).
 * Used on paste and when content is invalid.
 */
function normalizeShortAnswerContent(
  node: PMNode,
  shortAnswerTypeName: string
): PMNode | null {
  if (node.type.name !== shortAnswerTypeName) return null
  const schema = node.type.schema
  const headingType = schema.nodes.heading
  if (!headingType) return null

  const childCount = node.childCount
  if (childCount === 1 && node.firstChild) {
    const first = node.firstChild
    if (first.type === headingType) {
      const level = first.attrs.level != null ? first.attrs.level : 2
      if (level >= 1 && level <= 6) return null
    }
  }

  let text = "Question"
  if (node.childCount > 0 && node.firstChild) {
    const first = node.firstChild
    if (first.isTextblock) {
      text = first.textContent.trim() || "Question"
    }
  }

  const heading = headingType.create(
    { level: 2 },
    schema.text(text)
  )
  return node.type.create(node.attrs, heading)
}

export const ShortAnswerNode = Node.create<ShortAnswerNodeOptions>({
  name: SHORT_ANSWER_NODE_NAME,

  group: "block customNode",

  content: "heading",

  draggable: true,

  selectable: true,

  atom: false,

  addOptions() {
    return { HTMLAttributes: {} }
  },

  addAttributes() {
    return {
      inputType: {
        default: "text" as InputType,
        parseHTML: (el: HTMLElement) =>
          (el.getAttribute("data-input-type") as InputType) || "text",
        renderHTML: (attrs: ShortAnswerAttrs) =>
          attrs.inputType
            ? { "data-input-type": attrs.inputType }
            : {},
      },
      inputMode: {
        default: null as InputMode | null,
        parseHTML: (el: HTMLElement) =>
          (el.getAttribute("data-input-mode") as InputMode) || null,
        renderHTML: (attrs: ShortAnswerAttrs) =>
          attrs.inputMode
            ? { "data-input-mode": attrs.inputMode }
            : {},
      },
      placeholder: {
        default: null as string | null,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute("data-placeholder") ?? null,
        renderHTML: (attrs: ShortAnswerAttrs) =>
          attrs.placeholder != null
            ? { "data-placeholder": attrs.placeholder }
            : {},
      },
      defaultAnswer: {
        default: null as string | null,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute("data-default-answer") ?? null,
        renderHTML: (attrs: ShortAnswerAttrs) =>
          attrs.defaultAnswer != null
            ? { "data-default-answer": attrs.defaultAnswer }
            : {},
      },
      required: {
        default: false,
        parseHTML: (el: HTMLElement) =>
          parseOptionalBool(el, "data-required") ?? false,
        renderHTML: (attrs: ShortAnswerAttrs) =>
          attrs.required ? { "data-required": "true" } : {},
      },
      minChars: {
        default: null as number | null,
        parseHTML: (el: HTMLElement) =>
          parseNumberAttr(el, "data-min-chars"),
        renderHTML: (attrs: ShortAnswerAttrs) =>
          attrs.minChars != null ? { "data-min-chars": String(attrs.minChars) } : {},
      },
      maxChars: {
        default: null as number | null,
        parseHTML: (el: HTMLElement) =>
          parseNumberAttr(el, "data-max-chars"),
        renderHTML: (attrs: ShortAnswerAttrs) =>
          attrs.maxChars != null ? { "data-max-chars": String(attrs.maxChars) } : {},
      },
      minValue: {
        default: null as number | null,
        parseHTML: (el: HTMLElement) =>
          parseNumberAttr(el, "data-min-value"),
        renderHTML: (attrs: ShortAnswerAttrs) =>
          attrs.minValue != null ? { "data-min-value": String(attrs.minValue) } : {},
      },
      maxValue: {
        default: null as number | null,
        parseHTML: (el: HTMLElement) =>
          parseNumberAttr(el, "data-max-value"),
        renderHTML: (attrs: ShortAnswerAttrs) =>
          attrs.maxValue != null ? { "data-max-value": String(attrs.maxValue) } : {},
      },
      pattern: {
        default: null as string | null,
        parseHTML: (el: HTMLElement) =>
          el.getAttribute("data-pattern") ?? null,
        renderHTML: (attrs: ShortAnswerAttrs) =>
          attrs.pattern != null ? { "data-pattern": attrs.pattern } : {},
      },
      hidden: {
        default: false,
        parseHTML: (el: HTMLElement) =>
          parseOptionalBool(el, "data-hidden") ?? false,
        renderHTML: (attrs: ShortAnswerAttrs) =>
          attrs.hidden ? { "data-hidden": "true" } : {},
      },
      conditionalLogic: {
        default: null,
        parseHTML: (el: HTMLElement) => {
          const raw = el.getAttribute("data-conditional-logic")
          if (raw == null || raw === "") return null
          try {
            return JSON.parse(raw) as ShortAnswerAttrs["conditionalLogic"]
          } catch {
            return raw
          }
        },
        renderHTML: (attrs: ShortAnswerAttrs) =>
          attrs.conditionalLogic != null
            ? {
                "data-conditional-logic":
                  typeof attrs.conditionalLogic === "string"
                    ? attrs.conditionalLogic
                    : JSON.stringify(attrs.conditionalLogic),
              }
            : {},
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="short-answer-node"]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    const dataAttrs: Record<string, string> = {
      "data-type": "short-answer-node",
    }
    const attrs = node.attrs as ShortAnswerAttrs
    if (attrs.inputType) dataAttrs["data-input-type"] = attrs.inputType
    if (attrs.inputMode) dataAttrs["data-input-mode"] = attrs.inputMode
    if (attrs.placeholder != null) dataAttrs["data-placeholder"] = attrs.placeholder
    if (attrs.defaultAnswer != null) dataAttrs["data-default-answer"] = attrs.defaultAnswer
    if (attrs.required) dataAttrs["data-required"] = "true"
    if (attrs.minChars != null) dataAttrs["data-min-chars"] = String(attrs.minChars)
    if (attrs.maxChars != null) dataAttrs["data-max-chars"] = String(attrs.maxChars)
    if (attrs.minValue != null) dataAttrs["data-min-value"] = String(attrs.minValue)
    if (attrs.maxValue != null) dataAttrs["data-max-value"] = String(attrs.maxValue)
    if (attrs.pattern != null) dataAttrs["data-pattern"] = attrs.pattern
    if (attrs.hidden) dataAttrs["data-hidden"] = "true"
    if (attrs.conditionalLogic != null) {
      dataAttrs["data-conditional-logic"] =
        typeof attrs.conditionalLogic === "string"
          ? attrs.conditionalLogic
          : JSON.stringify(attrs.conditionalLogic)
    }
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, dataAttrs),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ShortAnswerNodeComponent, {
      stopEvent: ({ event }) => {
        const el = (event.target as HTMLElement) ?? null
        if (!el) return false
        if (el.closest(".short-answer-node__input-wrap")) return true
        return false
      },
    })
  },

  addProseMirrorPlugins() {
    const extension = this
    const shortAnswerTypeName = extension.name

    const normalizationPlugin = new Plugin({
      key: new PluginKey("shortAnswerNormalization"),
      appendTransaction(_transactions, _oldState, newState) {
        const replacements: { pos: number; node: PMNode; fixed: PMNode }[] = []
        newState.doc.descendants((node, pos) => {
          if (node.type.name !== shortAnswerTypeName) return
          const fixed = normalizeShortAnswerContent(node, shortAnswerTypeName)
          if (fixed != null) replacements.push({ pos, node, fixed })
        })
        if (replacements.length === 0) return null
        let tr = newState.tr
        replacements
          .sort((a, b) => b.pos - a.pos)
          .forEach(({ pos, node, fixed }) => {
            tr = tr.replaceWith(pos, pos + node.nodeSize, fixed)
          })
        return tr
      },
    })

    const keymapPlugin = keymap({
      Backspace: (state, dispatch) => {
        const { selection } = state
        const { $from } = selection
        const shortAnswerNode = $from.node(1)
        if (shortAnswerNode.type.name !== shortAnswerTypeName) return false
        if ($from.parent.type.name !== "heading") return false
        if ($from.parentOffset > 0) return false
        const from = $from.before(1)
        const to = from + shortAnswerNode.nodeSize
        if (dispatch) {
          const tr = state.tr.delete(from, to)
          dispatch(tr)
        }
        return true
      },
      Delete: (state, dispatch) => {
        const { selection } = state
        if (!(selection instanceof NodeSelection)) return false
        const node = selection.node
        if (node.type.name !== shortAnswerTypeName) return false
        if (dispatch) {
          const from = selection.from
          const to = selection.to
          const tr = state.tr.delete(from, to)
          dispatch(tr)
        }
        return true
      },
      Enter: (state, dispatch) => {
        const { selection } = state
        const { $from } = selection
        const shortAnswerNode = $from.node(1)
        if (shortAnswerNode.type.name !== shortAnswerTypeName) return false
        if ($from.parent.type.name !== "heading") return false
        const paragraph = state.schema.nodes.paragraph
        if (!paragraph) return false
        const nodeEnd = $from.end(1)
        if (dispatch) {
          let tr = state.tr.replaceWith(nodeEnd, nodeEnd, paragraph.create())
          tr = tr.setSelection(
            TextSelection.near(tr.doc.resolve(nodeEnd + 1))
          )
          dispatch(tr)
        }
        return true
      },
    })
    return [normalizationPlugin, keymapPlugin]
  },

  addCommands() {
    return {
      insertShortAnswer:
        (attrs = {}) =>
        ({ chain, state }) => {
          const schema = state.schema
          if (!schema.nodes.heading) return false
          const { title: _title, ...restAttrs } = attrs as Partial<ShortAnswerAttrs> & { title?: string }
          const titleText = _title ?? "Question"
          return chain()
            .insertContent({
              type: this.name,
              attrs: {
                inputType: "text",
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
                  type: "heading",
                  attrs: { level: 2 },
                  content: [{ type: "text", text: titleText }],
                },
              ],
            })
            .run()
        },
    }
  },
})

export default ShortAnswerNode
