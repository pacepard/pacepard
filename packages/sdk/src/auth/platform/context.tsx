import * as React from 'react';

import type { AuthPlatform } from './types';

const AuthPlatformContext = React.createContext<AuthPlatform | null>(null);

export function AuthPlatformProvider({
    value,
    children,
}: {
    value: AuthPlatform;
    children: React.ReactNode;
}) {
    return (
        <AuthPlatformContext.Provider value={value}>
            {children}
        </AuthPlatformContext.Provider>
    );
}

export function useAuthPlatform(): AuthPlatform {
    const ctx = React.useContext(AuthPlatformContext);
    if (!ctx) {
        throw new Error(
            'useAuthPlatform must be used within AuthPlatformProvider. ' +
                'For the main web app, wrap the tree with UserState (it includes the web auth bridge). ' +
                'For Next.js or React Native, provide your own AuthPlatformProvider.',
        );
    }
    return ctx;
}
