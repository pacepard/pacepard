import { ThemeToggle } from "@/notion-like/notion-like-editor-theme-toggle"

// --- Blocs UI ---
import { UndoRedoButton } from "@pacepard/blocs/ui/undo-redo-button"

// --- UI Primitives ---
import { Spacer } from "@pacepard/blocs/primitives/spacer"
import { Separator } from "@pacepard/blocs/primitives/separator"
import { ButtonGroup } from "@pacepard/blocs/primitives/button"

// --- Styles ---
import "@/notion-like/notion-like-editor-header.scss"

import { CollaborationUsers } from "@/notion-like/notion-like-editor-collaboration-users"

export function NotionEditorHeader() {
  return (
    <header className="notion-like-editor-header">
      <Spacer />
      <div className="notion-like-editor-header-actions">
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
