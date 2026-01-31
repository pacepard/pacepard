// Block Builder Package
// Public API for @pacepard/blocs

export const blockBuilderVersion = "0.0.0"

// ============================================================================
// Hooks
// ============================================================================

export { usePacepardEditor } from "./hooks/use-pacepard-editor"
export { useComposedRef } from "./hooks/use-composed-ref"
export { useCursorVisibility } from "./hooks/use-cursor-visibility"
export type { CursorVisibilityOptions } from "./hooks/use-cursor-visibility"
export {
  useElementRect,
  useBodyRect,
  useRefRect,
} from "./hooks/use-element-rect"
export type { RectState, ElementRectOptions } from "./hooks/use-element-rect"
export { useFloatingElement } from "./hooks/use-floating-element"
export {
  useFloatingToolbarVisibility,
  HIDE_FLOATING_META,
  selectNodeAndHideFloating,
  markHideFloatingOnNext,
} from "./hooks/use-floating-toolbar-visibility"
export { useIsBreakpoint } from "./hooks/use-is-breakpoint"
export { useIsomorphicLayoutEffect } from "./hooks/use-isomorphic-layout-effect"
export { useMenuNavigation } from "./hooks/use-menu-navigation"
export { useOnClickOutside, useEventListener } from "./hooks/use-on-click-outside"
export { useScrolling } from "./hooks/use-scrolling"
export { useThrottledCallback } from "./hooks/use-throttled-callback"
export { useUiEditorState } from "./hooks/use-ui-editor-state"
export { useUnmount } from "./hooks/use-unmount"
export { useWindowSize } from "./hooks/use-window-size"
export type { WindowSizeState } from "./hooks/use-window-size"

// ============================================================================
// Extensions
// ============================================================================

export { HorizontalRule } from "./core/node/horizontal-rule-node/horizontal-rule-node-extension"
export { UiState, defaultUiState } from "./core/extenstions/ui-state-extension"
export { Image } from "./core/node/image-node/image-node-extension"
export { NodeBackground } from "./core/extenstions/node-background-extension"
export { NodeAlignment } from "./core/extenstions/node-alignment-extension"
export { TocNode } from "./core/node/toc-node/extensions/toc-node-extension"
export { ImageUploadNode } from "./core/node/image-upload-node/image-upload-node-extension"
export { ShortAnswerInputNode } from "./core/node/short-answer-node/short-answer-input-node-extension"
export { ShortAnswerNode } from "./core/node/short-answer-node/short-answer-node-extension"
export {
  ShortAnswerTextNode,
  ShortAnswerEmailNode,
  ShortAnswerNumberNode,
  ShortAnswerUrlNode,
  ShortAnswerTelNode,
} from "./core/node/short-answer-node/short-answer-typed-node-extension"
export { InputTitleNode } from "./core/node/input-title-node/input-title-node-extension"
export { InputLabelNode } from "./core/node/input-label-node/input-label-node-extension"
export {
  FormInputTextNode,
  FormInputEmailNode,
  FormInputNumberNode,
  FormInputUrlNode,
  FormInputTelNode,
} from "./core/node/form-input/form-input-extension"
export type { FormInputAttrs } from "./core/node/form-input/form-input-types"
export type { ShortAnswerAttrs, InputType, InputMode } from "./core/node/short-answer-node/short-answer-types"
export { TableKit } from "./core/node/table-node/extensions/table-node-extension"
export { TableHandleExtension } from "./core/node/table-node/extensions/table-handle/table-handle"
export { ListNormalizationExtension } from "./core/extenstions/list-normalization-extension"
export {
  CodeBlockShiki,
  type CodeBlockShikiOptions,
} from "./core/node/code-block-node"
export {
  supportedLanguages,
  getLanguageId,
  type SupportedLanguage,
} from "./core/node/code-block-node"

// ============================================================================
// Components
// ============================================================================

export { TocSidebar } from "./core/node/toc-node/ui/toc-sidebar/toc-sidebar"
export type { TocSidebarProps } from "./core/node/toc-node/ui/toc-sidebar/toc-sidebar"

// ============================================================================
// Utilities (collab-helper)
// ============================================================================

export type { OverflowPosition } from "./utils/collab-helper"
export {
  getUrlParam,
  getNodeDisplayName,
  removeEmptyParagraphs,
  getElementOverflowPosition,
  isSelectionValid,
  isTextSelectionValid,
  getSelectionBoundingRect,
  getAvatar,
} from "./utils/collab-helper"

// ============================================================================
// Contexts
// ============================================================================

export { AppProvider, useAppState as useApp } from "./contexts/app-context"
export type { AppContextValue } from "./contexts/app-context"
export { UserProvider, useUser } from "./contexts/user-context"
export type { User, UserContextValue } from "./contexts/user-context"
export { CollabProvider, useCollab } from "./contexts/collab-context"
export type { CollabContextValue } from "./contexts/collab-context"
export { useCollaboration } from "./contexts/collab-context"
export { AiProvider, useAi, useAiToken } from "./contexts/ai-context"
export type { AiContextValue } from "./contexts/ai-context"

// ============================================================================
// Data (flags and country codes)
// ============================================================================

export type { Country } from "./_data/countries"
export { readCountries, getCountry, listCountries } from "./_data/countries"

// ============================================================================
// Lib
// ============================================================================

export { handleImageUpload, MAX_FILE_SIZE, TIPTAP_AI_APP_ID } from "./lib/image-upload"
