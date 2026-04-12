/**
 * Shiki highlighter factory for code block syntax highlighting.
 * Uses github-light and github-dark themes; languages are loaded on demand by the plugin.
 */

import { createHighlighter } from 'shiki';

export type ShikiHighlighter = Awaited<ReturnType<typeof createHighlighter>>;

const DEFAULT_THEMES = ['github-light', 'github-dark'] as const;

/**
 * Create a Shiki highlighter with both light and dark themes.
 * Languages are not pre-loaded; the plugin will call highlighter.loadLanguage() on demand.
 */
export async function createCodeBlockHighlighter(): Promise<ShikiHighlighter> {
    return createHighlighter({
        themes: [...DEFAULT_THEMES],
        langs: [],
    });
}
