'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { NodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import type { TextAreaNodeAttrs } from './textarea-node-types';
import { RequiredBadge } from '@/core/primitives/required-badge';
import './textarea-node.scss';

function getValidationMessage(
    textarea: HTMLTextAreaElement,
    attrs: TextAreaNodeAttrs,
): string | null {
    const value = textarea.value;
    const required = attrs.required === true;

    if (required && !value.trim()) {
        return 'This field is required.';
    }

    const len = value.length;
    const minChars = attrs.minChars;
    const maxChars = attrs.maxChars;
    if (minChars != null && len < minChars) {
        return `Minimum ${minChars} characters.`;
    }
    if (maxChars != null && len > maxChars) {
        return `Maximum ${maxChars} characters.`;
    }

    if (value !== '' && textarea.validationMessage) {
        return textarea.validationMessage;
    }
    return null;
}

export function TextAreaNodeView(props: NodeViewProps) {
    const { node, updateAttributes } = props;
    const attrs = (node.attrs ?? {}) as TextAreaNodeAttrs;
    const value = (attrs.value ?? '') as string;
    const placeholder = attrs.placeholder ?? '';
    const required = attrs.required === true;
    const rows = attrs.rows ?? 4;

    const [localValue, setLocalValue] = useState(value);
    const [error, setError] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const errorId = useId();

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const validate = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const msg = getValidationMessage(textarea, attrs);
        setError(msg);
        textarea.setCustomValidity(msg ?? '');
        textarea.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (msg) textarea.setAttribute('aria-describedby', errorId);
        else textarea.removeAttribute('aria-describedby');
    }, [attrs, errorId]);

    const handleBlur = useCallback(() => {
        setTouched(true);
        validate();
        updateAttributes({ value: localValue });
    }, [validate, localValue, updateAttributes]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setLocalValue(e.target.value);
            if (touched) validate();
        },
        [touched, validate],
    );

    return (
        <NodeViewWrapper
            className="textarea-node-wrap"
            data-type="long-answer-node"
        >
            {required && (
                <RequiredBadge className="textarea-node-required-badge" />
            )}
            <div className="textarea-node-inner">
                <textarea
                    ref={textareaRef}
                    placeholder={placeholder}
                    value={localValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={rows}
                    aria-label="long answer input"
                    aria-required={required}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? errorId : undefined}
                    minLength={attrs.minChars ?? undefined}
                    maxLength={attrs.maxChars ?? undefined}
                    required={required}
                    className="textarea-node-field"
                />
            </div>
            {error && (
                <span id={errorId} role="alert" className="textarea-node-error">
                    {error}
                </span>
            )}
        </NodeViewWrapper>
    );
}

export default TextAreaNodeView;
