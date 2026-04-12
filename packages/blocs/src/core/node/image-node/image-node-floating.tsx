import type { Editor } from '@tiptap/react';

// --- Hooks ---
import { usePacepardEditor } from '@/hooks/use-pacepard-editor';

// --- Lib ---
import { isNodeTypeSelected } from '@/utils/base-helper';

// --- Tiptap UI ---
import { DeleteNodeButton } from '@/core/ui/delete-node-button';
import { ImageDownloadButton } from '@/core/ui/image-download-button';
import { ImageAlignButton } from '@/core/ui/image-align-button';

// --- UI Primitive ---
import { Separator } from '@/core/primitives/separator';
import { ImageCaptionButton } from '@/core/ui/image-caption-button';
import { ImageUploadButton } from '@/core/ui/image-upload-button';
import { RefreshCcwIcon } from '@/core/icons/refresh-ccw-icon';

export function ImageNodeFloating({
    editor: providedEditor,
}: {
    editor?: Editor | null;
}) {
    const { editor } = usePacepardEditor(providedEditor);
    const visible = isNodeTypeSelected(editor, ['image']);

    if (!editor || !visible) {
        return null;
    }

    return (
        <>
            <ImageAlignButton align="left" />
            <ImageAlignButton align="center" />
            <ImageAlignButton align="right" />
            <Separator />
            <ImageCaptionButton />
            <Separator />
            <ImageDownloadButton />
            <ImageUploadButton icon={RefreshCcwIcon} tooltip="Replace" />
            <Separator />
            <DeleteNodeButton />
        </>
    );
}
