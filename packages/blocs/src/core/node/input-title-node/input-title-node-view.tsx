"use client"

import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import { RequiredBadge } from "@/core/primitives/required-badge"
import "./input-title-node.scss"

const DEFAULT_PLACEHOLDER = "Type a question"

export function InputTitleNodeView(props: NodeViewProps) {
  const { node } = props
  const level = Math.min(6, Math.max(1, node.attrs.level ?? 2))
  const placeholder = node.attrs.placeholder ?? DEFAULT_PLACEHOLDER
  const isEmpty = !node.textContent || node.textContent.trim().length === 0
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <NodeViewWrapper className="input-title-node-wrap" data-type="input-title">
      <HeadingTag
        className="input-title-node__heading"
        data-placeholder={placeholder}
        data-empty={isEmpty ? "true" : undefined}
        data-level={level}
      >
        <NodeViewContent as="div" className="input-title-node__content" />
        <RequiredBadge className="input-title-node__required-badge" />
      </HeadingTag>
    </NodeViewWrapper>
  )
}

export default InputTitleNodeView
