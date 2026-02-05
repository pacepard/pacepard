"use client"

import { useCallback } from "react"
import type { Editor } from "@tiptap/react"

// --- Icons ---
import { CodeBlockIcon } from "@/core/icons/code-block-icon"
import { HeadingOneIcon } from "@/core/icons/heading-one-icon"
import { HeadingTwoIcon } from "@/core/icons/heading-two-icon"
import { HeadingThreeIcon } from "@/core/icons/heading-three-icon"
import { ImageIcon } from "@/core/icons/image-icon"
import { ListIcon } from "@/core/icons/list-icon"
import { ListOrderedIcon } from "@/core/icons/list-ordered-icon"
import { BlockquoteIcon } from "@/core/icons/blockquote-icon"
import { ListTodoIcon } from "@/core/icons/list-todo-icon"
import { AiSparklesIcon } from "@/core/icons/ai-sparkles-icon"
import { MinusIcon } from "@/core/icons/minus-icon"
import { TypeIcon } from "@/core/icons/type-icon"
import { AtSignIcon } from "@/core/icons/at-sign-icon"
import { LinkIcon } from "@/core/icons/link-icon"
import { HashIcon } from "@/core/icons/hash-icon"
import { PhoneIcon } from "@/core/icons/phone-icon"
import { TagIcon } from "@/core/icons/tag-icon"
import { HeadingIcon } from "@/core/icons/heading-icon"
import { SmilePlusIcon } from "@/core/icons/smile-plus-icon"
import { TableIcon } from "@/core/icons/table-icon"
import { ListIndentedIcon } from "@/core/icons/list-indented-icon"

// --- Lib ---
import {
  isExtensionAvailable,
  isNodeInSchema,
} from "@/utils/base-helper"
import {
  findSelectionPosition,
  hasContentAbove,
} from "@/utils/advanced-helper"

// --- Tiptap UI ---
import type { SuggestionItem } from "@/utils/suggestion-menu"
import { addEmojiTrigger } from "@/core/ui/emoji-trigger-button"
import { addMentionTrigger } from "@/core/ui/mention-trigger-button"

export interface SlashMenuConfig {
  enabledItems?: SlashMenuItemType[]
  customItems?: SuggestionItem[]
  itemGroups?: {
    [key in SlashMenuItemType]?: string
  }
  showGroups?: boolean
}

