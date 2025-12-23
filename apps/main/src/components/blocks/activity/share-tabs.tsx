import React from 'react';
import { LinkSimple, Eye } from '@phosphor-icons/react';
import { ScrollArea, ScrollBar } from '@pacepard/ui/components/scroll-area';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@pacepard/ui/components/tabs';
import { ShareLink } from './share-link';
import { LinkPreview } from './link-preview';

interface ShareTabsProps {
    defaultTab?: 'share' | 'preview';
    shareLinkUrl?: string;
    onShareLinkCopy?: (url: string) => void;
    onCustomDomainClick?: () => void;
    linkPreviewTitle?: string;
    linkPreviewSubtitle?: string;
    linkPreviewDescription?: string;
    onCustomizeClick?: () => void;
    className?: string;
}

export function ShareTabs({
    defaultTab = 'share',
    shareLinkUrl,
    onShareLinkCopy,
    onCustomDomainClick,
    linkPreviewTitle,
    linkPreviewSubtitle,
    linkPreviewDescription,
    onCustomizeClick,
    className,
}: ShareTabsProps) {
    return (
        <Tabs defaultValue={defaultTab} className={className}>
            <ScrollArea>
                <TabsList className="mb-3">
                    <TabsTrigger value="share" className="group">
                        <LinkSimple
                            aria-hidden="true"
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                        />
                        Share Link
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="group">
                        <Eye
                            aria-hidden="true"
                            className="-ms-0.5 me-1.5 opacity-60"
                            size={16}
                        />
                        Link Preview
                    </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <TabsContent value="share">
                <ShareLink
                    url={shareLinkUrl}
                    onCopy={onShareLinkCopy}
                    onCustomDomainClick={onCustomDomainClick}
                />
            </TabsContent>
            <TabsContent value="preview">
                <LinkPreview
                    title={linkPreviewTitle}
                    subtitle={linkPreviewSubtitle}
                    description={linkPreviewDescription}
                    onCustomizeClick={onCustomizeClick}
                />
            </TabsContent>
        </Tabs>
    );
}

export default ShareTabs;
