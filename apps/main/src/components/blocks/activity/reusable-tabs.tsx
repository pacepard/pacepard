import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Badge, badgeVariants } from '@pacepard/ui/components/badge';
import { ScrollArea, ScrollBar } from '@pacepard/ui/components/scroll-area';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@pacepard/ui/components/tabs';
import { cn } from '@pacepard/ui/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface TabItem {
    value: string;
    label: string;
    icon?: LucideIcon;
    badge?: string | number;
    badgeVariant?: BadgeVariant;
    content: React.ReactNode;
}

interface ReusableTabsProps {
    tabs: TabItem[];
    defaultValue?: string;
    className?: string;
    tabsListClassName?: string;
    tabsTriggerClassName?: string;
    tabsContentClassName?: string;
    onValueChange?: (value: string) => void;
}

export function ReusableTabs({
    tabs,
    defaultValue,
    className,
    tabsListClassName,
    tabsTriggerClassName,
    tabsContentClassName,
    onValueChange,
}: ReusableTabsProps) {
    const firstTabValue = tabs[0]?.value;
    const defaultTabValue = defaultValue || firstTabValue;

    return (
        <Tabs
            defaultValue={defaultTabValue}
            onValueChange={onValueChange}
            className={className}
        >
            <ScrollArea>
                <TabsList
                    className={cn(
                        'mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 text-foreground',
                        tabsListClassName,
                    )}
                >
                    {tabs.map((tab) => {
                        const IconComponent = tab.icon;
                        return (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={cn(
                                    'after:-mb-1 relative after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:hover:bg-accent data-[state=active]:after:bg-primary',
                                    tabsTriggerClassName,
                                )}
                            >
                                {IconComponent && (
                                    <IconComponent
                                        aria-hidden="true"
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                    />
                                )}
                                {tab.label}
                                {tab.badge !== undefined && (
                                    <Badge
                                        className={cn(
                                            'ms-1.5',
                                            typeof tab.badge === 'number' &&
                                                'min-w-5 bg-primary/15 px-1',
                                        )}
                                        variant={
                                            tab.badgeVariant ||
                                            (typeof tab.badge === 'number'
                                                ? 'secondary'
                                                : 'default')
                                        }
                                    >
                                        {tab.badge}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {tabs.map((tab) => (
                <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className={tabsContentClassName}
                >
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
}

export default ReusableTabs;
