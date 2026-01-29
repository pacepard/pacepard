import { NotionEditor } from "@pacepard/blocs/editor"

/**
 * Editor page for /editor.
 */
export default function EditorPage() {
  return <NotionEditor room="default" placeholder="Start writing..." />
}
