import { forwardRef } from 'react';
import { cn } from '@/utils/base-helper';
import '@/core/primitives/textarea/textarea.scss';

const TextArea = forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
    return (
        <textarea
            ref={ref}
            className={cn('tiptap-textarea', className)}
            {...props}
        />
    );
});

TextArea.displayName = 'TextArea';

export { TextArea };