const texts = {
  // AI
  continue_writing: {
    title: "Continue Writing",
    subtext: "Continue writing from the current position",
    keywords: ["continue", "write", "continue writing", "ai"],
    badge: AiSparklesIcon,
    group: "AI",
  },
  ai_ask_button: {
    title: "Ask AI",
    subtext: "Ask AI to generate content",
    keywords: ["ai", "ask", "generate"],
    badge: AiSparklesIcon,
    group: "AI",
  },

  // Style
  text: {
    title: "Text",
    subtext: "Regular text paragraph",
    keywords: ["p", "paragraph", "text"],
    badge: TypeIcon,
    group: "Style",
  },
  heading_1: {
    title: "Heading 1",
    subtext: "Top-level heading",
    keywords: ["h", "heading1", "h1"],
    badge: HeadingOneIcon,
    group: "Style",
  },
  heading_2: {
    title: "Heading 2",
    subtext: "Key section heading",
    keywords: ["h2", "heading2", "subheading"],
    badge: HeadingTwoIcon,
    group: "Style",
  },
  heading_3: {
    title: "Heading 3",
    subtext: "Subsection and group heading",
    keywords: ["h3", "heading3", "subheading"],
    badge: HeadingThreeIcon,
    group: "Style",
  },
  bullet_list: {
    title: "Bullet List",
    subtext: "List with unordered items",
    keywords: ["ul", "li", "list", "bulletlist", "bullet list"],
    badge: ListIcon,
    group: "Style",
  },
  ordered_list: {
    title: "Numbered List",
    subtext: "List with ordered items",
    keywords: ["ol", "li", "list", "numberedlist", "numbered list"],
    badge: ListOrderedIcon,
    group: "Style",
  },
  task_list: {
    title: "To-do list",
    subtext: "List with tasks",
    keywords: ["tasklist", "task list", "todo", "checklist"],
    badge: ListTodoIcon,
    group: "Style",
  },
  quote: {
    title: "Blockquote",
    subtext: "Blockquote block",
    keywords: ["quote", "blockquote"],
    badge: BlockquoteIcon,
    group: "Style",
  },
  code_block: {
    title: "Code Block",
    subtext: "Code block with syntax highlighting",
    keywords: ["code", "pre"],
    badge: CodeBlockIcon,
    group: "Style",
  },

  // Insert
  mention: {
    title: "Mention",
    subtext: "Mention a user or item",
    keywords: ["mention", "user", "item", "tag"],
    badge: AtSignIcon,
    group: "Insert",
  },
  emoji: {
    title: "Emoji",
    subtext: "Insert an emoji",
    keywords: ["emoji", "emoticon", "smiley"],
    badge: SmilePlusIcon,
    group: "Insert",
  },
  table: {
    title: "Table",
    subtext: "Insert a table",
    aliases: ["table", "insertTable"],
    badge: TableIcon,
    group: "Insert",
  },
  divider: {
    title: "Separator",
    subtext: "Horizontal line to separate content",
    keywords: ["hr", "horizontalRule", "line", "separator"],
    badge: MinusIcon,
    group: "Insert",
  },
  toc: {
    title: "Table of contents",
    subtext: "Insert a table of contents",
    keywords: ["toc", "tableofcontents", "table of contents"],
    badge: ListIndentedIcon,
    group: "Insert",
  },

  // Upload
  image: {
    title: "Image",
    subtext: "Resizable image with caption",
    keywords: [
      "image",
      "imageUpload",
      "upload",
      "img",
      "picture",
      "media",
      "url",
    ],
    badge: ImageIcon,
    group: "Upload",
  },

  // Short answer (form block)
  short_answer: {
    title: "Short answer",
    subtext: "Single-line text question",
    keywords: ["short answer", "text", "input", "question"],
    badge: TypeIcon,
    group: "Insert",
  },
  short_answer_email: {
    title: "Email",
    subtext: "Email address field",
    keywords: ["email", "short answer"],
    badge: AtSignIcon,
    group: "Insert",
  },
  short_answer_number: {
    title: "Number",
    subtext: "Numeric input field",
    keywords: ["number", "numeric", "short answer"],
    badge: HashIcon,
    group: "Insert",
  },
  short_answer_url: {
    title: "URL",
    subtext: "URL / link field",
    keywords: ["url", "link", "short answer"],
    badge: LinkIcon,
    group: "Insert",
  },
  short_answer_phone: {
    title: "Phone",
    subtext: "Phone number field",
    keywords: ["phone", "tel", "short answer"],
    badge: PhoneIcon,
    group: "Insert",
  },

  // Standalone form input (input box only, separate node)
  form_input_text: {
    title: "Input text",
    subtext: "Standalone text input field",
    keywords: ["input", "text", "form", "field"],
    badge: TypeIcon,
    group: "Insert",
  },
  form_input_email: {
    title: "Input email",
    subtext: "Standalone email input field",
    keywords: ["input", "email", "form", "field"],
    badge: AtSignIcon,
    group: "Insert",
  },
  form_input_number: {
    title: "Input number",
    subtext: "Standalone number input field",
    keywords: ["input", "number", "form", "field"],
    badge: HashIcon,
    group: "Insert",
  },
  form_input_url: {
    title: "Input URL",
    subtext: "Standalone URL input field",
    keywords: ["input", "url", "link", "form", "field"],
    badge: LinkIcon,
    group: "Insert",
  },
  form_input_phone: {
    title: "Input phone",
    subtext: "Standalone phone input field",
    keywords: ["input", "phone", "tel", "form", "field"],
    badge: PhoneIcon,
    group: "Insert",
  },

  // Form labels (heading-like)
  input_title: {
    title: "Title",
    subtext: "Form section title (heading 2)",
    keywords: ["title", "form", "heading", "section"],
    badge: HeadingIcon,
    group: "Insert",
  },
  input_label: {
    title: "Label",
    subtext: "Form field label (heading 4)",
    keywords: ["label", "form", "heading", "field"],
    badge: TagIcon,
    group: "Insert",
  },
  long_answer: {
    title: "Long Answer",
    subtext: "Multi-line text input field",
    keywords: ["long answer", "textarea", "text area", "paragraph", "multiline"],
    badge: TypeIcon,
    group: "Insert",
  },
}

export type SlashMenuItemType = keyof typeof texts

