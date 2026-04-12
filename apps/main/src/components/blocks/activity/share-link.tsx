import React, { useState } from 'react';
import { Button } from '@pacepard/ui/components/button';
import { Input } from '@pacepard/ui/components/input';
import { Copy, ExternalLink } from 'lucide-react';
import { cn } from '@pacepard/ui/lib/utils';

interface ShareLinkProps {
    url?: string;
    onCopy?: (url: string) => void;
    onCustomDomainClick?: () => void;
    className?: string;
}

export function ShareLink({
    url = 'https://pacepard.com/s/hack-abuja-aQGseWN',
    onCopy,
    onCustomDomainClick,
    className,
}: ShareLinkProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            onCopy?.(url);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className={cn('space-y-4', className)}>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                    Share Link
                </h2>
                <p className="text-sm text-muted-foreground">
                    Your hackathon is now published and ready to be shared with
                    the world! Copy the link to share your form on social media,
                    messaging apps or via email.
                </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-1">
                <Input
                    type="text"
                    value={url}
                    readOnly
                    className="flex-1 border-0 bg-transparent text-foreground focus-visible:ring-0"
                />
                <Button
                    onClick={handleCopy}
                    variant="default"
                    size="default"
                    className="shrink-0"
                >
                    <Copy className="size-4" />
                    {copied ? 'Copied!' : 'Copy'}
                </Button>
            </div>

            <button
                onClick={onCustomDomainClick}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
                <ExternalLink className="size-4" />
                <span>Use custom domain</span>
            </button>
        </div>
    );
}
