/**
 * Shared types for the short-answer node.
 * Exported for property group and consumers.
 */

/** HTML input type for the short-answer field */
export type InputType = "text" | "email" | "number" | "url" | "tel"

/** HTML inputmode for mobile keyboard */
export type InputMode = "text" | "email" | "numeric" | "tel"

/** Conditional logic stored as JSON-serializable shape (minimal; no backend evaluation in this phase) */
export type ConditionalLogic = string | Record<string, unknown> | null

export interface ShortAnswerAttrs {
  inputType?: InputType | null
  inputMode?: InputMode | null
  placeholder?: string | null
  defaultAnswer?: string | null
  required?: boolean | null
  minChars?: number | null
  maxChars?: number | null
  minValue?: number | null
  maxValue?: number | null
  pattern?: string | null
  hidden?: boolean | null
  conditionalLogic?: ConditionalLogic
}

/** Derive default inputMode from inputType when not set */
export function deriveInputMode(
  inputType: InputType | null | undefined,
  inputMode: InputMode | null | undefined
): InputMode {
  if (inputMode != null) return inputMode as InputMode
  switch (inputType) {
    case "number":
      return "numeric"
    case "email":
      return "email"
    case "tel":
      return "tel"
    case "text":
    case "url":
    default:
      return "text"
  }
}
