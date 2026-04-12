'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';

// --- Tiptap Core Extensions ---
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Highlight } from '@tiptap/extension-highlight';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Selection } from '@tiptap/extensions';

// --- UI Primitives ---
import { Button } from '@pacepard/blocs/primitives/button';
import { Spacer } from '@pacepard/blocs/primitives/spacer';
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
} from '@pacepard/blocs/primitives/toolbar';

// --- Blocs Extensions & Node ---
import {
    HorizontalRule,
    ImageUploadNode,
    handleImageUpload,
    MAX_FILE_SIZE,
} from '@pacepard/blocs';
import '@pacepard/blocs/core/node/blockquote-node/blockquote-node.scss';
import '@pacepard/blocs/core/node/code-block-node/code-block-node.scss';
import '@pacepard/blocs/core/node/horizontal-rule-node/horizontal-rule-node.scss';
import '@pacepard/blocs/core/node/list-node/list-node.scss';
import '@pacepard/blocs/core/node/image-node/image-node.scss';
import '@pacepard/blocs/core/node/heading-node/heading-node.scss';
import '@pacepard/blocs/core/node/paragraph-node/paragraph-node.scss';

// --- Blocs UI ---
import { HeadingDropdownMenu } from '@pacepard/blocs/ui/heading-dropdown-menu';
import { ImageUploadButton } from '@pacepard/blocs/ui/image-upload-button';
import { ListDropdownMenu } from '@pacepard/blocs/ui/list-dropdown-menu';
import { BlockquoteButton } from '@pacepard/blocs/ui/blockquote-button';
import { CodeBlockButton } from '@pacepard/blocs/ui/code-block-button';
import {
    ColorHighlightPopover,
    ColorHighlightPopoverContent,
    ColorHighlightPopoverButton,
} from '@pacepard/blocs/ui/color-highlight-popover';
import {
    LinkPopover,
    LinkContent,
    LinkButton,
} from '@pacepard/blocs/ui/link-popover';
import { MarkButton } from '@pacepard/blocs/ui/mark-button';
import { TextAlignButton } from '@pacepard/blocs/ui/text-align-button';
import { UndoRedoButton } from '@pacepard/blocs/ui/undo-redo-button';

// --- Icons ---
import { ArrowLeftIcon } from '@pacepard/blocs/icons/arrow-left-icon';
import { HighlighterIcon } from '@pacepard/blocs/icons/highlighter-icon';
import { LinkIcon } from '@pacepard/blocs/icons/link-icon';

// --- Hooks ---
import {
    useIsBreakpoint,
    useWindowSize,
    useCursorVisibility,
} from '@pacepard/blocs';

// --- Components ---
import { ThemeToggle } from '@/simple/theme-toggle';

// --- Styles ---
import '@/simple/simple-editor.scss';

import content from '@/simple/data/content.json';

const MainToolbarContent = ({
    onHighlighterClick,
    onLinkClick,
    isMobile,
}: {
    onHighlighterClick: () => void;
    onLinkClick: () => void;
    isMobile: boolean;
}) => {
    return (
        <>
            <Spacer />

            <ToolbarGroup>
                <UndoRedoButton action="undo" />
                <UndoRedoButton action="redo" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
                <ListDropdownMenu
                    types={['bulletList', 'orderedList', 'taskList']}
                    portal={isMobile}
                />
                <BlockquoteButton />
                <CodeBlockButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type="bold" />
                <MarkButton type="italic" />
                <MarkButton type="strike" />
                <MarkButton type="code" />
                <MarkButton type="underline" />
                {!isMobile ? (
                    <ColorHighlightPopover />
                ) : (
                    <ColorHighlightPopoverButton onClick={onHighlighterClick} />
                )}
                {!isMobile ? (
                    <LinkPopover />
                ) : (
                    <LinkButton onClick={onLinkClick} />
                )}
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type="superscript" />
                <MarkButton type="subscript" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <TextAlignButton align="left" />
                <TextAlignButton align="center" />
                <TextAlignButton align="right" />
                <TextAlignButton align="justify" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <ImageUploadButton text="Add" />
            </ToolbarGroup>

            <Spacer />

            {isMobile && <ToolbarSeparator />}

            <ToolbarGroup>
                <ThemeToggle />
            </ToolbarGroup>
        </>
    );
};

const MobileToolbarContent = ({
    type,
    onBack,
}: {
    type: 'highlighter' | 'link';
    onBack: () => void;
}) => (
    <>
        <ToolbarGroup>
            <Button data-style="ghost" onClick={onBack}>
                <ArrowLeftIcon className="tiptap-button-icon" />
                {type === 'highlighter' ? (
                    <HighlighterIcon className="tiptap-button-icon" />
                ) : (
                    <LinkIcon className="tiptap-button-icon" />
                )}
            </Button>
        </ToolbarGroup>

        <ToolbarSeparator />

        {type === 'highlighter' ? (
            <ColorHighlightPopoverContent />
        ) : (
            <LinkContent />
        )}
    </>
);

export function SimpleEditor() {
    const isMobile = useIsBreakpoint();
    const { height } = useWindowSize();
    const [mobileView, setMobileView] = useState<
        'main' | 'highlighter' | 'link'
    >('main');
    const toolbarRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
        immediatelyRender: false,
        editorProps: {
            attributes: {
                autocomplete: 'off',
                autocorrect: 'off',
                autocapitalize: 'off',
                'aria-label': 'Main content area, start typing to enter text.',
                class: 'simple-editor',
            },
        },
        extensions: [
            StarterKit.configure({
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true,
                },
            }),
            HorizontalRule,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Image,
            Typography,
            Superscript,
            Subscript,
            Selection,
            ImageUploadNode.configure({
                accept: 'image/*',
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error) => console.error('Upload failed:', error),
            }),
        ],
        content,
    });

    const rect = useCursorVisibility({
        editor,
        overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
    });

    useEffect(() => {
        if (!isMobile && mobileView !== 'main') {
            setMobileView('main');
        }
    }, [isMobile, mobileView]);

    return (
        <div className="simple-editor-wrapper">
            <EditorContext.Provider value={{ editor }}>
                <Toolbar
                    ref={toolbarRef}
                    style={{
                        ...(isMobile
                            ? {
                                  bottom: `calc(100% - ${height - rect.y}px)`,
                              }
                            : {}),
                    }}
                >
                    {mobileView === 'main' ? (
                        <MainToolbarContent
                            onHighlighterClick={() =>
                                setMobileView('highlighter')
                            }
                            onLinkClick={() => setMobileView('link')}
                            isMobile={isMobile}
                        />
                    ) : (
                        <MobileToolbarContent
                            type={
                                mobileView === 'highlighter'
                                    ? 'highlighter'
                                    : 'link'
                            }
                            onBack={() => setMobileView('main')}
                        />
                    )}
                </Toolbar>

                <EditorContent
                    editor={editor}
                    role="presentation"
                    className="simple-editor-content"
                />
            </EditorContext.Provider>
        </div>
    );
}
