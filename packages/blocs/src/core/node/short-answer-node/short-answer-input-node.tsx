"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper } from "@tiptap/react"
import {
  deriveInputMode,
  type ShortAnswerAttrs,
  type InputType,
  type InputMode,
} from "./short-answer-types.ts"
import { TypeIcon } from "@/core/icons/type-icon"
import { AtSignIcon } from "@/core/icons/at-sign-icon"
import { LinkIcon } from "@/core/icons/link-icon"
import { HashIcon } from "@/core/icons/hash-icon"
import { PhoneIcon } from "@/core/icons/phone-icon"
import { RequiredBadge } from "@/core/primitives/required-badge"
import "./short-answer-node.scss"

const INPUT_TYPE_ICON: Record<InputType, React.ComponentType<{ className?: string }>> = {
  text: TypeIcon,
  email: AtSignIcon,
  url: LinkIcon,
  number: HashIcon,
  tel: PhoneIcon,
}

function getValidationMessage(
  input: HTMLInputElement,
  attrs: ShortAnswerAttrs
): string | null {
  const value = input.value
  const required = attrs.required === true
  const inputType = (attrs.inputType ?? "text") as InputType

  if (required && !value.trim()) {
    return "This field is required."
  }

  if (inputType === "number") {
    const num = value === "" ? NaN : Number(value)
    if (value !== "" && Number.isNaN(num)) {
      return "Please enter a valid number."
    }
    const min = attrs.minValue
    const max = attrs.maxValue
    if (min != null && num < min) return `Minimum value is ${min}.`
    if (max != null && num > max) return `Maximum value is ${max}.`
    return null
  }

  if (inputType === "text" || inputType === "email" || inputType === "url" || inputType === "tel") {
    const len = value.length
    const minChars = attrs.minChars
    const maxChars = attrs.maxChars
    if (minChars != null && len < minChars) {
      return `Minimum ${minChars} characters.`
    }
    if (maxChars != null && len > maxChars) {
      return `Maximum ${maxChars} characters.`
    }
    if (attrs.pattern && value !== "") {
      try {
        const re = new RegExp(attrs.pattern)
        if (!re.test(value)) return "Invalid format."
      } catch {
        // ignore invalid pattern
      }
    }
  }

  if (value !== "" && input.validationMessage) {
    return input.validationMessage
  }
  return null
}

const TYPED_NODE_TO_INPUT_TYPE: Record<string, InputType> = {
  shortAnswerText: "text",
  shortAnswerEmail: "email",
  shortAnswerNumber: "number",
  shortAnswerUrl: "url",
  shortAnswerTel: "tel",
}

function getParentShortAnswerAttrs(
  editor: NodeViewProps["editor"],
  getPos: NodeViewProps["getPos"]
): ShortAnswerAttrs | null {
  const pos = typeof getPos === "function" ? getPos() : getPos
  if (pos == null || !editor) return null
  const $pos = editor.state.doc.resolve(pos)
  const depth = $pos.depth
  for (let d = depth - 1; d >= 0; d--) {
    const node = $pos.node(d)
    const name = node.type.name
    if (name === "shortAnswer") {
      return (node.attrs ?? {}) as ShortAnswerAttrs
    }
    const derivedType = TYPED_NODE_TO_INPUT_TYPE[name]
    if (derivedType != null) {
      const attrs = (node.attrs ?? {}) as ShortAnswerAttrs
      return { ...attrs, inputType: derivedType }
    }
  }
  return null
}

export function ShortAnswerInputNodeComponent(props: NodeViewProps) {
  const { node, editor, getPos, updateAttributes } = props
  const value = (node.attrs.value ?? "") as string
  const parentAttrs = getParentShortAnswerAttrs(editor, getPos)
  const attrs: ShortAnswerAttrs = parentAttrs ?? {}
  const inputType = (attrs.inputType ?? "text") as InputType
  const derivedInputMode = deriveInputMode(
    attrs.inputType,
    attrs.inputMode
  ) as InputMode
  const placeholder = attrs.placeholder ?? ""
  const required = attrs.required === true
  const hidden = attrs.hidden === true

  const [localValue, setLocalValue] = useState(value)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const errorId = useId()

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const validate = useCallback(() => {
    const input = inputRef.current
    if (!input) return
    const msg = getValidationMessage(input, attrs)
    setError(msg)
    input.setCustomValidity(msg ?? "")
    input.setAttribute("aria-invalid", msg ? "true" : "false")
    if (msg) input.setAttribute("aria-describedby", errorId)
    else input.removeAttribute("aria-describedby")
  }, [attrs, errorId])

  const handleBlur = useCallback(() => {
    setTouched(true)
    validate()
    updateAttributes({ value: localValue })
  }, [validate, localValue, updateAttributes])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value)
      if (touched) validate()
    },
    [touched, validate]
  )

  if (hidden) {
    return (
      <NodeViewWrapper
        className="short-answer-node__input-wrap"
        data-type="short-answer-input-node"
      >
        <div className="short-answer-node__placeholder-hidden">
          Hidden field
        </div>
      </NodeViewWrapper>
    )
  }

  const InputSuffixIcon = INPUT_TYPE_ICON[inputType]

  return (
    <NodeViewWrapper
      className="short-answer-node__input-wrap"
      data-type="short-answer-input-node"
    >
      <RequiredBadge className="short-answer-node__required-badge" />
      <div className="short-answer-node__input-inner">
        <input
          ref={inputRef}
          type={inputType}
          inputMode={derivedInputMode}
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-label="Short answer"
          aria-required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          min={
            inputType === "number" && attrs.minValue != null
              ? attrs.minValue
              : undefined
          }
          max={
            inputType === "number" && attrs.maxValue != null
              ? attrs.maxValue
              : undefined
          }
          minLength={attrs.minChars ?? undefined}
          maxLength={attrs.maxChars ?? undefined}
          pattern={attrs.pattern ?? undefined}
          required={required}
          className="short-answer-node__input--with-icon"
        />
        <span
          aria-hidden="true"
          className="short-answer-node__input-end-icon"
        >
          <InputSuffixIcon className="short-answer-node__input-end-icon-svg" />
        </span>
      </div>
      {error && (
        <span
          id={errorId}
          role="alert"
          className="short-answer-node__error"
        >
          {error}
        </span>
      )}
    </NodeViewWrapper>
  )
}

export default ShortAnswerInputNodeComponent
