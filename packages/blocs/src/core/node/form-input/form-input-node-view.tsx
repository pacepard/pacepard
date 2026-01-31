"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper } from "@tiptap/react"
import type { InputType, InputMode } from "../short-answer-node/short-answer-types"
import { deriveInputMode } from "../short-answer-node/short-answer-types"
import type { FormInputAttrs } from "./form-input-types"
import { getInputTypeFromFormInputNodeName } from "./form-input-types"
import { TypeIcon } from "@/core/icons/type-icon"
import { AtSignIcon } from "@/core/icons/at-sign-icon"
import { LinkIcon } from "@/core/icons/link-icon"
import { HashIcon } from "@/core/icons/hash-icon"
import { PhoneIcon } from "@/core/icons/phone-icon"
import { RequiredBadge } from "@/core/primitives/required-badge"
import "./form-input.scss"

const INPUT_TYPE_ICON: Record<InputType, React.ComponentType<{ className?: string }>> = {
  text: TypeIcon,
  email: AtSignIcon,
  url: LinkIcon,
  number: HashIcon,
  tel: PhoneIcon,
}

function getValidationMessage(
  input: HTMLInputElement,
  attrs: FormInputAttrs,
  inputType: InputType
): string | null {
  const value = input.value
  const required = attrs.required === true

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
        // ignore
      }
    }
  }

  if (value !== "" && input.validationMessage) {
    return input.validationMessage
  }
  return null
}

export function FormInputNodeView(props: NodeViewProps) {
  const { node, updateAttributes } = props
  const inputType = getInputTypeFromFormInputNodeName(node.type.name) as InputType
  const derivedInputMode = deriveInputMode(inputType, null) as InputMode
  const attrs = (node.attrs ?? {}) as FormInputAttrs
  const value = (attrs.value ?? "") as string
  const placeholder = attrs.placeholder ?? ""
  const required = attrs.required === true

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
    const msg = getValidationMessage(input, attrs, inputType)
    setError(msg)
    input.setCustomValidity(msg ?? "")
    input.setAttribute("aria-invalid", msg ? "true" : "false")
    if (msg) input.setAttribute("aria-describedby", errorId)
    else input.removeAttribute("aria-describedby")
  }, [attrs, inputType, errorId])

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

  const InputSuffixIcon = INPUT_TYPE_ICON[inputType]

  return (
    <NodeViewWrapper
      className="form-input-wrap"
      data-type={`form-input-${inputType}-node`}
    >
      {required && (
        <RequiredBadge className="form-input-required-badge" />
      )}
      <div className="form-input-inner">
        <input
          ref={inputRef}
          type={inputType}
          inputMode={derivedInputMode}
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-label={`${inputType} input`}
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
          className="form-input-field"
        />
        <span aria-hidden="true" className="form-input-suffix-icon">
          <InputSuffixIcon className="form-input-suffix-icon-svg" />
        </span>
      </div>
      {error && (
        <span id={errorId} role="alert" className="form-input-error">
          {error}
        </span>
      )}
    </NodeViewWrapper>
  )
}

export default FormInputNodeView