const getItemImplementations = () => {
  return {
    // AI
    continue_writing: {
      check: (editor: Editor) => {
        const { hasContent } = hasContentAbove(editor)
        const extensionsReady = isExtensionAvailable(editor, [
          "ai",
          "aiAdvanced",
        ])
        return extensionsReady && hasContent
      },
      action: ({ editor }: { editor: Editor }) => {
        const editorChain = editor.chain().focus()

        const nodeSelectionPosition = findSelectionPosition({ editor })

        if (nodeSelectionPosition !== null) {
          editorChain.setNodeSelection(nodeSelectionPosition)
        }

        editorChain.run()

        editor.chain().focus().aiGenerationShow().run()

        requestAnimationFrame(() => {
          const { hasContent, content } = hasContentAbove(editor)

          const snippet =
            content.length > 500 ? `...${content.slice(-500)}` : content

          const prompt = hasContent
            ? `Context: ${snippet}\n\nContinue writing from where the text above ends. Write ONLY ONE SENTENCE. DONT REPEAT THE TEXT.`
            : "Start writing a new paragraph. Write ONLY ONE SENTENCE."

          editor
            .chain()
            .focus()
            .aiTextPrompt({
              stream: true,
              format: "rich-text",
              text: prompt,
            })
            .run()
        })
      },
    },
    ai_ask_button: {
      check: (editor: Editor) =>
        isExtensionAvailable(editor, ["ai", "aiAdvanced"]),
      action: ({ editor }: { editor: Editor }) => {
        const editorChain = editor.chain().focus()

        const nodeSelectionPosition = findSelectionPosition({ editor })

        if (nodeSelectionPosition !== null) {
          editorChain.setNodeSelection(nodeSelectionPosition)
        }

        editorChain.run()

        editor.chain().focus().aiGenerationShow().run()
      },
    },

    // Style
    text: {
      check: (editor: Editor) => isNodeInSchema("paragraph", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().setParagraph().run()
      },
    },
    heading_1: {
      check: (editor: Editor) => isNodeInSchema("heading", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleHeading({ level: 1 }).run()
      },
    },
    heading_2: {
      check: (editor: Editor) => isNodeInSchema("heading", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleHeading({ level: 2 }).run()
      },
    },
    heading_3: {
      check: (editor: Editor) => isNodeInSchema("heading", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleHeading({ level: 3 }).run()
      },
    },
    bullet_list: {
      check: (editor: Editor) => isNodeInSchema("bulletList", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleBulletList().run()
      },
    },
    ordered_list: {
      check: (editor: Editor) => isNodeInSchema("orderedList", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleOrderedList().run()
      },
    },
    task_list: {
      check: (editor: Editor) => isNodeInSchema("taskList", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleTaskList().run()
      },
    },
    quote: {
      check: (editor: Editor) => isNodeInSchema("blockquote", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleBlockquote().run()
      },
    },
    code_block: {
      check: (editor: Editor) => isNodeInSchema("codeBlock", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().toggleNode("codeBlock", "paragraph").run()
      },
    },

    // Insert
    mention: {
      check: (editor: Editor) =>
        isExtensionAvailable(editor, ["mention", "mentionAdvanced"]),
      action: ({ editor }: { editor: Editor }) => addMentionTrigger(editor),
    },
    emoji: {
      check: (editor: Editor) =>
        isExtensionAvailable(editor, ["emoji", "emojiPicker"]),
      action: ({ editor }: { editor: Editor }) => addEmojiTrigger(editor),
    },
    divider: {
      check: (editor: Editor) => isNodeInSchema("horizontalRule", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().setHorizontalRule().run()
      },
    },
    toc: {
      check: (editor: Editor) => isNodeInSchema("tocNode", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().insertTocNode().run()
      },
    },
    table: {
      check: (editor: Editor) => isNodeInSchema("table", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor
          .chain()
          .focus()
          .insertTable({
            rows: 3,
            cols: 3,
            withHeaderRow: false,
          })
          .run()
      },
    },

    // Upload
    image: {
      check: (editor: Editor) => isNodeInSchema("image", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "imageUpload",
          })
          .run()
      },
    },

    // Short answer (typed nodes: one node per input type)
    short_answer: {
      check: (editor: Editor) => isNodeInSchema("shortAnswerText", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().insertShortAnswerText({ placeholder: "Type a question" }).run()
      },
    },
    short_answer_email: {
      check: (editor: Editor) => isNodeInSchema("shortAnswerEmail", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().insertShortAnswerEmail({ placeholder: "name@example.com" }).run()
      },
    },
    short_answer_number: {
      check: (editor: Editor) => isNodeInSchema("shortAnswerNumber", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().insertShortAnswerNumber({ placeholder: "0" }).run()
      },
    },
    short_answer_url: {
      check: (editor: Editor) => isNodeInSchema("shortAnswerUrl", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().insertShortAnswerUrl({ placeholder: "https://example.com" }).run()
      },
    },
    short_answer_phone: {
      check: (editor: Editor) => isNodeInSchema("shortAnswerTel", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor
          .chain()
          .focus()
          .insertShortAnswerTel({ placeholder: "+1 (555) 000-0000" })
          .run()
      },
    },

    // Standalone form input nodes (input box only)
    form_input_text: {
      check: (editor: Editor) => isNodeInSchema("formInputText", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().insertFormInputText({ placeholder: "Type a question" }).run()
      },
    },
    form_input_email: {
      check: (editor: Editor) => isNodeInSchema("formInputEmail", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().insertFormInputEmail({ placeholder: "name@example.com" }).run()
      },
    },
    form_input_number: {
      check: (editor: Editor) => isNodeInSchema("formInputNumber", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().insertFormInputNumber({ placeholder: "0" }).run()
      },
    },
    form_input_url: {
      check: (editor: Editor) => isNodeInSchema("formInputUrl", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().insertFormInputUrl({ placeholder: "https://example.com" }).run()
      },
    },
    form_input_phone: {
      check: (editor: Editor) => isNodeInSchema("formInputTel", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor
          .chain()
          .focus()
          .insertFormInputTel({ placeholder: "+1 (555) 000-0000" })
          .run()
      },
    },

    // Form labels (Title, Label)
    input_title: {
      check: (editor: Editor) => isNodeInSchema("inputTitle", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().setInputTitle({ level: 2 }).run()
      },
    },
    input_label: {
      check: (editor: Editor) => isNodeInSchema("inputLabel", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().setInputLabel({ level: 4 }).run()
      },
    },
    long_answer: {
      check: (editor: Editor) => isNodeInSchema("longAnswer", editor),
      action: ({ editor }: { editor: Editor }) => {
        editor.chain().focus().insertLongAnswer({ placeholder: "Type your answer..." }).run()
      },
    },
  }
}

