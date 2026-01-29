import { useParams } from "react-router-dom"
import { NotionEditor } from "@/core/editor/editor"

/**
 * Editor page for /editor and /editor/:roomId.
 * Uses "default" room when no roomId in URL.
 */
export default function EditorPage() {
  const { roomId } = useParams<{ roomId?: string }>()
  const room = roomId ?? "default"

  return <NotionEditor room={room} placeholder="Start writing..." />
}
