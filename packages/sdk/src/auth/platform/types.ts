import type { ISetLoading, IUnsetLoading } from '@/utils/interfaces';

/** Default path shape for Vite + React Router apps; override per host. */
export type AuthRoutesConfig = {
    login: string;
    dashboard: string;
    home: string;
    /** Path segments that allow unauthenticated access (substring match on pathname). */
    publicAuthSegments: string[];
};

export const defaultAuthRoutes: AuthRoutesConfig = {
    login: '/login',
    dashboard: '/dashboard',
    home: '/',
    publicAuthSegments: [
        '/invite',
        '/register',
        '/verify-otp',
        '/activate-account',
    ],
};

export type PersistAuthPayload = {
    token: string;
    userId: string;
    userType: string;
    email: string;
    businessType?: string;
};

export interface AuthSessionPort {
    checkToken(): boolean;
    checkUserId(): boolean;
    getToken(): string | null | undefined;
    getUserId(): string;
    persistAuth(payload: PersistAuthPayload): void;
    clearSession(): void;
}

export interface AuthNavigationPort {
    getPathname(): string;
    navigate(path: string): void;
    /** Opens the main app shell route (e.g. dashboard) by route name. */
    navigateToMainRoute(routeName: string): void;
    /**
     * Host-specific value for React effect deps when auth should re-run on navigation
     * (e.g. react-router `navigate` function identity).
     */
    effectDependency?: unknown;
}

export interface AuthUserPrefsPort {
    /** Hydrate IUserContext userType / businessType from the host store (e.g. cookies). */
    syncFromCookies(): void;
    /** Update in-memory user type (and optional business type) after login. */
    applyInContext(userType: string, businessType?: string): void;
    clearInContext(): void;
}

export interface AuthUiPort {
    setLoading(data: ISetLoading): void | Promise<void>;
    unsetLoading(data: IUnsetLoading): void | Promise<void>;
    /** Run when session is valid (e.g. expand sidebar route shell). */
    onSessionRestored(): void;
}

export type AuthPlatform = {
    session: AuthSessionPort;
    navigation: AuthNavigationPort;
    userPrefs: AuthUserPrefsPort;
    ui: AuthUiPort;
    routes: AuthRoutesConfig;
};
