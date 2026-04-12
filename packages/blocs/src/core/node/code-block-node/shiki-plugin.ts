/**
 * ProseMirror plugin for Shiki-based code block syntax highlighting.
 * Lazy-loads the highlighter and languages on demand.
 */

import { createHighlightPlugin } from 'prosemirror-highlight';
import type { Parser } from 'prosemirror-highlight';
import { createParser } from 'prosemirror-highlight/shiki';
import type { ShikiHighlighter } from './shiki-bundle';
import { getLanguageId } from './supported-languages';

const SHIKI_HIGHLIGHTER_KEY = Symbol.for('pacepard.blocs.shikiHighlighter');

export interface ShikiPluginOptions {
    createHighlighter: () => Promise<ShikiHighlighter>;
    getTheme?: () => 'github-light' | 'github-dark';
}

function getDefaultTheme(): 'github-light' | 'github-dark' {
    if (typeof document === 'undefined') return 'github-light';
    const isDark =
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? 'github-dark' : 'github-light';
}

export function createShikiHighlightPlugin(options: ShikiPluginOptions) {
    const { createHighlighter, getTheme = getDefaultTheme } = options;
    const globalThisForShiki = globalThis as {
        [key: symbol]: Promise<ShikiHighlighter> | undefined;
    };

    let highlighter: ShikiHighlighter | undefined;

    const lazyParser = (parserOptions: {
        language?: string;
        content: string;
        pos: number;
        size: number;
    }) => {
        if (!highlighter) {
            const initPromise =
                globalThisForShiki[SHIKI_HIGHLIGHTER_KEY] ??
                createHighlighter();
            globalThisForShiki[SHIKI_HIGHLIGHTER_KEY] = initPromise;
            const onFulfilled = (h: ShikiHighlighter) => {
                highlighter = h;
                return runParser(parserOptions);
            };
            const resultPromise = (
                initPromise as Promise<ShikiHighlighter>
            ).then(
                onFulfilled as (
                    value: ShikiHighlighter,
                ) => void | PromiseLike<void>,
            ) as unknown as ReturnType<Parser>;
            return resultPromise as unknown as ReturnType<Parser>;
        }
        return runParser(parserOptions) as ReturnType<Parser>;
    };

    function runParser(parserOptions: {
        language?: string;
        content: string;
        pos: number;
        size: number;
    }) {
        if (!highlighter) return [];
        const language =
            getLanguageId(parserOptions.language ?? '') ??
            parserOptions.language;
        const skipHighlight =
            !language ||
            language === 'text' ||
            language === 'none' ||
            language === 'plaintext' ||
            language === 'txt';
        if (skipHighlight) return [];

        const loadLang = !highlighter.getLoadedLanguages().includes(language)
            ? highlighter.loadLanguage(
                  language as Parameters<ShikiHighlighter['loadLanguage']>[0],
              )
            : Promise.resolve(undefined);

        const onFulfilled = () => {
            const theme = getTheme();
            const parser = createParser(
                highlighter as Parameters<typeof createParser>[0],
                {
                    theme,
                },
            );
            return parser({
                content: parserOptions.content,
                language: parserOptions.language,
                pos: parserOptions.pos,
                size: parserOptions.size,
            });
        };
        const resultPromise = (loadLang as Promise<unknown>).then(
            onFulfilled as (value: unknown) => void | PromiseLike<void>,
        ) as unknown as ReturnType<Parser>;
        return resultPromise as unknown as ReturnType<Parser>;
    }

    return createHighlightPlugin({
        parser: lazyParser as Parser,
        languageExtractor: (node) => node.attrs.language,
        nodeTypes: ['codeBlock'],
    });
}
