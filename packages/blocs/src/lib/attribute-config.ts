/**
 * Reusable Tiptap attribute config: define once, parse from HTML, render to HTML.
 * Use with addAttributes() so extensions don't duplicate parse/render logic.
 */

/** Parse a numeric data attribute from an element */
export function parseNumberAttr(
  element: HTMLElement,
  name: string
): number | null {
  const val = element.getAttribute(name)
  if (val == null || val === "") return null
  const num = Number(val)
  return Number.isFinite(num) ? num : null
}

/** Parse an optional boolean data attribute ("true" | "false") */
export function parseOptionalBool(
  element: HTMLElement,
  name: string
): boolean | null {
  const val = element.getAttribute(name)
  if (val == null || val === "") return null
  if (val === "true") return true
  if (val === "false") return false
  return null
}

export interface StringAttrOptions {
  default?: string | null
}

/** Create a Tiptap attribute spec for a string stored in a data attribute */
export function createStringAttr(
  key: string,
  dataAttr: string,
  options: StringAttrOptions = {}
): {
  default: string | null
  parseHTML: (el: HTMLElement) => string | null
  renderHTML: (attrs: Record<string, unknown>) => Record<string, string>
} {
  const defaultValue = options.default ?? null
  return {
    default: defaultValue,
    parseHTML: (el: HTMLElement) => el.getAttribute(dataAttr) ?? defaultValue,
    renderHTML: (attrs: Record<string, unknown>) => {
      const v = attrs[key]
      if (v == null || v === "") return {}
      return { [dataAttr]: String(v) }
    },
  }
}

export interface NumberAttrOptions {
  default?: number | null
}

/** Create a Tiptap attribute spec for a number stored in a data attribute */
export function createNumberAttr(
  key: string,
  dataAttr: string,
  options: NumberAttrOptions = {}
): {
  default: number | null
  parseHTML: (el: HTMLElement) => number | null
  renderHTML: (attrs: Record<string, unknown>) => Record<string, string>
} {
  const defaultValue = options.default ?? null
  return {
    default: defaultValue,
    parseHTML: (el: HTMLElement) => parseNumberAttr(el, dataAttr) ?? defaultValue,
    renderHTML: (attrs: Record<string, unknown>) => {
      const v = attrs[key]
      if (v == null || typeof v !== "number") return {}
      return { [dataAttr]: String(v) }
    },
  }
}

export interface BooleanAttrOptions {
  default?: boolean
}

/** Create a Tiptap attribute spec for a boolean stored in a data attribute ("true" when true) */
export function createBooleanAttr(
  key: string,
  dataAttr: string,
  options: BooleanAttrOptions = {}
): {
  default: boolean
  parseHTML: (el: HTMLElement) => boolean
  renderHTML: (attrs: Record<string, unknown>) => Record<string, string>
} {
  const defaultValue = options.default ?? false
  return {
    default: defaultValue,
    parseHTML: (el: HTMLElement) =>
      parseOptionalBool(el, dataAttr) ?? defaultValue,
    renderHTML: (attrs: Record<string, unknown>) => {
      if (!attrs[key]) return {}
      return { [dataAttr]: "true" }
    },
  }
}

export interface JsonAttrOptions<T = unknown> {
  default?: T | null
}

/** Create a Tiptap attribute spec for JSON-serialized data in a data attribute */
export function createJsonAttr<T = unknown>(
  key: string,
  dataAttr: string,
  options: JsonAttrOptions<T> = {}
): {
  default: T | null
  parseHTML: (el: HTMLElement) => T | null
  renderHTML: (attrs: Record<string, unknown>) => Record<string, string>
} {
  const defaultValue = options.default ?? null
  return {
    default: defaultValue,
    parseHTML: (el: HTMLElement) => {
      const raw = el.getAttribute(dataAttr)
      if (raw == null || raw === "") return defaultValue
      try {
        return JSON.parse(raw) as T
      } catch {
        return raw as T
      }
    },
    renderHTML: (attrs: Record<string, unknown>) => {
      const v = attrs[key]
      if (v == null) return {}
      const str =
        typeof v === "string" ? v : JSON.stringify(v)
      return { [dataAttr]: str }
    },
  }
}

// --- Short answer attribute config (composed from factories) ---

/** Reusable attribute specs for the shortAnswer node. Use in addAttributes(). */
export const shortAnswerAttributes = {
  inputType: {
    default: "text",
    parseHTML: (el: HTMLElement) =>
      el.getAttribute("data-input-type") || "text",
    renderHTML: (attrs: Record<string, unknown>) =>
      attrs.inputType ? { "data-input-type": String(attrs.inputType) } : {},
  },
  inputMode: createStringAttr("inputMode", "data-input-mode", {
    default: null,
  }),
  placeholder: createStringAttr("placeholder", "data-placeholder"),
  defaultAnswer: createStringAttr("defaultAnswer", "data-default-answer"),
  required: createBooleanAttr("required", "data-required"),
  minChars: createNumberAttr("minChars", "data-min-chars"),
  maxChars: createNumberAttr("maxChars", "data-max-chars"),
  minValue: createNumberAttr("minValue", "data-min-value"),
  maxValue: createNumberAttr("maxValue", "data-max-value"),
  pattern: createStringAttr("pattern", "data-pattern"),
  hidden: createBooleanAttr("hidden", "data-hidden"),
  conditionalLogic: createJsonAttr("conditionalLogic", "data-conditional-logic"),
} as const

/** Attribute specs for standalone form input nodes (formInputText, formInputEmail, etc.). No inputType (fixed per node). */
export const formInputAttributes = {
  value: createStringAttr("value", "data-value"),
  placeholder: createStringAttr("placeholder", "data-placeholder"),
  required: createBooleanAttr("required", "data-required"),
  minChars: createNumberAttr("minChars", "data-min-chars"),
  maxChars: createNumberAttr("maxChars", "data-max-chars"),
  minValue: createNumberAttr("minValue", "data-min-value"),
  maxValue: createNumberAttr("maxValue", "data-max-value"),
  pattern: createStringAttr("pattern", "data-pattern"),
} as const
