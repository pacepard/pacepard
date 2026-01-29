# Short Answer Node

Tiptap custom node for a short-answer form block: an editable question title (heading) and a single-line input with configurable type and validation.

## Collaboration (Yjs)

- **Title:** The heading content (question title) is **collaborative**. Concurrent edits to the title are resolved by the collaboration layer (Yjs/CRDT) as usual.
- **Attributes:** Input type, placeholder, required, min/max, hidden, conditional logic, etc. are **metadata**. Concurrent updates to attrs are **last-write-wins** (or per-attr LWW if the collab layer supports it). There is no custom merge for short-answer attrs.

## Copy behavior

- **Selecting only the heading text and copying:** Copies **text only** (plain or rich text of the heading), not the whole short-answer block. Pasting elsewhere in the editor pastes that text (e.g. as paragraph or inline).
- **Copying the node via drag handle** (node selected, copy): Copies the **full short-answer block** (heading + attrs). Pasting inserts a full short-answer node with the same content and attrs.

Implementation relies on ProseMirror’s default behavior: copying a node selection copies the node; copying a text selection copies the selected content. The drag handle selects the whole `shortAnswer` node so copy duplicates the block.
