import * as React from 'react';

import cookieService from '@/services/cookies';
import storage from '@/storage/local-storage';
import useContextType from '@/state/useContextType';
import useGoTo from '@/hooks/shared/useGoTo';
import type { IUserContext } from '@/state/helpers/interface';

import { AuthPlatformProvider } from './context';
import type { AuthPlatform, AuthRoutesConfig } from './types';
import { defaultAuthRoutes } from './types';

export type WebAuthPlatformSetterRef = {
    routes: AuthRoutesConfig;
    /** react-router `navigate` (or equivalent) for effect dependencies. */
    navigate: unknown;
    goTo: (url: string) => void;
    getPathname: () => string;
    toMainRoute: (e: unknown, name: string) => void;
    setUserType: IUserContext['setUserType'];
    setBusinessType: IUserContext['setBusinessType'];
    setLoading: IUserContext['setLoading'];
    unsetLoading: IUserContext['unsetLoading'];
    currentSidebar: IUserContext['currentSidebar'];
};

function clearCookieSession(): void {
    storage.clearAuth();
    const keys = [
        'userType',
        'token',
        'userID',
        'userId',
        'email',
        'businessType',
    ] as const;
    for (const key of keys) {
        cookieService.removeData({ key });
    }
}

function buildPlatformFromRef(
    ref: React.MutableRefObject<WebAuthPlatformSetterRef>,
): AuthPlatform {
    const routes = () => ref.current.routes;

    const session: AuthPlatform['session'] = {
        checkToken: () => storage.checkToken(),
        checkUserId: () => storage.checkUserID(),
        getToken: () => storage.getToken(),
        getUserId: () => storage.getUserID(),
        persistAuth: (payload) => {
            storage.storeAuth(
                payload.token,
                payload.userId,
                payload.userType,
                payload.email,
                payload.businessType,
            );
        },
        clearSession: () => {
            clearCookieSession();
        },
    };

    const navigation: AuthPlatform['navigation'] = {
        getPathname: () => ref.current.getPathname(),
        navigate: (path) => ref.current.goTo(path),
        navigateToMainRoute: (name) => ref.current.toMainRoute(null, name),
        get effectDependency() {
            return ref.current.navigate;
        },
    };

    const userPrefs: AuthPlatform['userPrefs'] = {
        syncFromCookies: () => {
            const ut = cookieService.getUserType();
            const bt = cookieService.getBusinessType();
            ref.current.setUserType(ut ? ut : '');
            ref.current.setBusinessType(bt ? bt : '');
        },
        applyInContext: (userType, businessType) => {
            ref.current.setUserType(userType);
            if (businessType !== undefined) {
                ref.current.setBusinessType(businessType);
            }
        },
        clearInContext: () => {
            ref.current.setUserType('');
            ref.current.setBusinessType('');
        },
    };

    const ui: AuthPlatform['ui'] = {
        setLoading: (data) => void ref.current.setLoading(data),
        unsetLoading: (data) => void ref.current.unsetLoading(data),
        onSessionRestored: () => {
            ref.current.currentSidebar(false);
        },
    };

    return {
        session,
        navigation,
        userPrefs,
        ui,
        get routes() {
            return routes();
        },
    };
}

/**
 * Injects the default web AuthPlatform using existing UserContext + useGoTo.
 * Place inside UserContext.Provider (see UserState). Setter refs stay fresh each render
 * without recreating the platform object identity (avoids auth bootstrap effect loops).
 */
export function WebAuthPlatformBridge({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userContext } = useContextType();
    const { goTo, location, toMainRoute, navigate } = useGoTo();

    const {
        setUserType,
        setBusinessType,
        setLoading,
        unsetLoading,
        currentSidebar,
    } = userContext;

    const setterRef = React.useRef<WebAuthPlatformSetterRef>({
        routes: defaultAuthRoutes,
        navigate,
        goTo,
        getPathname: () => location.pathname,
        toMainRoute,
        setUserType,
        setBusinessType,
        setLoading,
        unsetLoading,
        currentSidebar,
    });

    setterRef.current = {
        routes: defaultAuthRoutes,
        navigate,
        goTo,
        getPathname: () => location.pathname,
        toMainRoute,
        setUserType,
        setBusinessType,
        setLoading,
        unsetLoading,
        currentSidebar,
    };

    const platform = React.useMemo(
        () => buildPlatformFromRef(setterRef),
        // eslint-disable-next-line react-hooks/exhaustive-deps -- ref holds latest setters; identity must stay stable
        [],
    );

    return (
        <AuthPlatformProvider value={platform}>{children}</AuthPlatformProvider>
    );
}

/**
 * Build a web AuthPlatform backed by a ref you keep in sync (e.g. Next.js custom provider).
 * Prefer {@link WebAuthPlatformBridge} when using {@link UserState}.
 */
export function createWebAuthPlatform(
    deps: WebAuthPlatformSetterRef,
): AuthPlatform {
    const ref: React.MutableRefObject<WebAuthPlatformSetterRef> = {
        current: deps,
    };
    return buildPlatformFromRef(ref);
}
