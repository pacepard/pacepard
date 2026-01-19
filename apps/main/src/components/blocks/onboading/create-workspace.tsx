import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@pacepard/ui/components/button';
import { Input } from '@pacepard/ui/components/input';
import { Label } from '@pacepard/ui/components/label';
import { ImageUpload } from '@pacepard/ui/components/image-upload';
import { pacepardAPIClient } from '@pacepard/sdk';
import { toast } from '@pacepard/ui';
import { createWorkspaceSchema, CreateWorkspaceFormValues } from './validation';
import { cn } from '@pacepard/ui/lib/utils';

export const CreateWorkspace: React.FC = () => {
    const navigate = useNavigate();
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CreateWorkspaceFormValues>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: '',
        },
    });

    const workspaceName = watch('name');

    // Get the first letter of workspace name for icon placeholder, or default to 'N'
    const getIconLetter = () => {
        if (workspaceName?.trim()) {
            return workspaceName.trim().charAt(0).toUpperCase();
        }
        return 'N';
    };

    const handleImageChange = (file: File | null, preview: string | null) => {
        setSelectedFile(file);
        setSelectedIcon(preview);
    };

    const onSubmit = async (data: CreateWorkspaceFormValues) => {
        try {
            const response = await pacepardAPIClient().workspace.createWorkspace({
                name: data.name.trim(),
                description: '', // Can be added later if needed
            });

            if (response.error === false && (response.status === 200 || response.status === 201)) {
                // Navigate first, then show optional success toast
                navigate('/onboarding/invite-teammates');
                // Optional: Show success toast after navigation (non-blocking, informational)
                toast.success('Workspace created');
            } else {
                // Use React Hook Form's setError for server errors (inline, not toast)
                setError('root', {
                    type: 'server',
                    message: response.message || 'Failed to create workspace. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error creating workspace:', error);
            // Use React Hook Form's setError for unexpected errors
            setError('root', {
                type: 'server',
                message: 'Failed to create workspace. Please try again.',
            });
        }
    };

    const handleBack = () => {
        navigate('/onboarding/submit-info');
    };

    return (
        <div className="flex flex-col items-center justify-center w-full relative min-h-[600px] py-12">
            {/* Form Section */}
            <div className="w-full max-w-[420px] mx-auto space-y-8 z-10">
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-[32px] leading-[1.2] font-semibold text-foreground tracking-tight">
                        Create your workspace
                    </h1>
                    <p className="text-[15px] leading-[1.5] text-muted-foreground">
                        Fill in some details for your teammates.
                    </p>
                </div>

                {/* Icon Selection */}
                <div className="flex flex-col items-center space-y-3">
                    <ImageUpload
                        value={selectedIcon}
                        onChange={handleImageChange}
                        size="md"
                        accept="image/*"
                        maxSize={2 * 1024 * 1024} // 2MB
                        placeholder={
                            <span className="text-[36px] font-semibold text-[#37352f] dark:text-[#9b9a97]">
                                {getIconLetter()}
                            </span>
                        }
                    />
                    <p className="text-[14px] text-[#787774] dark:text-[#9b9a97]">Choose icon</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    {/* Workspace Name */}
                    <div className="space-y-2">
                        <Label 
                            htmlFor="workspace-name" 
                            className="text-[14px] font-medium text-foreground leading-[1.5]"
                        >
                            Workspace name
                        </Label>
                        <Input
                            id="workspace-name"
                            type="text"
                            placeholder="Paystack"
                            {...register('name')}
                            className={cn(
                                'w-full h-[36px]',
                                'text-[15px] leading-[1.5]',
                                'bg-white dark:bg-[#1a1a1a]',
                                'border-[#e9e9e6] dark:border-[#404040]',
                                'rounded-[3px]',
                                'px-[12px] py-[6px]',
                                'shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]',
                                'transition-all duration-150',
                                'focus-visible:border-[#2383e2] dark:focus-visible:border-[#2383e2]',
                                'focus-visible:ring-1 focus-visible:ring-[#2383e2]/20',
                                'focus-visible:shadow-[0_0_0_3px_rgba(35,131,226,0.1)]',
                                'placeholder:text-[#9b9a97] dark:placeholder:text-[#6e6d69]',
                                errors.name && 'border-[#eb5757] dark:border-[#eb5757] focus-visible:border-[#eb5757] focus-visible:ring-[#eb5757]/20'
                            )}
                        />
                        <p className="text-[13px] leading-[1.5] text-[#787774] dark:text-[#9b9a97]">
                            The name of your company or organization.
                        </p>
                        {errors.name && (
                            <p className="text-[13px] text-[#eb5757] dark:text-[#ff6b6b] mt-1">
                                {errors.name.message}
                            </p>
                        )}
                        {errors.root && (
                            <p className="text-[13px] text-[#eb5757] dark:text-[#ff6b6b] mt-1">
                                {errors.root.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 pt-2">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            'w-full h-[36px]',
                            'text-[14px] font-medium',
                            'bg-[#2383e2] hover:bg-[#1a73d1]',
                            'text-white',
                            'rounded-[3px]',
                            'shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]',
                            'hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.1)]',
                            'transition-all duration-150',
                            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#2383e2]',
                            'active:scale-[0.98]',
                            'focus:outline-none focus:ring-2 focus:ring-[#2383e2]/20 focus:ring-offset-2'
                        )}
                    >
                        {isSubmitting ? 'Creating...' : 'Continue'}
                    </Button>
                    <button
                        type="button"
                        onClick={handleBack}
                        className={cn(
                            'w-full text-center',
                            'text-[14px] text-[#787774] dark:text-[#9b9a97]',
                            'hover:text-foreground',
                            'transition-colors duration-150',
                            'py-2 rounded-[3px]',
                            'hover:bg-[#f7f6f3] dark:hover:bg-[#2e2e2e]'
                        )}
                    >
                        Back
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateWorkspace;
