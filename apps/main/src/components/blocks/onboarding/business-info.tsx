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
import { cn } from '@pacepard/ui/lib/utils';
import { PacepardAPI } from '@/config/pacepard';

const businessInfoSchema = z.object({
    businessName: z.string().min(1, 'Business name is required').trim(),
    businessType: z.enum(['COMPANY', 'NONPROFIT', 'GOVERNMENT', 'EDUCATION', 'PARTNER', 'OTHER'], {
        required_error: 'Business type is required',
    }),
    industry: z.string().min(1, 'Industry is required'),
});

type BusinessInfoFormValues = z.infer<typeof businessInfoSchema>;

const businessTypes = [
    { value: 'COMPANY', label: 'Company' },
    { value: 'NONPROFIT', label: 'Nonprofit' },
    { value: 'GOVERNMENT', label: 'Government' },
    { value: 'EDUCATION', label: 'Education' },
    { value: 'STARTUP', label: 'Startup' },
    { value: 'OTHER', label: 'Other' },
];

const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'media', label: 'Media & Entertainment' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'other', label: 'Other' },
];

const BusinessInfo: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<BusinessInfoFormValues>({
        resolver: zodResolver(businessInfoSchema),
        defaultValues: {
            businessName: '',
            businessType: undefined,
            industry: '',
        },
    });

    const businessType = watch('businessType');
    const industry = watch('industry');

    const onSubmit = async (data: BusinessInfoFormValues) => {
        setIsLoading(true);
        try {
            const response = await PacepardAPI.user.setBusinessInfo({
                businessName: data.businessName,
                businessType: data.businessType,
                industry: data.industry,
            });

            if (response.error === false && (response.status === 200 || response.status === 201)) {
                navigate('/onboarding/complete');
            } else {
                setError('root', {
                    type: 'server',
                    message: response.message || 'Failed to save information. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error submitting business info:', error);
            setError('root', {
                type: 'server',
                message: 'An error occurred. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/onboarding/step2-basic-info');
    };

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen py-12 px-4">
            <div className="w-full max-w-md mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-semibold text-foreground tracking-tight">
                        Tell us about your business
                    </h1>
                    <p className="text-base text-muted-foreground">
                        We'd love to get to know your business better.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Business Name */}
                    <div className="space-y-2">
                        <Label htmlFor="businessName" className="text-sm font-medium text-foreground">
                            Business Name *
                        </Label>
                        <Input
                            id="businessName"
                            type="text"
                            placeholder="Acme Inc."
                            {...register('businessName')}
                            className={cn(
                                errors.businessName && 'border-destructive'
                            )}
                        />
                        {errors.businessName && (
                            <p className="text-sm text-destructive">
                                {errors.businessName.message}
                            </p>
                        )}
                    </div>

                    {/* Business Type */}
                    <div className="space-y-2">
                        <Label htmlFor="businessType" className="text-sm font-medium text-foreground">
                            Business Type *
                        </Label>
                        <Select
                            value={businessType}
                            onValueChange={(value) => setValue('businessType', value as any)}
                        >
                            <SelectTrigger
                                id="businessType"
                                className={cn(
                                    'w-full',
                                    errors.businessType && 'border-destructive'
                                )}
                            >
                                <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                            <SelectContent>
                                {businessTypes.map((bt) => (
                                    <SelectItem key={bt.value} value={bt.value}>
                                        {bt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.businessType && (
                            <p className="text-sm text-destructive">
                                {errors.businessType.message}
                            </p>
                        )}
                    </div>

                    {/* Industry */}
                    <div className="space-y-2">
                        <Label htmlFor="industry" className="text-sm font-medium text-foreground">
                            Industry *
                        </Label>
                        <Select
                            value={industry}
                            onValueChange={(value) => setValue('industry', value)}
                        >
                            <SelectTrigger
                                id="industry"
                                className={cn(
                                    'w-full',
                                    errors.industry && 'border-destructive'
                                )}
                            >
                                <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                                {industries.map((ind) => (
                                    <SelectItem key={ind.value} value={ind.value}>
                                        {ind.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.industry && (
                            <p className="text-sm text-destructive">
                                {errors.industry.message}
                            </p>
                        )}
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
                            {isLoading ? 'Loading...' : 'Continue to dashboard'}
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

export default BusinessInfo;
