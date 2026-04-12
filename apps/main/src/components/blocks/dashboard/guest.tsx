import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@pacepard/ui/components/card';
import { Compass, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

const GuestDashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    Guest Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                    Explore the platform and complete your profile to unlock
                    more.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Explore
                        </CardTitle>
                        <Compass className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">—</p>
                        <p className="text-xs text-muted-foreground">
                            Discover content
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Get started
                        </CardTitle>
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">—</p>
                        <p className="text-xs text-muted-foreground">
                            Onboarding steps
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Resources
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">—</p>
                        <p className="text-xs text-muted-foreground">
                            Guides and help
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Next steps
                        </CardTitle>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">—</p>
                        <p className="text-xs text-muted-foreground">
                            Complete your profile
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Complete your profile</CardTitle>
                        <CardDescription>
                            Add your role and basic info to see a personalized
                            dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Go to onboarding or settings to set your user type
                            and details.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Discover opportunities</CardTitle>
                        <CardDescription>
                            Browse workshops, challenges, and opportunities open
                            to guests.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Public workshops and events will appear here.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default GuestDashboard;
