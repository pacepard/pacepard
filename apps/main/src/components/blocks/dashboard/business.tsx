import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@pacepard/ui/components/card';
import { Building2, Users, Briefcase, BarChart3 } from 'lucide-react';

const BusinessDashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Business Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage your organization, talent, and opportunities.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Organization</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">—</p>
                        <p className="text-xs text-muted-foreground">Company profile</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Team</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">—</p>
                        <p className="text-xs text-muted-foreground">Team members</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">—</p>
                        <p className="text-xs text-muted-foreground">Open roles & projects</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Insights</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">—</p>
                        <p className="text-xs text-muted-foreground">Hiring & engagement</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Open opportunities</CardTitle>
                        <CardDescription>Post and manage jobs, hackathons, and projects.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Your posted opportunities will appear here.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Talent pipeline</CardTitle>
                        <CardDescription>View applicants and shortlisted talent.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Pipeline and applications will appear here.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default BusinessDashboard;
