/**
 * Code block extension with Shiki syntax highlighting and language attribute.
 * Extends Tiptap CodeBlock; disables StarterKit's default code block and use this instead.
 */

import type { CodeBlockOptions } from "@tiptap/extension-code-block"
import CodeBlock from "@tiptap/extension-code-block"
import { createCodeBlockHighlighter } from "./shiki-bundle"
import { createShikiHighlightPlugin } from "./shiki-plugin"

const DEFAULT_LANGUAGE = "javascript"

export type CodeBlockShikiOptions = CodeBlockOptions

export const CodeBlockShiki = CodeBlock.extend<CodeBlockShikiOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      defaultLanguage: DEFAULT_LANGUAGE,
      languageClassPrefix: "language-",
      exitOnTripleEnter: true,
      exitOnArrowDown: true,
      enableTabIndentation: true,
      tabSize: 2,
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: this.options.defaultLanguage ?? DEFAULT_LANGUAGE,
        parseHTML: (element: HTMLElement) => {
          const lang =
            element.getAttribute("data-language") ??
            (typeof element.className === "string"
              ? element.className
                  .split(" ")
                  .find((c: string) => c.startsWith("language-"))
                  ?.replace("language-", "")
              : undefined)
          return lang ?? this.options.defaultLanguage ?? DEFAULT_LANGUAGE
        },
        renderHTML: (attrs: Record<string, unknown>) => {
          const lang = (attrs.language as string) ?? this.options.defaultLanguage ?? DEFAULT_LANGUAGE
          return {
            "data-language": lang,
            class: `language-${lang}`,
          }
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() ?? []),
      createShikiHighlightPlugin({
        createHighlighter: createCodeBlockHighlighter,
      }),
    ]
  },
})

export default CodeBlockShiki
