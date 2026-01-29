"use client"

import { useCallback, useId, useRef, useState } from "react"
import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import {
  deriveInputMode,
  type ShortAnswerAttrs,
  type InputType,
  type InputMode,
} from "./short-answer-types"
import "./short-answer-node.scss"

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

  if (inputType === "text" || inputType === "email" || inputType === "url") {
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

export function ShortAnswerNodeComponent(props: NodeViewProps) {
  const { node } = props
  const attrs = (node.attrs ?? {}) as ShortAnswerAttrs
  const inputType = (attrs.inputType ?? "text") as InputType
  const derivedInputMode = deriveInputMode(attrs.inputType, attrs.inputMode) as InputMode
  const placeholder = attrs.placeholder ?? ""
  const defaultAnswer = attrs.defaultAnswer ?? ""
  const required = attrs.required === true
  const hidden = attrs.hidden === true

  const [localValue, setLocalValue] = useState(defaultAnswer)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const titleId = useId()
  const errorId = useId()

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
  }, [validate])

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
        className="short-answer-node short-answer-node--hidden"
        data-type="short-answer-node"
      >
        <div className="short-answer-node__title-wrap" id={titleId}>
          <NodeViewContent as="div" />
        </div>
        <div className="short-answer-node__placeholder-hidden">
          Hidden field
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper
      className="short-answer-node"
      data-type="short-answer-node"
    >
      <div
        className="short-answer-node__title-wrap"
        id={titleId}
        role="heading"
        aria-level={2}
      >
        <NodeViewContent as="div" />
      </div>
      <div className="short-answer-node__input-wrap">
        {required && (
          <span
            aria-hidden="true"
            className="short-answer-node__required-badge"
            title="Required"
          >
            *
          </span>
        )}
        <input
          ref={inputRef}
          type={inputType}
          inputMode={derivedInputMode}
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-labelledby={titleId}
          aria-required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
          min={inputType === "number" && attrs.minValue != null ? attrs.minValue : undefined}
          max={inputType === "number" && attrs.maxValue != null ? attrs.maxValue : undefined}
          minLength={attrs.minChars ?? undefined}
          maxLength={attrs.maxChars ?? undefined}
          pattern={attrs.pattern ?? undefined}
          required={required}
        />
        {error && (
          <span
            id={errorId}
            role="alert"
            className="short-answer-node__error"
          >
            {error}
          </span>
        )}
      </div>
    </NodeViewWrapper>
  )
}

export default ShortAnswerNodeComponent
