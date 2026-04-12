import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@pacepard/ui/components/button';
import { Input } from '@pacepard/ui/components/input';
import { Label } from '@pacepard/ui/components/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@pacepard/ui/components/card';
import { Avatar, AvatarFallback } from '@pacepard/ui/components/avatar';
import { toast } from '@pacepard/ui';
import { PacepardAPI } from '@/config/pacepard';
import { UserContext } from '@pacepard/sdk';

const teamSettingsSchema = z.object({
    teamName: z.string().min(1, 'Team name is required').trim(),
});

type TeamSettingsFormValues = z.infer<typeof teamSettingsSchema>;

const TeamSettings = () => {
    const { user } = useContext(UserContext) || {};
    const [isLoading, setIsLoading] = useState(false);
    const [workspace, setWorkspace] = useState<any>(null);

    const userObj = user as any;

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<TeamSettingsFormValues>({
        resolver: zodResolver(teamSettingsSchema),
        defaultValues: {
            teamName: '',
        },
    });

    // Fetch workspace data
    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                // TODO: Get current workspace ID from context or route params
                // For now, fetch first workspace
                const response = await PacepardAPI.workspace.getWorkspaces({
                    limit: 1,
                    page: 1,
                    order: 'desc',
                });

                if (response.error === false && response.data?.data?.[0]) {
                    const workspaceData = response.data.data[0];
                    setWorkspace(workspaceData);
                    setValue('teamName', workspaceData.name || 'Pacepard');
                }
            } catch (error) {
                console.error('Error fetching workspace:', error);
            }
        };

        fetchWorkspace();
    }, [setValue]);

    // Get initials for avatar
    const getInitials = (firstName?: string, lastName?: string) => {
        const first = firstName?.charAt(0) || '';
        const last = lastName?.charAt(0) || '';
        return `${first}${last}`.toUpperCase() || 'U';
    };

    const onSubmit = async (data: TeamSettingsFormValues) => {
        setIsLoading(true);
        try {
            if (!workspace?.id) {
                toast.error('Workspace not found');
                return;
            }

            const response = await PacepardAPI.workspace.updateWorkspace({
                id: workspace.id,
                name: data.teamName,
                description: workspace.description ?? '',
            });

            if (response.error === false) {
                toast.success('Team information updated successfully');
                // Update local workspace state
                setWorkspace({ ...workspace, name: data.teamName });
            } else {
                // Use React Hook Form's setError for server errors
                // setError('root', {
                //     type: 'server',
                //     message: response.message || 'Failed to update team information. Please try again.',
                // });
                toast.error(response.message || 'Failed to update team information');
            }
        } catch (error) {
            console.error('Error updating team settings:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-foreground">Team Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Team Information</CardTitle>
                    <CardDescription>
                        The team's name and owner information.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Owner Information */}
                        <div className="flex items-center gap-4 pb-4 border-b">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-muted text-muted-foreground">
                                    {getInitials(userObj?.firstName, userObj?.lastName)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-foreground">
                                    {userObj?.firstName && userObj?.lastName
                                        ? `${userObj.firstName} ${userObj.lastName}`
                                        : 'User'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {userObj?.email || 'No email'}
                                </p>
                            </div>
                        </div>

                        {/* Team Name */}
                        <div className="space-y-2">
                            <Label htmlFor="teamName">Team Name</Label>
                            <Input
                                id="teamName"
                                type="text"
                                placeholder="Pacepard"
                                {...register('teamName')}
                            />
                            {errors.teamName && (
                                <p className="text-sm text-destructive">
                                    {errors.teamName.message}
                                </p>
                            )}
                        </div>

                        {errors.root && (
                            <p className="text-sm text-destructive">
                                {errors.root.message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="w-full sm:w-auto"
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default TeamSettings;