function organizeItemsByGroups(
  items: SuggestionItem[],
  showGroups: boolean
): SuggestionItem[] {
  if (!showGroups) {
    return items.map((item) => ({ ...item, group: "" }))
  }

  const groups: { [groupLabel: string]: SuggestionItem[] } = {}

  // Group items
  items.forEach((item) => {
    const groupLabel = item.group || ""
    if (!groups[groupLabel]) {
      groups[groupLabel] = []
    }
    groups[groupLabel].push(item)
  })

  // Flatten groups in order (this maintains the visual order for keyboard navigation)
  const organizedItems: SuggestionItem[] = []
  Object.entries(groups).forEach(([, groupItems]) => {
    organizedItems.push(...groupItems)
  })

  return organizedItems
}

/**
 * Custom hook for slash dropdown menu functionality
 */
export function useSlashDropdownMenu(config?: SlashMenuConfig) {
  const getSlashMenuItems = useCallback(
    (editor: Editor) => {
      const items: SuggestionItem[] = []

      const enabledItems =
        config?.enabledItems || (Object.keys(texts) as SlashMenuItemType[])
      const showGroups = config?.showGroups !== false

      const itemImplementations = getItemImplementations()

      enabledItems.forEach((itemType) => {
        const itemImpl = itemImplementations[itemType]
        const itemText = texts[itemType]

        if (itemImpl && itemText && itemImpl.check(editor)) {
          const item: SuggestionItem = {
            onSelect: ({ editor }) => itemImpl.action({ editor }),
            ...itemText,
          }

          if (config?.itemGroups?.[itemType]) {
            item.group = config.itemGroups[itemType]
          } else if (!showGroups) {
            item.group = ""
          }

          items.push(item)
        }
      })

      if (config?.customItems) {
        items.push(...config.customItems)
      }

      // Reorganize items by groups to ensure keyboard navigation works correctly
      return organizeItemsByGroups(items, showGroups)
    },
    [config]
  )

  return {
    getSlashMenuItems,
    config,
  }
}
