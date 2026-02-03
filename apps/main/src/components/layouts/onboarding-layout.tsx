// src/components/layouts/onboarding-layout.tsx
import React, { ReactNode } from 'react';
import PacepardLogo from '../common/Logo';
import { Toaster } from '@pacepard/ui/components/sonner';

interface IOnboardingLayout {
    title: string;
    logo: string;
    children: ReactNode;
    description?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'txl' | 'fxl' | 'sxl' | 'full';
    onboardingType?: 'talent' | 'business' | 'education';
}

export const OnboardingLayout = ({
    children,
    maxWidth = 'sxl',
}: IOnboardingLayout) => {
    const maxWidthClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        txl: 'max-w-2xl',
        fxl: 'max-w-4xl',
        sxl: 'max-w-6xl',
        full: 'max-w-full',
    }[maxWidth];

    return (
        <>
            <div className="min-h-screen w-full relative">
                <div className="absolute top-4 left-4 z-10">
                    <PacepardLogo />
                </div>

                <div className="w-full min-h-screen flex items-center justify-center px-6 md:px-10 pt-20 pb-12">
                    <div className={`${maxWidthClass} w-full`}>
                        {children}
                    </div>
                </div>
            </div>
            <Toaster />
        </>
    );
};
