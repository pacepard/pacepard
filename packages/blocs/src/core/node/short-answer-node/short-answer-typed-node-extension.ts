import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { Plugin, PluginKey, NodeSelection, TextSelection } from "@tiptap/pm/state"
import { keymap } from "@tiptap/pm/keymap"
import type { Node as PMNode } from "@tiptap/pm/model"
import { ShortAnswerNodeComponent } from "./short-answer-node.tsx"
import type { ShortAnswerAttrs } from "./short-answer-types.ts"
import type { InputType } from "./short-answer-types.ts"
import { shortAnswerAttributes } from "@/lib/attribute-config.ts"

const SHORT_ANSWER_INPUT_NODE_NAME = "shortAnswerInput"

function normalizeShortAnswerContent(
  node: PMNode,
  shortAnswerTypeName: string
): PMNode | null {
  if (node.type.name !== shortAnswerTypeName) return null
  const schema = node.type.schema
  const headingType = schema.nodes.heading
  const inputType = schema.nodes[SHORT_ANSWER_INPUT_NODE_NAME]
  if (!headingType || !inputType) return null

  const childCount = node.childCount
  const first = node.firstChild
  const second = node.childCount > 1 ? node.child(1) : null
  const hasValidHeading =
    first && first.type === headingType && first.attrs.level >= 1 && first.attrs.level <= 6
  const hasValidInput = second && second.type === inputType
  if (childCount === 2 && hasValidHeading && hasValidInput) return null

  let text = "Question"
  if (first && first.isTextblock) {
    text = first.textContent.trim() || "Question"
  }
  const heading = headingType.create(
    { level: 2 },
    schema.text(text)
  )
  const inputNode = inputType.create(
    { value: second && second.type === inputType ? second.attrs.value ?? "" : "" }
  )
  return node.type.create(node.attrs, [heading, inputNode])
}

const DEFAULT_ATTRS: Record<InputType, Partial<ShortAnswerAttrs>> = {
  text: { inputType: "text", placeholder: "Type a question", required: false },
  email: { inputType: "email", placeholder: "name@example.com", required: false },
  number: { inputType: "number", placeholder: "0", required: false },
  url: { inputType: "url", placeholder: "https://example.com", required: false },
  tel: { inputType: "tel", placeholder: "+1 (555) 000-0000", required: false },
}

function nodeNameForType(inputType: InputType): string {
  return "shortAnswer" + inputType.charAt(0).toUpperCase() + inputType.slice(1)
}

export interface ShortAnswerTypedNodeOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: Record<string, any>
}

/**
 * Creates a short-answer node for a fixed input type (one node per type).
 * Used for shortAnswerText, shortAnswerEmail, shortAnswerNumber, shortAnswerUrl, shortAnswerTel.
 */
export function createShortAnswerTypedNode(
  inputType: InputType
): ReturnType<typeof Node.create<ShortAnswerTypedNodeOptions>> {
  const name = nodeNameForType(inputType)
  const commandName = "insert" + name.charAt(0).toUpperCase() + name.slice(1) as
    | "insertShortAnswerText"
    | "insertShortAnswerEmail"
    | "insertShortAnswerNumber"
    | "insertShortAnswerUrl"
    | "insertShortAnswerTel"

  return Node.create<ShortAnswerTypedNodeOptions>({
    name,

    group: "block customNode",

    content: "heading shortAnswerInput?",

    draggable: true,

    selectable: true,

    atom: false,

    addOptions() {
      return { HTMLAttributes: {} }
    },

    addAttributes() {
      return {
        ...shortAnswerAttributes,
        inputType: { default: inputType },
      }
    },

    parseHTML() {
      return [{ tag: `div[data-type="short-answer-node"][data-node-name="${name}"]` }]
    },

    renderHTML({ HTMLAttributes }) {
      return [
        "div",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          "data-type": "short-answer-node",
          "data-node-name": name,
        }),
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
        key: new PluginKey(`shortAnswerTypedNormalization:${name}`),
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
          const parentNode = $from.node(1)
          if (parentNode.type.name !== shortAnswerTypeName) return false
          if ($from.parent.type.name !== "heading") return false
          if ($from.parentOffset > 0) return false
          const from = $from.before(1)
          const to = from + parentNode.nodeSize
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
          const parentNode = $from.node(1)
          if (parentNode.type.name !== shortAnswerTypeName) return false
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
      const defaults = DEFAULT_ATTRS[inputType]
      const nodeName = name
      return {
        [commandName]:
          (attrs = {}) =>
          ({ chain, state }: { chain: () => { insertContent: (content: unknown) => { run: () => boolean } }; state: { schema: { nodes: Record<string, unknown> } } }) => {
            const schema = state.schema
            if (!schema.nodes.heading) return false
            const { title: _title, ...restAttrs } = attrs as Partial<ShortAnswerAttrs> & { title?: string }
            const titleText = _title ?? "Question"
            const inputTypeName = schema.nodes[SHORT_ANSWER_INPUT_NODE_NAME]
              ? SHORT_ANSWER_INPUT_NODE_NAME
              : null
            if (!inputTypeName) return false
            return chain()
              .insertContent({
                type: nodeName,
                attrs: {
                  inputType,
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
                  ...defaults,
                  ...restAttrs,
                },
                content: [
                  {
                    type: "heading",
                    attrs: { level: 2 },
                    content: [{ type: "text", text: titleText }],
                  },
                  { type: inputTypeName, attrs: { value: "" } },
                ],
              })
              .run()
          },
      }
    },
  })
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    shortAnswerText: {
      insertShortAnswerText: (attrs?: Partial<ShortAnswerAttrs>) => ReturnType
    }
    shortAnswerEmail: {
      insertShortAnswerEmail: (attrs?: Partial<ShortAnswerAttrs>) => ReturnType
    }
    shortAnswerNumber: {
      insertShortAnswerNumber: (attrs?: Partial<ShortAnswerAttrs>) => ReturnType
    }
    shortAnswerUrl: {
      insertShortAnswerUrl: (attrs?: Partial<ShortAnswerAttrs>) => ReturnType
    }
    shortAnswerTel: {
      insertShortAnswerTel: (attrs?: Partial<ShortAnswerAttrs>) => ReturnType
    }
  }
}

export const ShortAnswerTextNode = createShortAnswerTypedNode("text")
export const ShortAnswerEmailNode = createShortAnswerTypedNode("email")
export const ShortAnswerNumberNode = createShortAnswerTypedNode("number")
export const ShortAnswerUrlNode = createShortAnswerTypedNode("url")
export const ShortAnswerTelNode = createShortAnswerTypedNode("tel")
