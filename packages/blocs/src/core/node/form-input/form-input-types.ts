/**
 * Types for standalone form input nodes (formInputText, formInputEmail, etc.).
 */

import type { InputType, InputMode } from "../short-answer-node/short-answer-types"
import { deriveInputMode } from "../short-answer-node/short-answer-types"

export type { InputType, InputMode }

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

const FORM_INPUT_NODE_TO_TYPE: Record<string, InputType> = {
  formInputText: "text",
  formInputEmail: "email",
  formInputNumber: "number",
  formInputUrl: "url",
  formInputTel: "tel",
}

export function getInputTypeFromFormInputNodeName(nodeName: string): InputType {
  return FORM_INPUT_NODE_TO_TYPE[nodeName] ?? "text"
}

export { deriveInputMode }
