import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@pacepard/ui/components/button';
import { Input } from '@pacepard/ui/components/input';
import { Label } from '@pacepard/ui/components/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@pacepard/ui/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@pacepard/ui/components/tabs';
import { toast } from '@pacepard/ui';
import { PacepardAPI } from '@/config/pacepard';
import { UserContext } from '@pacepard/sdk';
import TeamSettings from './team-settings';
import TeamMembers from './team-members';

const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required').trim(),
    lastName: z.string().min(1, 'Last name is required').trim(),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirmation: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const Settings = () => {
    const { user } = useContext(UserContext) || {};
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);

    const userObj = user as any;

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        setValue: setProfileValue,
        formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: userObj?.firstName || '',
            lastName: userObj?.lastName || '',
            email: userObj?.email || '',
        },
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        setError: setPasswordError,
        reset: resetPassword,
        formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            passwordConfirmation: '',
        },
    });

    // Update form values when user data changes
    useEffect(() => {
        if (userObj) {
            setProfileValue('firstName', userObj.firstName || '');
            setProfileValue('lastName', userObj.lastName || '');
            setProfileValue('email', userObj.email || '');
        }
    }, [userObj, setProfileValue]);

    const onProfileSubmit = async (data: ProfileFormValues) => {
        setIsLoadingProfile(true);
        try {
            // TODO: Implement API call to update profile
            // const response = await PacepardAPI.user.updateProfile(data);
            
            // Simulate API call for now
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            toast.success('Profile information updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            // Use React Hook Form's setError for server errors
            // setProfileError('root', {
            //     type: 'server',
            //     message: 'Failed to update profile. Please try again.',
            // });
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const onPasswordSubmit = async (data: PasswordFormValues) => {
        setIsLoadingPassword(true);
        try {
            const response = await PacepardAPI.auth.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            if (response.error === false) {
                toast.success('Password updated successfully');
                resetPassword();
            } else {
                setPasswordError('root', {
                    type: 'server',
                    message: response.message || 'Failed to update password. Please check your current password.',
                });
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setPasswordError('root', {
                type: 'server',
                message: 'An unexpected error occurred. Please try again.',
            });
        } finally {
            setIsLoadingPassword(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-foreground">Settings</h1>

            <Tabs defaultValue="my-settings" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="my-settings">My Settings</TabsTrigger>
                    <TabsTrigger value="team-settings">Team Settings</TabsTrigger>
                    <TabsTrigger value="team-members">Team Members</TabsTrigger>
                </TabsList>

                <TabsContent value="my-settings" className="space-y-6">
                    {/* Profile Information Card */}
                    <Card>
                <CardHeader>
                    <CardTitle>Profile information</CardTitle>
                    <CardDescription>
                        Update your account's profile information and email address.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input
                                id="firstName"
                                type="text"
                                placeholder="Damola"
                                {...registerProfile('firstName')}
                            />
                            {profileErrors.firstName && (
                                <p className="text-sm text-destructive">
                                    {profileErrors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder="Oladipo"
                                {...registerProfile('lastName')}
                            />
                            {profileErrors.lastName && (
                                <p className="text-sm text-destructive">
                                    {profileErrors.lastName.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="hello@pacepard.com"
                                {...registerProfile('email')}
                            />
                            {profileErrors.email && (
                                <p className="text-sm text-destructive">
                                    {profileErrors.email.message}
                                </p>
                            )}
                        </div>

                        {profileErrors.root && (
                            <p className="text-sm text-destructive">
                                {profileErrors.root.message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmittingProfile || isLoadingProfile}
                            className="w-full sm:w-auto"
                        >
                            {isLoadingProfile ? 'Saving...' : 'Save'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Update Password Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Update password</CardTitle>
                    <CardDescription>
                        Ensure your account is using a long, random password to stay secure.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                placeholder="Enter current password"
                                {...registerPassword('currentPassword')}
                            />
                            {passwordErrors.currentPassword && (
                                <p className="text-sm text-destructive">
                                    {passwordErrors.currentPassword.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="Enter new password"
                                {...registerPassword('newPassword')}
                            />
                            {passwordErrors.newPassword && (
                                <p className="text-sm text-destructive">
                                    {passwordErrors.newPassword.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="passwordConfirmation">Password confirmation</Label>
                            <Input
                                id="passwordConfirmation"
                                type="password"
                                placeholder="Confirm new password"
                                {...registerPassword('passwordConfirmation')}
                            />
                            {passwordErrors.passwordConfirmation && (
                                <p className="text-sm text-destructive">
                                    {passwordErrors.passwordConfirmation.message}
                                </p>
                            )}
                        </div>

                        {passwordErrors.root && (
                            <p className="text-sm text-destructive">
                                {passwordErrors.root.message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmittingPassword || isLoadingPassword}
                            className="w-full sm:w-auto"
                        >
                            {isLoadingPassword ? 'Saving...' : 'Save'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
                </TabsContent>

                <TabsContent value="team-settings">
                    <TeamSettings />
                </TabsContent>

                <TabsContent value="team-members">
                    <TeamMembers />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
