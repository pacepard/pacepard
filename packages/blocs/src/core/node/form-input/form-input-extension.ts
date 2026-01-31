/**
 * Factory and extensions for standalone form input nodes (formInputText, formInputEmail, etc.).
 * Each input type is its own node with its own icon; required switch adds the required badge.
 */

import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import type { InputType } from "../short-answer-node/short-answer-types"
import { formInputAttributes } from "@/lib/attribute-config"
import { FormInputNodeView } from "./form-input-node-view"

export interface FormInputAttrs {
  value?: string | null
  placeholder?: string | null
  required?: boolean | null
  minChars?: number | null
  maxChars?: number | null
  minValue?: number | null
  maxValue?: number | null
  pattern?: string | null
}

const DEFAULT_PLACEHOLDERS: Record<InputType, string> = {
  text: "Type a question",
  email: "name@example.com",
  number: "0",
  url: "https://example.com",
  tel: "+1 (555) 000-0000",
}

function createFormInputExtension(inputType: InputType) {
  const name =
    "formInput" +
    (inputType === "text" ? "Text" : inputType.charAt(0).toUpperCase() + inputType.slice(1))

  const commandName =
    "insertFormInput" +
    (inputType === "text" ? "Text" : inputType.charAt(0).toUpperCase() + inputType.slice(1)) as
    | "insertFormInputText"
    | "insertFormInputEmail"
    | "insertFormInputNumber"
    | "insertFormInputUrl"
    | "insertFormInputTel"

  return Node.create({
    name,

    group: "block customNode",

    atom: true,

    selectable: true,

    draggable: true,

    addOptions() {
      return { HTMLAttributes: {} }
    },

    addAttributes() {
      return { ...formInputAttributes }
    },

    parseHTML() {
      return [{ tag: `div[data-type="form-input-${inputType}-node"]` }]
    },

    renderHTML({ HTMLAttributes }) {
      return [
        "div",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          "data-type": `form-input-${inputType}-node`,
        }),
        0,
      ]
    },

    addNodeView() {
      return ReactNodeViewRenderer(FormInputNodeView, {
        stopEvent: () => true,
      })
    },

    addCommands() {
      const nodeName = name
      const placeholder = DEFAULT_PLACEHOLDERS[inputType]
      return {
        [commandName]:
          (attrs: Partial<FormInputAttrs> = {}) =>
          ({ chain }: { chain: () => { insertContent: (c: unknown) => { run: () => boolean } } }) =>
            chain()
              .insertContent({
                type: nodeName,
                attrs: {
                  value: "",
                  placeholder,
                  required: false,
                  minChars: null,
                  maxChars: null,
                  minValue: null,
                  maxValue: null,
                  pattern: null,
                  ...attrs,
                },
              })
              .run(),
      }
    },
  })
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    formInputText: { insertFormInputText: (attrs?: Partial<FormInputAttrs>) => ReturnType }
    formInputEmail: { insertFormInputEmail: (attrs?: Partial<FormInputAttrs>) => ReturnType }
    formInputNumber: { insertFormInputNumber: (attrs?: Partial<FormInputAttrs>) => ReturnType }
    formInputUrl: { insertFormInputUrl: (attrs?: Partial<FormInputAttrs>) => ReturnType }
    formInputTel: { insertFormInputTel: (attrs?: Partial<FormInputAttrs>) => ReturnType }
  }
}

export const FormInputTextNode = createFormInputExtension("text")
export const FormInputEmailNode = createFormInputExtension("email")
export const FormInputNumberNode = createFormInputExtension("number")
export const FormInputUrlNode = createFormInputExtension("url")
export const FormInputTelNode = createFormInputExtension("tel")
