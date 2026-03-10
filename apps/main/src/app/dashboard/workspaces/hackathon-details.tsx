import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PacepardAPI } from '@/config/pacepard';
import { routil } from '@pacepard/sdk';
import { IHackathon } from '@pacepard/sdk';
import { Skeleton } from '@pacepard/ui/components/skeleton';

const TABS = ['overview', 'submission', 'share', 'edit'] as const;
type TabSlug = (typeof TABS)[number];

const HackathonDetails = () => {
    const { slug, tab } = useParams<{ slug: string; tab?: string }>();
    const navigate = useNavigate();
    const [hackathon, setHackathon] = useState<IHackathon | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const activeTab: TabSlug = tab && TABS.includes(tab as TabSlug) ? (tab as TabSlug) : 'overview';

    useEffect(() => {
        if (!slug) return;
        const fetchHackathon = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await PacepardAPI.hackathon.getHackathon({ id: slug });
                if (res.data?.data) {
                    setHackathon(res.data.data as IHackathon);
                } else {
                    setError('Hackathon not found');
                }
            } catch {
                setError('Failed to load hackathon');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHackathon();
    }, [slug]);

    const handleTabChange = (newTab: TabSlug) => {
        if (newTab === 'overview') {
            navigate(routil.getHackathonPath(slug!));
        } else {
            navigate(routil.getHackathonPath(slug!, newTab));
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }

    if (error || !hackathon) {
        return (
            <div className="p-6">
                <p className="text-destructive">{error ?? 'Hackathon not found'}</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold">{hackathon.name}</h1>
                {hackathon.description && (
                    <p className="text-muted-foreground mt-1">{hackathon.description}</p>
                )}
            </header>

            <nav className="flex gap-1 border-b border-border mb-6" role="tablist">
                {TABS.map((t) => (
                    <button
                        key={t}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === t}
                        onClick={() => handleTabChange(t)}
                        className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors hover:text-foreground border-transparent ${
                            activeTab === t ? 'border-primary text-foreground' : 'text-muted-foreground'
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </nav>

            <section aria-label={`${activeTab} content`}>
                {activeTab === 'overview' && (
                    <div>
                        <p className="text-muted-foreground">Status: {hackathon.status}</p>
                        {hackathon.settings?.startDate && (
                            <p className="text-muted-foreground mt-1">
                                Starts: {new Date(hackathon.settings.startDate).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                )}
                {activeTab === 'submission' && (
                    <div className="text-muted-foreground">Submission tab content.</div>
                )}
                {activeTab === 'share' && (
                    <div className="text-muted-foreground">Share tab content.</div>
                )}
                {activeTab === 'edit' && (
                    <div className="text-muted-foreground">
                        Edit form can be embedded here or navigate to edit page.
                    </div>
                )}
            </section>
        </div>
    );
};

export default HackathonDetails;
