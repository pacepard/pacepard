"use client"

import { useCallback, useEffect, useState } from "react"
import { type Editor } from "@tiptap/react"
import { NodeSelection, TextSelection } from "@tiptap/pm/state"

// --- Hooks ---
import { usePacepardEditor } from "@/hooks/use-pacepard-editor"

// --- Icons ---
import { TypeIcon } from "@/core/icons/type-icon"

// --- Lib ---
import {
  findNodePosition,
  getSelectedBlockNodes,
  isNodeInSchema,
  isNodeTypeSelected,
  isValidPosition,
  selectionWithinConvertibleTypes,
} from "@/utils/base-helper"

/**
 * Configuration for the short answer turn-into functionality
 */
export interface UseShortAnswerConfig {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onToggled?: () => void
}

/**
 * Returns whether we can turn the current selection into a short answer node.
 */
export function canToggleShortAnswer(
  editor: Editor | null,
  turnInto: boolean = true
): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isNodeInSchema("shortAnswer", editor)) return false
  if (isNodeTypeSelected(editor, ["image"])) return false

  if (!turnInto) {
    return editor.isActive("shortAnswer")
  }

  return selectionWithinConvertibleTypes(editor, [
    "paragraph",
    "heading",
    "bulletList",
    "orderedList",
    "taskList",
    "blockquote",
    "codeBlock",
    "shortAnswer",
  ])
}

/**
 * Checks if short answer is currently active
 */
export function isShortAnswerActive(editor: Editor | null): boolean {
  if (!editor) return false
  return editor.isActive("shortAnswer")
}

/**
 * Turns the current block into a short answer node (or no-op if already short answer).
 */
export function toggleShortAnswer(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canToggleShortAnswer(editor)) return false

  try {
    const view = editor.view
    let state = view.state
    let tr = state.tr

    const blocks = getSelectedBlockNodes(editor)
    const isPossibleToTurnInto =
      selectionWithinConvertibleTypes(editor, [
        "paragraph",
        "heading",
        "bulletList",
        "orderedList",
        "taskList",
        "blockquote",
        "codeBlock",
        "shortAnswer",
      ]) && blocks.length === 1

    if (
      (state.selection.empty || state.selection instanceof TextSelection) &&
      isPossibleToTurnInto
    ) {
      const pos = findNodePosition({
        editor,
        node: state.selection.$anchor.node(1),
      })?.pos
      if (!isValidPosition(pos)) return false

      tr = tr.setSelection(NodeSelection.create(state.doc, pos))
      view.dispatch(tr)
      state = view.state
    }

    const selection = state.selection

    if (selection instanceof NodeSelection && selection.node.type.name === "shortAnswer") {
      return true
    }

    let from: number
    let to: number

    if (selection instanceof NodeSelection) {
      from = selection.from
      to = selection.to
    } else {
      const { $from } = selection
      const depth = $from.depth
      const pos = $from.before(depth)
      const node = $from.node(depth)
      from = pos
      to = pos + node.nodeSize
    }

    editor
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertShortAnswer()
      .run()

    return true
  } catch {
    return false
  }
}

export function shouldShowShortAnswerButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props
  if (!editor || !editor.isEditable) return false
  if (!isNodeInSchema("shortAnswer", editor)) return false
  if (hideWhenUnavailable) return canToggleShortAnswer(editor)
  return true
}

/**
 * Hook for "Turn into Short answer" in the drag-context menu.
 * The short answer block is an input field: a question title (heading) plus a single-line
 * input with configurable type (text/email/number/url), validation, and placeholder.
 */
export function useShortAnswer(config?: UseShortAnswerConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onToggled,
  } = config || {}

  const { editor } = usePacepardEditor(providedEditor)
  const [isVisible, setIsVisible] = useState(true)
  const canToggleState = canToggleShortAnswer(editor)
  const isActive = editor?.isActive("shortAnswer") ?? false

  useEffect(() => {
    if (!editor) return
    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowShortAnswerButton({ editor, hideWhenUnavailable }))
    }
    handleSelectionUpdate()
    editor.on("selectionUpdate", handleSelectionUpdate)
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable])

  const handleToggle = useCallback(() => {
    if (!editor) return false
    const success = toggleShortAnswer(editor)
    if (success) onToggled?.()
    return success
  }, [editor, onToggled])

  return {
    isVisible,
    isActive,
    canToggle: canToggleState,
    handleToggle,
    label: "Short answer",
    Icon: TypeIcon,
  }
}
