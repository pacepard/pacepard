"use client"

import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import "./short-answer-node.scss"

/**
 * Short answer block: renders heading + shortAnswerInput (both are children in the document).
 * The heading is the first child (label/title); the input is rendered by ShortAnswerInputNodeComponent.
 * Uses node.attrs.required to drive strict UI: inline asterisk after label when required.
 */
const TYPED_NODE_NAMES = ["shortAnswerText", "shortAnswerEmail", "shortAnswerNumber", "shortAnswerUrl", "shortAnswerTel"]

export function ShortAnswerNodeComponent(props: NodeViewProps) {
  const { node } = props
  const required = node.attrs.required === true
  const isTypedNode = TYPED_NODE_NAMES.includes(node.type.name)

  return (
    <NodeViewWrapper
      className="short-answer-node"
      data-type="short-answer-node"
      data-node-name={isTypedNode ? node.type.name : undefined}
      data-required={required ? "true" : undefined}
    >
      <NodeViewContent as="div" className="short-answer-node__content" />
    </NodeViewWrapper>
  )
}

export default ShortAnswerNodeComponent
