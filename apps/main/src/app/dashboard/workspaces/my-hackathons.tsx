import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreHorizontal, Calendar } from 'lucide-react';
import { Button } from '@pacepard/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@pacepard/ui/components/card';
import { Badge } from '@pacepard/ui/components/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@pacepard/ui/components/avatar';
import { Skeleton } from '@pacepard/ui/components/skeleton';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@pacepard/ui/components/dropdown-menu';
import { toast } from '@pacepard/ui';
import { PacepardAPI } from '@/config/pacepard';
import { IHackathon, HackStatusType } from '@pacepard/sdk';

const statusVariant = (
    status: HackStatusType,
): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
        case HackStatusType.PUBLISHED:
            return 'default';
        case HackStatusType.DRAFT:
            return 'secondary';
        case HackStatusType.CLOSED:
        case HackStatusType.ARCHIVED:
            return 'destructive';
        default:
            return 'outline';
    }
};

const statusLabel = (status: HackStatusType): string => {
    switch (status) {
        case HackStatusType.PUBLISHED:
            return 'Active';
        case HackStatusType.DRAFT:
            return 'Draft';
        case HackStatusType.CLOSED:
            return 'Closed';
        case HackStatusType.ARCHIVED:
            return 'Archived';
        default:
            return status;
    }
};

const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
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
    <div className="flex items-center gap-4 py-3 px-4">
        <Skeleton className="h-10 w-10 rounded-md flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
    </div>
);

const MyHackathons = () => {
    const navigate = useNavigate();
    const [hackathons, setHackathons] = useState<IHackathon[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-foreground">My Hackathons</h1>
                    <Skeleton className="h-9 w-36 rounded-md" />
                </div>
                <Card className="rounded-2xl border border-border/30">
                    <CardContent className="p-0 divide-y divide-border/30">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <HackathonRowSkeleton key={i} />
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (hackathons.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="flex flex-col items-center gap-4 text-center max-w-[435px]">
                    <h2
                        className="text-base font-bold text-[#2b2a2c]"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                        Your hackathon journey starts here
                    </h2>
                    <p
                        className="text-base text-[#545454] leading-6"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                        Create your first hackathon to start accepting projects, managing teams,
                        and tracking progress in one place.
                    </p>
                    <Button
                        onClick={() => navigate('/create-hackathon')}
                        className="bg-[#333234] hover:bg-[#333234]/90 text-[#eaeaea] rounded-md h-10 px-5 gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        New hackathon
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-foreground">My Hackathons</h1>
                <Button
                    onClick={() => navigate('/create-hackathon')}
                    className="bg-[#333234] hover:bg-[#333234]/90 text-[#eaeaea] rounded-md h-10 px-5 gap-2"
                >
                    <Plus className="h-4 w-4" />
                    New hackathon
                </Button>
            </div>

            <Card className="rounded-2xl border border-border/30 overflow-hidden">
                <CardHeader className="px-6 py-4 border-b border-border/30">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {hackathons.length} hackathon{hackathons.length !== 1 ? 's' : ''}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-border/20">
                    {hackathons.map((hackathon) => {
                        const startDate = formatDate(hackathon.settings?.startDate);
                        const closeDate = formatDate(hackathon.settings?.closeDate);
                        const dateRange =
                            startDate !== '—' || closeDate !== '—'
                                ? `${startDate} – ${closeDate}`
                                : null;

                        return (
                            <div
                                key={hackathon.id}
                                className="flex items-center gap-4 px-6 py-3 hover:bg-muted/30 cursor-pointer transition-colors group"
                                onClick={() =>
                                    navigate('/hackathon-details', {
                                        state: { hackathonId: hackathon.id },
                                    })
                                }
                            >
                                {/* Thumbnail */}
                                <Avatar className="h-10 w-10 rounded-md flex-shrink-0 border border-border/20">
                                    {hackathon.image && (
                                        <AvatarImage
                                            src={hackathon.image}
                                            alt={hackathon.name}
                                            className="object-cover"
                                        />
                                    )}
                                    <AvatarFallback className="rounded-md bg-muted/60 text-muted-foreground text-xs font-medium">
                                        {getInitials(hackathon.name || 'H')}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Name + date */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {hackathon.name}
                                    </p>
                                    {dateRange && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <Calendar className="h-3 w-3" />
                                            {dateRange}
                                        </p>
                                    )}
                                </div>

                                {/* Status badge */}
                                <Badge
                                    variant={statusVariant(hackathon.status)}
                                    className="text-xs"
                                >
                                    {statusLabel(hackathon.status)}
                                </Badge>

                                {/* Actions */}
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
                                                navigate('/hackathon-details', {
                                                    state: { hackathonId: hackathon.id },
                                                });
                                            }}
                                        >
                                            View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate('/edit-hackathon', {
                                                    state: { hackathonId: hackathon.id },
                                                });
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
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
};

export default MyHackathons;
