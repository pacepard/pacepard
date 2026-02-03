import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@pacepard/ui/components/button';
import { Input } from '@pacepard/ui/components/input';
import { Label } from '@pacepard/ui/components/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@pacepard/ui/components/card';
import { Avatar, AvatarFallback } from '@pacepard/ui/components/avatar';
import { Alert, AlertDescription } from '@pacepard/ui/components/alert';
import { RadioGroup, RadioGroupItem } from '@pacepard/ui/components/radio-group';
import { Info } from 'lucide-react';
import { toast } from '@pacepard/ui';
import { PacepardAPI } from '@/config/pacepard';
import { UserContext } from '@pacepard/sdk';
import { cn } from '@pacepard/ui/lib/utils';

const inviteMemberSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    role: z.enum(['manager', 'developer'], {
        required_error: 'Please select a role',
    }),
});

type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;

interface TeamMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isOwner?: boolean;
    isCurrentUser?: boolean;
}

const TeamMembers = () => {
    const { user } = useContext(UserContext) || {};
    const [isLoading, setIsLoading] = useState(false);
    const [workspace, setWorkspace] = useState<any>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [seatsLeft, setSeatsLeft] = useState(5); // TODO: Get from subscription data

    const userObj = user as any;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<InviteMemberFormValues>({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            email: '',
            role: 'developer',
        },
    });

    const selectedRole = watch('role');

    // Fetch workspace and members data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // TODO: Get current workspace ID from context or route params
                const workspaceResponse = await PacepardAPI.workspace.getWorkspaces({
                    limit: 1,
                    page: 1,
                    order: 'desc',
                });

                if (workspaceResponse.error === false && workspaceResponse.data?.data?.[0]) {
                    const workspaceData = workspaceResponse.data.data[0];
                    setWorkspace(workspaceData);

                    // TODO: Fetch actual team members from API
                    // For now, show current user as team owner
                    setMembers([
                        {
                            id: userObj?.id || '1',
                            firstName: userObj?.firstName || 'Damola',
                            lastName: userObj?.lastName || 'Oladipo',
                            email: userObj?.email || 'hello@pacepard.com',
                            role: 'owner',
                            isOwner: true,
                            isCurrentUser: true,
                        },
                    ]);
                }
            } catch (error) {
                console.error('Error fetching workspace data:', error);
            }
        };

        fetchData();
    }, [userObj]);

    // Get initials for avatar
    const getInitials = (firstName?: string, lastName?: string) => {
        const first = firstName?.charAt(0) || '';
        const last = lastName?.charAt(0) || '';
        return `${first}${last}`.toUpperCase() || 'U';
    };

    const onSubmit = async (data: InviteMemberFormValues) => {
        setIsLoading(true);
        try {
            if (!workspace?.id) {
                toast.error('Workspace not found');
                return;
            }

            const response = await PacepardAPI.workspace.inviteMember({
                workspaceId: workspace.id,
                email: data.email,
            });

            if (response.error === false) {
                toast.success('Team member invited successfully');
                reset();
                // TODO: Refresh members list
            } else {
                // Use React Hook Form's setError for server errors
                // setError('root', {
                //     type: 'server',
                //     message: response.message || 'Failed to invite team member. Please try again.',
                // });
                toast.error(response.message || 'Failed to invite team member');
            }
        } catch (error) {
            console.error('Error inviting team member:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'owner':
                return 'Team Owner';
            case 'manager':
                return 'Manager';
            case 'developer':
                return 'Developer';
            default:
                return role;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-foreground">Team Members</h1>

            {/* Add Team Member Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Add Team Member</CardTitle>
                    <CardDescription>
                        Add a new team member to your team, allowing them to collaborate with you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Alert about subscription seats */}
                        <Alert className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                            <Info className="h-4 w-4 text-red-600 dark:text-red-400" />
                            <AlertDescription className="text-red-800 dark:text-red-200">
                                Please provide the email address of the person you would like to add to this team. You've got{' '}
                                <strong>{seatsLeft} seats left</strong> in your{' '}
                                <a href="#" className="underline hover:no-underline">
                                    current subscription plan
                                </a>
                                .
                            </AlertDescription>
                        </Alert>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="hi@tiptap.dev"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-3">
                            <Label>Role</Label>
                            <RadioGroup
                                value={selectedRole}
                                onValueChange={(value) => setValue('role', value as 'manager' | 'developer')}
                                className="space-y-3"
                            >
                                {/* Manager Option */}
                                <div
                                    className={cn(
                                        'flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors',
                                        selectedRole === 'manager'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                    )}
                                    onClick={() => setValue('role', 'manager')}
                                >
                                    <RadioGroupItem value="manager" id="role-manager" className="mt-0.5" />
                                    <div className="flex-1">
                                        <Label
                                            htmlFor="role-manager"
                                            className="font-semibold cursor-pointer"
                                        >
                                            Manager
                                        </Label>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Managers can perform any action. However, they cannot manage billing.
                                        </p>
                                    </div>
                                </div>

                                {/* Developer Option */}
                                <div
                                    className={cn(
                                        'flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors',
                                        selectedRole === 'developer'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                    )}
                                    onClick={() => setValue('role', 'developer')}
                                >
                                    <RadioGroupItem value="developer" id="role-developer" className="mt-0.5" />
                                    <div className="flex-1">
                                        <Label
                                            htmlFor="role-developer"
                                            className="font-semibold cursor-pointer"
                                        >
                                            Developer
                                        </Label>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Developer have the ability to access all the content.
                                        </p>
                                    </div>
                                </div>
                            </RadioGroup>
                            {errors.role && (
                                <p className="text-sm text-destructive">
                                    {errors.role.message}
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
                            {isLoading ? 'Adding...' : 'Add'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Team Members List Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                        All of the people that are part of this team.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-muted text-muted-foreground">
                                        {getInitials(member.firstName, member.lastName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium text-foreground">
                                        {member.firstName} {member.lastName}
                                        {member.isCurrentUser && ' (You)'}
                                        {member.isOwner && ' (Team Owner)'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {member.email}
                                    </p>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {getRoleLabel(member.role)}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TeamMembers;
