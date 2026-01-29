import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@pacepard/ui/components/button';
import { Input } from '@pacepard/ui/components/input';
import { Label } from '@pacepard/ui/components/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@pacepard/ui/components/select';
import { toast } from '@pacepard/ui';
import { cn } from '@pacepard/ui/lib/utils';
import { PacepardAPI } from '@/config/pacepard';
import { CountrySelector } from './country-selector';

const basicInfoSchema = z.object({
    firstName: z.string().min(1, 'First name is required').trim(),
    lastName: z.string().min(1, 'Last name is required').trim(),
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(1, 'City is required').trim(),
    timeZone: z.string().min(1, 'Time zone is required'),
});

type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

// Common timezones - you can expand this list
const timeZones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
    { value: 'Africa/Lagos', label: 'Lagos (WAT)' },
];


const BasicInfo: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<BasicInfoFormValues>({
        resolver: zodResolver(basicInfoSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            country: 'NG', // Default to Nigeria
            city: '',
            timeZone: '',
        },
    });

    const country = watch('country');
    const timeZone = watch('timeZone');

    const onSubmit = async (data: BasicInfoFormValues) => {
        setIsLoading(true);
        try {
            const response = await PacepardAPI.user.setBasicInfo({
                firstName: data.firstName,
                lastName: data.lastName,
                location: {
                    country: data.country,
                    city: data.city,
                },
                timeZone: data.timeZone,
            });

            if (response.error === false && (response.status === 200 || response.status === 201)) {
                navigate('/onboarding/user-info');
            } else {
                setError('root', {
                    type: 'server',
                    message: response.message || 'Failed to save information. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error submitting basic info:', error);
            setError('root', {
                type: 'server',
                message: 'An error occurred. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/onboarding');
    };

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen py-12 px-4">
            <div className="w-full max-w-md mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-semibold text-foreground tracking-tight">
                        Tell us about yourself
                    </h1>
                    <p className="text-base text-muted-foreground">
                        We'd love to get to know you better.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* First Name */}
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                            First Name *
                        </Label>
                        <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            {...register('firstName')}
                            className={cn(
                                errors.firstName && 'border-destructive'
                            )}
                        />
                        {errors.firstName && (
                            <p className="text-sm text-destructive">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                            Last Name *
                        </Label>
                        <Input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            {...register('lastName')}
                            className={cn(
                                errors.lastName && 'border-destructive'
                            )}
                        />
                        {errors.lastName && (
                            <p className="text-sm text-destructive">
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>


                    <CountrySelector
                        value={country}
                        onChange={(value) => setValue('country', value)}
                        error={!!errors.country}
                        label="Country"
                        required
                    />
                    {errors.country && (
                        <p className="text-sm text-destructive">
                            {errors.country.message}
                        </p>
                    )}

                    {/* City & Time Zone*/}
                    <div className="flex gap-2">

                        {/* City */}

                        <div className="space-y-2 flex-1">
                            <Label htmlFor="city" className="text-sm font-medium text-foreground">
                                City *
                            </Label>
                            <Input
                                id="city"
                                type="text"
                                placeholder="New York"
                                {...register('city')}
                                className={cn(
                                    errors.city && 'border-destructive'
                                )}
                            />
                            {errors.city && (
                                <p className="text-sm text-destructive">
                                    {errors.city.message}
                                </p>
                            )}
                        </div>

                        {/* Time Zone */}
                        <div className="space-y-2 flex-1">
                            <Label htmlFor="timeZone" className="text-sm font-medium text-foreground">
                                Time Zone *
                            </Label>
                            <Select
                                value={timeZone}
                                onValueChange={(value) => setValue('timeZone', value)}
                            >
                                <SelectTrigger
                                    id="timeZone"
                                    className={cn(
                                        'w-full',
                                        errors.timeZone && 'border-destructive'
                                    )}
                                >
                                    <SelectValue placeholder="Select your time zone" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeZones.map((tz) => (
                                        <SelectItem key={tz.value} value={tz.value}>
                                            {tz.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.timeZone && (
                                <p className="text-sm text-destructive">
                                    {errors.timeZone.message}
                                </p>
                            )}
                        </div>

                    </div>



                    {/* Server Error */}
                    {errors.root && (
                        <p className="text-sm text-destructive">
                            {errors.root.message}
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="w-full h-10"
                        >
                            {isLoading ? 'Loading...' : 'Continue'}
                        </Button>
                        <button
                            type="button"
                            onClick={handleBack}
                            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BasicInfo;
