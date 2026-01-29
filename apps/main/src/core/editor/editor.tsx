"use client"

import { useContext, useEffect } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import type { Doc as YDoc } from "yjs"
import type { TiptapCollabProvider } from "@tiptap-pro/provider"
import { createPortal } from "react-dom"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Mention } from "@tiptap/extension-mention"
import { TaskList, TaskItem } from "@tiptap/extension-list"
import { Color, TextStyle } from "@tiptap/extension-text-style"
import { Placeholder, Selection } from "@tiptap/extensions"
import { Collaboration, isChangeOrigin } from "@tiptap/extension-collaboration"
import { CollaborationCaret } from "@tiptap/extension-collaboration-caret"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Superscript } from "@tiptap/extension-superscript"
import { Subscript } from "@tiptap/extension-subscript"
import { TextAlign } from "@tiptap/extension-text-align"
import { Mathematics } from "@tiptap/extension-mathematics"
import { Ai } from "@tiptap-pro/extension-ai"
import { UniqueID } from "@tiptap/extension-unique-id"
import { Emoji, gitHubEmojis } from "@tiptap/extension-emoji"
import {
  getHierarchicalIndexes,
  TableOfContents,
} from "@tiptap/extension-table-of-contents"

// --- Hooks ---
// #region agent log
fetch('http://127.0.0.1:7242/ingest/099c8c93-882d-4528-804b-cc5f7b8b355f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'editor.tsx:32',message:'importing from @pacepard/blocs',data:{import:'useUiEditorState'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
// #endregion
import { useUiEditorState } from "@pacepard/blocs"
// #region agent log
fetch('http://127.0.0.1:7242/ingest/099c8c93-882d-4528-804b-cc5f7b8b355f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'editor.tsx:33',message:'importing nested path',data:{import:'copy-anchor-link-button/use-scroll-to-hash'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
// #endregion
import { useScrollToHash } from "@pacepard/blocs/ui/copy-anchor-link-button/use-scroll-to-hash"

// --- Custom Extensions ---
// #region agent log
fetch('http://127.0.0.1:7242/ingest/099c8c93-882d-4528-804b-cc5f7b8b355f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'editor.tsx:36',message:'importing extensions from index',data:{imports:['HorizontalRule','UiState','Image','NodeBackground','NodeAlignment','TocNode','ImageUploadNode','TableKit','TableHandleExtension','ListNormalizationExtension','TocSidebar']},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
// #endregion
import { 
  HorizontalRule,
  UiState,
  Image,
  NodeBackground,
  NodeAlignment,
  TocNode,
  ImageUploadNode,
  TableKit,
  TableHandleExtension,
  ListNormalizationExtension,
  TocSidebar,
} from "@pacepard/blocs"
import { TableHandle } from "@pacepard/blocs/node/table-node/ui/table-handle/table-handle"
import { TableSelectionOverlay } from "@pacepard/blocs/node/table-node/ui/table-selection-overlay"
import { TableCellHandleMenu } from "@pacepard/blocs/node/table-node/ui/table-cell-handle-menu"
import { TableExtendRowColumnButtons } from "@pacepard/blocs/node/table-node/ui/table-extend-row-column-button"
import "@pacepard/blocs/core/node/table-node/styles/prosemirror-table.scss"
import "@pacepard/blocs/core/node/table-node/styles/table-node.scss"

import "@pacepard/blocs/core/node/blockquote-node/blockquote-node.scss"
import "@pacepard/blocs/core/node/code-block-node/code-block-node.scss"
import "@pacepard/blocs/core/node/horizontal-rule-node/horizontal-rule-node.scss"
import "@pacepard/blocs/core/node/list-node/list-node.scss"
import "@pacepard/blocs/core/node/image-node/image-node.scss"
import "@pacepard/blocs/core/node/heading-node/heading-node.scss"
import "@pacepard/blocs/core/node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { EmojiDropdownMenu } from "@pacepard/blocs/ui/emoji-dropdown-menu"
import { MentionDropdownMenu } from "@pacepard/blocs/ui/mention-dropdown-menu"
import { SlashDropdownMenu } from "@pacepard/blocs/ui/slash-dropdown-menu"
import { DragContextMenu } from "@pacepard/blocs/ui/drag-context-menu"
import { AiMenu } from "@pacepard/blocs/ui/ai-menu"

// --- Contexts ---
import { 
  AppProvider,
  UserProvider,
  useUser,
  CollabProvider,
  useCollab,
  AiProvider,
  useAi,
} from "@pacepard/blocs"

// --- Lib ---
import { 
  handleImageUpload, 
  MAX_FILE_SIZE,
  TIPTAP_AI_APP_ID,
} from "@pacepard/blocs"

// --- Styles ---
import "@/core/editor/editor.scss"

// --- Content ---
import { NotionEditorHeader } from "@/core/editor/header"
import { MobileToolbar } from "./mobile-toolbar"
import { NotionToolbarFloating } from "@/core/editor/toolbar-floating"
import {
  TocProvider,
  useToc,
} from "@pacepard/blocs/node/toc-node/context/toc-context"


export interface NotionEditorProps {
  room: string
  placeholder?: string
}

export interface EditorProviderProps {
  provider: TiptapCollabProvider
  ydoc: YDoc
  placeholder?: string
  aiToken: string | null
}

/**
 * Loading spinner component shown while connecting to the notion server
 */
export function LoadingSpinner({ text = "Connecting..." }: { text?: string }) {
  return (
    <div className="spinner-container">
      <div className="spinner-content">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <div className="spinner-loading-text">{text}</div>
      </div>
    </div>
  )
}

/**
 * EditorContent component that renders the actual editor
 */
export function EditorContentArea() {
  const context = useContext(EditorContext)
  if (!context?.editor) {
    return null
  }
  const { editor } = context
  const {
    aiGenerationIsLoading,
    aiGenerationIsSelection,
    aiGenerationHasMessage,
    isDragging,
  } = useUiEditorState(editor)

  // Selection based effect to handle AI generation acceptance
  useEffect(() => {
    if (!editor) return

    if (
      !aiGenerationIsLoading &&
      aiGenerationIsSelection &&
      aiGenerationHasMessage
    ) {
      editor.chain().focus().aiAccept().run()
      editor.commands.resetUiState()
    }
  }, [
    aiGenerationHasMessage,
    aiGenerationIsLoading,
    aiGenerationIsSelection,
    editor,
  ])

  useScrollToHash()

  if (!editor) {
    return null
  }

  return (
    <EditorContent
      editor={editor}
      role="presentation"
      className="notion-like-editor-content"
      style={{
        cursor: isDragging ? "grabbing" : "auto",
      }}
    >
      <DragContextMenu />
      <AiMenu />
      <EmojiDropdownMenu />
      <MentionDropdownMenu />
      <SlashDropdownMenu />
      <NotionToolbarFloating />
      {createPortal(<MobileToolbar />, document.body)}
    </EditorContent>
  )
}

/**
 * Component that creates and provides the editor instance
 */
export function EditorProvider(props: EditorProviderProps) {
  const { provider, ydoc, placeholder = "Start writing...", aiToken } = props

  const { user } = useUser()
  const { setTocContent } = useToc()

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "notion-like-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        undoRedo: false,
        horizontalRule: false,
        dropcursor: {
          width: 2,
        },
        link: { openOnClick: false },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Collaboration.configure({ document: ydoc }),
      CollaborationCaret.configure({
        provider,
        user: { id: user.id, name: user.name, color: user.color },
      }),
      Placeholder.configure({
        placeholder,
        emptyNodeClass: "is-empty with-slash",
      }),
      Mention,
      Emoji.configure({
        emojis: gitHubEmojis.filter(
          (emoji: any) => !emoji.name.includes("regional")
        ),
        forceFallbackImages: true,
      }),
      TableKit.configure({
        table: {
          resizable: true,
          cellMinWidth: 120,
        },
      }),
      NodeBackground.configure({
        types: [
          "paragraph",
          "heading",
          "blockquote",
          "taskList",
          "bulletList",
          "orderedList",
          "tableCell",
          "tableHeader",
          "tocNode",
        ],
      }),
      NodeAlignment,
      TextStyle,
      Mathematics,
      Superscript,
      Subscript,
      Color,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Selection,
      Image,
      TableOfContents.configure({
        getIndex: getHierarchicalIndexes,
        onUpdate(content: any) {
          setTocContent(content)
        },
      }),
      TableHandleExtension,
      ListNormalizationExtension,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      UniqueID.configure({
        types: [
          "table",
          "paragraph",
          "bulletList",
          "orderedList",
          "taskList",
          "heading",
          "blockquote",
          "codeBlock",
          "tocNode",
        ],
        filterTransaction: (transaction: any) => !isChangeOrigin(transaction),
      }),
      Typography,
      UiState,
      TocNode.configure({
        topOffset: 48,
      }),
      Ai.configure({
        appId: TIPTAP_AI_APP_ID,
        token: aiToken || undefined,
        autocompletion: false,
        showDecorations: true,
        hideDecorationsOnStreamEnd: false,
        onLoading: (context: any) => {
          context.editor.commands.aiGenerationSetIsLoading(true)
          context.editor.commands.aiGenerationHasMessage(false)
        },
        onChunk: (context: any) => {
          context.editor.commands.aiGenerationSetIsLoading(true)
          context.editor.commands.aiGenerationHasMessage(true)
        },
        onSuccess: (context: any) => {
          const hasMessage = !!context.response
          context.editor.commands.aiGenerationSetIsLoading(false)
          context.editor.commands.aiGenerationHasMessage(hasMessage)
        },
      }),
    ],
  })

  if (!editor) {
    return <LoadingSpinner />
  }

  return (
    <div className="notion-like-editor-wrapper">
      <EditorContext.Provider value={{ editor }}>
        <NotionEditorHeader />
        <div className="notion-like-editor-layout">
          <EditorContentArea />
          <TocSidebar topOffset={48} />
        </div>

        <TableExtendRowColumnButtons />
        <TableHandle />
        <TableSelectionOverlay
          showResizeHandles={true}
          cellMenu={(props) => (
            <TableCellHandleMenu
              editor={props.editor}
              onMouseDown={(e) => props.onResizeStart?.("br")(e)}
            />
          )}
        />
      </EditorContext.Provider>

      
    </div>
  )
}

/**
 * Full editor with all necessary providers, ready to use with just a room ID
 */
export function NotionEditor({
  room,
  placeholder = "Start writing...",
}: NotionEditorProps) {
  return (
    <UserProvider>
      <AppProvider>
        <CollabProvider room={room}>
          <AiProvider>
            <TocProvider>
              <NotionEditorContent placeholder={placeholder} />
            </TocProvider>
          </AiProvider>
        </CollabProvider>
      </AppProvider>
    </UserProvider>
  )
}

/**
 * Internal component that handles the editor loading state
 */
export function NotionEditorContent({ placeholder }: { placeholder?: string }) {
  const { provider, ydoc } = useCollab()
  const { aiToken } = useAi()

  if (!provider || !ydoc || !aiToken) {
    return <LoadingSpinner />
  }

  return (
    <EditorProvider
      provider={provider}
      ydoc={ydoc}
      placeholder={placeholder}
      aiToken={aiToken}
    />
  )
}
