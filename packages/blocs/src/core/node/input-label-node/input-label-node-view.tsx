"use client"

import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import { RequiredBadge } from "@/core/primitives/required-badge"
import "./input-label-node.scss"

const DEFAULT_PLACEHOLDER = "label"

export function InputLabelNodeView(props: NodeViewProps) {
  const { node } = props
  const level = Math.min(6, Math.max(1, node.attrs.level ?? 4))
  const placeholder = node.attrs.placeholder ?? DEFAULT_PLACEHOLDER
  const isEmpty = !node.textContent || node.textContent.trim().length === 0
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <NodeViewWrapper className="input-label-node-wrap" data-type="input-label">
      <HeadingTag
        className="input-label-node__heading"
        data-placeholder={placeholder}
        data-empty={isEmpty ? "true" : undefined}
        data-level={level}
      >
        <NodeViewContent as="div" className="input-label-node__content" />
        <RequiredBadge className="input-label-node__required-badge" />
      </HeadingTag>
    </NodeViewWrapper>
  )
}

export default InputLabelNodeView
