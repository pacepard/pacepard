/**
 * Utility functions for onboarding flow
 */

import { UserType } from '@pacepard/sdk';

/**
 * Maps onboarding step and status to the appropriate route
 * @param step - Current onboarding step (0-4)
 * @param status - Onboarding status ('not-started' | 'in-progress' | 'completed')
 * @param userType - User type ('talent' | 'business' | 'user')
 * @returns The route path for the current step
 */
export function getOnboardingRoute(
    step: number,
    status: string,
    userType?: string,
): string {
    // If onboarding is completed, go to dashboard
    if (status === 'completed') {
        return '/dashboard';
    }

    // Map step to route
    switch (step) {
        case 0:
            // NOT_STARTED - go to initial onboarding
            return '/onboarding';

        case 1:
            // After user type selection - go to basic info
            return '/onboarding/basic-info';

        case 2:
            // After basic info - route based on userType
            if (userType === UserType.BUSINESS || userType === 'business') {
                return '/onboarding/business-info';
            } else {
                // For talent and user types
                return '/onboarding/user-info';
            }

        case 3:
            // After user/business info - go to create workspace
            return '/onboarding/create-workspace';

        case 4:
            // After workspace creation - go to invite teammates
            return '/onboarding/invite-teammates';

        default:
            // Default to dashboard if step is beyond expected range
            return '/dashboard';
    }
}

/**
 * Gets the route for the next onboarding step
 * @param currentStep - Current step number
 * @param userType - User type for step 2 routing
 * @returns The route path for the next step
 */
export function getNextOnboardingRoute(
    currentStep: number,
    userType?: string,
): string {
    return getOnboardingRoute(currentStep + 1, 'in-progress', userType);
}

/**
 * Gets the route for the previous onboarding step
 * @param currentStep - Current step number
 * @param userType - User type for step 2 routing
 * @returns The route path for the previous step, or null if at first step
 */
export function getPreviousOnboardingRoute(
    currentStep: number,
    userType?: string,
): string | null {
    if (currentStep <= 0) {
        return null;
    }

    // For step 3, need to determine if previous was user-info or business-info
    if (currentStep === 3) {
        if (userType === UserType.BUSINESS || userType === 'business') {
            return '/onboarding/business-info';
        } else {
            return '/onboarding/user-info';
        }
    }

    return getOnboardingRoute(currentStep - 1, 'in-progress', userType);
}
