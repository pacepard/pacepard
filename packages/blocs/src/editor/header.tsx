import { ThemeToggle } from "./theme-toggle"

// --- Tiptap UI ---
import { UndoRedoButton } from "@pacepard/blocs/ui/undo-redo-button"

// --- UI Primitives ---
import { Spacer } from "@pacepard/blocs/primitives/spacer"
import { Separator } from "@pacepard/blocs/primitives/separator"
import { ButtonGroup } from "@pacepard/blocs/primitives/button"

// --- Styles ---
import "./header.scss"

import { CollaborationUsers } from "./collaboration-users"

export function PaceparditorHeader() {
  return (
    <header className="pacepard-like-editor-header">
      <Spacer />
      <div className="pacepard-like-editor-header-actions">
        <ButtonGroup orientation="horizontal">
          <UndoRedoButton action="undo" />
          <UndoRedoButton action="redo" />
        </ButtonGroup>

        <Separator />

        <ThemeToggle />

        <Separator />

        <CollaborationUsers />
      </div>
    </header>
  )
}
