import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@pacepard/ui/components/button';
import { Card, CardContent } from '@pacepard/ui/components/card';
import { Skeleton } from '@pacepard/ui/components/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@pacepard/ui/components/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@pacepard/ui/components/dropdown-menu';
import { toast } from '@pacepard/ui';
import { PacepardAPI } from '@/config/pacepard';
import { IHackathon, HackStatusType, routil } from '@pacepard/sdk';
import { cn } from '@pacepard/ui/lib/utils';

const TAB_IDS = ['all', 'drafts', 'published', 'closed', 'deleted'] as const;
type TabId = (typeof TAB_IDS)[number];

const statusLabel = (status: HackStatusType): string => {
    switch (status) {
        case HackStatusType.PUBLISHED:
            return 'Published';
        case HackStatusType.DRAFT:
            return 'Draft';
        case HackStatusType.CLOSED:
            return 'Closed';
        case HackStatusType.ARCHIVED:
            return 'Deleted';
        default:
            return status;
    }
};

const formatLastUpdated = (dateStr?: string): string => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const day = d.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
    return `Last updated ${d.toLocaleDateString('en-US', { month: 'short' })} ${day}${suffix} at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
};

const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const HackathonRowSkeleton = () => (
    <div className="flex h-[54px] items-center gap-4 px-6">
        <Skeleton className="h-[54px] w-[54px] rounded flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-[18px] w-40" />
        </div>
    </div>
);

const Workspace = () => {
    const navigate = useNavigate();
    const [hackathons, setHackathons] = useState<IHackathon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabId>('all');

    useEffect(() => {
        const fetchHackathons = async () => {
            setIsLoading(true);
            try {
                const workspaceRes = await PacepardAPI.workspace.getWorkspaces({
                    limit: 1,
                    page: 1,
                    order: 'desc',
                });
                const workspaceId = workspaceRes.data?.data?.[0]?.id;
                const res = await PacepardAPI.hackathon.getHackathons({
                    workspaceId,
                    limit: 25,
                    page: 1,
                });
                if (res.error === false) {
                    setHackathons(res.data?.data ?? res.data ?? []);
                } else {
                    toast.error(res.message || 'Failed to load hackathons');
                }
            } catch (err) {
                console.error('Error loading hackathons:', err);
                toast.error('Failed to load hackathons');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHackathons();
    }, []);

    const filterByTabId = (list: IHackathon[], tabId: TabId) => {
        switch (tabId) {
            case 'drafts':
                return list.filter((h) => h.status === HackStatusType.DRAFT);
            case 'published':
                return list.filter((h) => h.status === HackStatusType.PUBLISHED);
            case 'closed':
                return list.filter((h) => h.status === HackStatusType.CLOSED);
            case 'deleted':
                return list.filter((h) => h.status === HackStatusType.ARCHIVED);
            default:
                return list;
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await PacepardAPI.hackathon.deleteHackathon(id);
            if (res.error === false) {
                setHackathons((prev) => prev.filter((h) => h.id !== id));
                toast.success('Hackathon deleted');
            } else {
                toast.error(res.message || 'Failed to delete hackathon');
            }
        } catch {
            toast.error('Failed to delete hackathon');
        }
    };

    return (
        <div className="min-h-full w-full -mx-8 -my-6 bg-[#f8f7f7] px-8 py-6">
            {/* Header: Workspace title + New hackathon — Figma 14119:7859 */}
            <div
                className="flex items-center justify-between border-b border-[#bdbdbd]/30 pb-4"
                style={{ minHeight: 52 }}
            >
                <h1
                    className="text-2xl font-bold leading-8 text-[#2b2a2c]"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                    Workspace
                </h1>
                <Button
                    onClick={() => navigate('/hackathon/create')}
                    className="h-10 min-w-[151px] rounded-[6px] bg-[#333234] px-5 text-sm font-medium text-[#eaeaea] hover:bg-[#333234]/90 gap-2"
                    style={{ fontFamily: 'Matter, DM Sans, sans-serif' }}
                >
                    <Plus className="h-4 w-4" />
                    New hackathon
                </Button>
            </div>

            {/* Card with tabs + list — Figma 14119:7858 frame */}
            <Card className="mt-6 rounded-2xl border-[#bdbdbd]/30 bg-white overflow-hidden">
                {/* Tabs row — Figma: Hackathon | Drafts | Published | Closed | Deleted */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
                    <TabsList className="h-[42px] w-full justify-start rounded-none border-b border-[#bdbdbd]/30 bg-white p-0 gap-0 shadow-none">
                        {[
                            { id: 'all', label: 'Hackathon' },
                            { id: 'drafts', label: 'Drafts' },
                            { id: 'published', label: 'Published' },
                            { id: 'closed', label: 'Closed' },
                            { id: 'deleted', label: 'Deleted' },
                        ].map((tab, i) => (
                            <div key={tab.id} className="flex h-full items-center">
                                {i > 0 && (
                                    <div
                                        className="h-4 w-px flex-shrink-0 bg-[#bdbdbd]/30"
                                        aria-hidden
                                    />
                                )}
                                <TabsTrigger
                                    value={tab.id}
                                    className={cn(
                                        'h-[42px] flex-none rounded-none border-b-2 border-transparent bg-transparent px-4 py-0 text-[14px] font-medium leading-5 shadow-none',
                                        'text-[#707070] data-[state=active]:border-[#292929] data-[state=active]:text-[#292929] data-[state=active]:bg-transparent data-[state=active]:shadow-none',
                                        'focus-visible:ring-[3px] focus-visible:ring-ring/50'
                                    )}
                                    style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.14px' }}
                                >
                                    {tab.label}
                                </TabsTrigger>
                            </div>
                        ))}
                    </TabsList>

                    {TAB_IDS.map((tabId) => (
                        <TabsContent key={tabId} value={tabId} className="mt-0">
                            {isLoading ? (
                                <div className="divide-y divide-border/20">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <HackathonRowSkeleton key={i} />
                                    ))}
                                </div>
                            ) : filterByTabId(hackathons, tabId).length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <p
                                        className="text-sm font-medium text-[#9d9d9d]"
                                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                                    >
                                        No hackathons in this tab.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => navigate('/hackathon/create')}
                                    >
                                        New hackathon
                                    </Button>
                                </div>
                            ) : (
                                <CardContent className="p-0 divide-y divide-[#eaeaea]">
                                    {filterByTabId(hackathons, tabId).map((hackathon) => (
                                    <div
                                        key={hackathon.id}
                                        className="flex h-[54px] items-center gap-4 px-6 hover:bg-muted/20 cursor-pointer transition-colors group"
                                        onClick={() =>
                                            navigate(
                                                routil.getHackathonPath(hackathon.slug ?? hackathon.id)
                                            )
                                        }
                                    >
                                        {/* Thumbnail 54x54, white bg, border #eaeaea, rounded 4px — Figma 14119:7883 */}
                                        <div className="h-[54px] w-[54px] flex-shrink-0 overflow-hidden rounded border border-[#eaeaea] bg-white">
                                            {hackathon.image ? (
                                                <img
                                                    src={hackathon.image}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-[#bdbdbd]/40 text-xs font-semibold text-[#9d9d9d]">
                                                    {getInitials(hackathon.name || 'H')}
                                                </div>
                                            )}
                                        </div>

                                        {/* Title 16px SemiBold #2b2a2c + status badge (h-22, rounded 3) + Last updated 14px — Figma 14119:7886–7892 */}
                                        <div className="flex flex-1 min-w-0 flex-col justify-center gap-0.5">
                                            <p
                                                className="text-base font-semibold leading-6 text-[#2b2a2c] truncate"
                                                style={{
                                                    fontFamily: 'DM Sans, sans-serif',
                                                    letterSpacing: '0.16px',
                                                }}
                                            >
                                                {hackathon.name || 'Untitled'}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    style={{
                                                        fontFamily: 'DM Sans, sans-serif',
                                                        backgroundColor: 'rgba(189, 189, 189, 0.3)',
                                                        letterSpacing: '0.24px',
                                                    }}
                                                >
                                                    {statusLabel(hackathon.status)}
                                                </span>
                                                <span
                                                    className="text-sm font-medium leading-5 text-[#9d9d9d]"
                                                    style={{
                                                        fontFamily: 'DM Sans, sans-serif',
                                                        letterSpacing: '0.14px',
                                                    }}
                                                >
                                                    {formatLastUpdated(
                                                        (hackathon as any).updatedAt ?? (hackathon as any).createdAt
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(
                                                            routil.getHackathonPath(
                                                                hackathon.slug ?? hackathon.id
                                                            )
                                                        );
                                                    }}
                                                >
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(
                                                            routil.getHackathonPath(
                                                                hackathon.slug ?? hackathon.id,
                                                                'edit'
                                                            )
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(hackathon.id);
                                                    }}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))}
                                </CardContent>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </Card>
        </div>
    );
};

export default Workspace;
