import useContextType from '@/state/useContextType';
import { useCallback, useEffect, useState } from 'react';
import { pacepardAPIClient } from '@/api/_base/config';
import { useAuthPlatform } from '@/auth/platform/context';

import {
    ActivateDTO,
    ForgotPasswordDTO,
    LoginDTO,
    LogoutDTO,
    RegisterUserDTO,
    ResendOtpDTO,
    ResetPasswordDTO,
    VerifyOtpDTO,
} from '@/dtos/auth.dto';
import { BusinessType, UserType } from '@/utils/enums';
import cookieService from '@/services/cookies';

const useAuth = () => {
    const platform = useAuthPlatform();
    const { session, navigation, userPrefs, ui, routes } = platform;

    const { userContext } = useContextType();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const { users, user, userType, businessType } = userContext;

    useEffect(() => {
        userPrefs.syncFromCookies();
    }, [userPrefs]);

    useEffect(() => {
        const pathname = navigation.getPathname();
        if (!session.checkToken() || !session.checkUserId()) {
            const isPublic = routes.publicAuthSegments.some((seg) =>
                pathname.includes(seg),
            );
            if (isPublic) {
                navigation.navigate(pathname);
            } else {
                pacepardAPIClient().auth.logout();
                navigation.navigate(routes.login);
            }
        } else {
            setIsLoggedIn(true);
            ui.onSessionRestored();

            if (pathname === routes.login || pathname === routes.home) {
                navigation.navigate(routes.dashboard);
            }
        }
    }, [navigation.effectDependency, navigation, routes, session, ui]);

    useEffect(() => {
        userPrefs.syncFromCookies();
    }, [isLoggedIn, userPrefs]);

    const redirect = useCallback(
        (roles: Array<string>) => {
            const pathname = navigation.getPathname();
            if (!session.checkToken() || !session.checkUserId()) {
                pacepardAPIClient().auth.logout();
                navigation.navigate(routes.login);
            } else {
                const ut = cookieService.getUserType();
                const token = session.getToken();

                if (token) {
                    if (ut && !roles.includes(ut)) {
                        navigation.navigate(routes.login);
                        pacepardAPIClient().auth.logout();
                    } else {
                        setIsLoggedIn(true);
                        ui.onSessionRestored();

                        if (
                            pathname === routes.login ||
                            pathname === routes.home
                        ) {
                            navigation.navigateToMainRoute('dashboard');
                        }
                    }
                } else {
                    pacepardAPIClient().auth.logout();
                    navigation.navigate(routes.login);
                }
            }
        },
        [navigation, routes, session, ui],
    );

    const login = async (data: LoginDTO) => {
        const response = await pacepardAPIClient().auth.loginUser(data);

        if (!response.error) {
            if (response.status === 200) {
                if (
                    response.data.userType === UserType.SUPER ||
                    response.data.userType === UserType.ADMIN
                ) {
                    session.persistAuth({
                        token: response.token!,
                        userId: response.data._id,
                        userType: response.data.userType,
                        email: response.data.email,
                    });

                    cookieService.setData({
                        key: 'userType',
                        payload: response.data.userType,
                        expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        path: '/',
                    });

                    setIsLoggedIn(true);
                }

                if (
                    response.data.userType === UserType.BUSINESS &&
                    response.data.businessType === BusinessType.EDUCATION
                ) {
                    session.persistAuth({
                        token: response.token!,
                        userId: response.data._id,
                        userType: response.data.userType,
                        email: response.data.email,
                        businessType: response.data.businessType,
                    });

                    cookieService.setData({
                        key: 'userType',
                        payload: response.data.userType,
                        expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        path: '/',
                    });

                    setIsLoggedIn(true);
                }

                if (response.data.userType === UserType.BUSINESS) {
                    session.persistAuth({
                        token: response.token!,
                        userId: response.data._id,
                        userType: response.data.userType,
                        email: response.data.email,
                        businessType: response.data.businessType,
                    });

                    cookieService.setData({
                        key: 'userType',
                        payload: response.data.userType,
                        expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        path: '/',
                    });

                    cookieService.setData({
                        key: 'businessType',
                        payload: response.data.businessType,
                        expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        path: '/',
                    });

                    userPrefs.applyInContext(
                        response.data.userType,
                        response.data.businessType,
                    );

                    setIsLoggedIn(true);
                }

                if (response.data.userType === UserType.TALENT) {
                    session.persistAuth({
                        token: response.token!,
                        userId: response.data._id,
                        userType: response.data.userType,
                        email: response.data.email,
                    });

                    cookieService.setData({
                        key: 'userType',
                        payload: response.data.userType,
                        expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        path: '/',
                    });

                    userPrefs.applyInContext(response.data.userType);

                    setIsLoggedIn(true);
                }
            }

            if (response.status === 206) {
                void response.status;
            }
        }

        return response;
    };

    const logout = async () => {
        await pacepardAPIClient().auth.logout();
        session.clearSession();
        userPrefs.clearInContext();

        navigation.navigate(routes.login);
        setIsLoggedIn(false);
    };

    const logoutUser = useCallback(
        async (data: LogoutDTO) => {
            void ui.setLoading({ option: 'default' });

            const response = await pacepardAPIClient().auth.logoutUser({
                userId: data.userId || session.getUserId(),
            });
            if (!response.error) {
                setIsLoggedIn(false);
                session.clearSession();
                userPrefs.clearInContext();

                void ui.unsetLoading({
                    option: 'default',
                    message: 'successful',
                });

                navigation.navigate(routes.login);
            }
            return response;
        },
        [navigation, routes, session, ui, userPrefs],
    );

    const register = useCallback(
        async (data: RegisterUserDTO) => {
            void ui.setLoading({ option: 'default' });

            const response = await pacepardAPIClient().auth.registerUser(data);

            if (!response.error) {
                setIsLoggedIn(false);
                void ui.unsetLoading({
                    option: 'default',
                    message: 'successful',
                });
            }

            return response;
        },
        [ui],
    );

    const verifyOtp = useCallback(
        async (data: VerifyOtpDTO) => {
            void ui.setLoading({ option: 'default' });

            const response = await pacepardAPIClient().auth.verifyOTP({
                email: data.email,
                otp: data.otp,
                otpType: data.otpType,
            });
            if (!response.error) {
                setIsLoggedIn(false);
                void ui.unsetLoading({
                    option: 'default',
                    message: 'successful',
                });
            }
            return response;
        },
        [ui],
    );

    const activateAccount = useCallback(
        async (data: ActivateDTO) => {
            void ui.setLoading({ option: 'default' });

            const response = await pacepardAPIClient().auth.activateUser({
                otp: data.otp,
                otpType: data.otpType,
                email: data.email,
            });

            if (!response.error) {
                setIsLoggedIn(false);
                void ui.unsetLoading({
                    option: 'default',
                    message: 'successful',
                });
            }

            return response;
        },
        [ui],
    );

    const resendOtp = useCallback(
        async (data: ResendOtpDTO) => {
            const { email, otpType } = data;
            const response = await pacepardAPIClient().auth.resendOTP({
                email,
                otpType,
            });
            if (!response.error) {
                setIsLoggedIn(false);
                void ui.unsetLoading({ option: 'default', message: 'successful' });
            }

            return response;
        },
        [ui],
    );

    const forgotPassword = useCallback(
        async (data: ForgotPasswordDTO) => {
            void ui.setLoading({ option: 'default' });

            const response = await pacepardAPIClient().auth.forgotPassword({
                email: data.email,
            });

            if (!response.error) {
                setIsLoggedIn(false);
                void ui.unsetLoading({
                    option: 'default',
                    message: 'successful',
                });
            }
            return response;
        },
        [ui],
    );

    const resetPassword = useCallback(
        async (data: ResetPasswordDTO) => {
            const { newPassword, email } = data;

            void ui.setLoading({ option: 'default' });

            const response = await pacepardAPIClient().auth.resetPassword({
                newPassword,
                email,
            });
            if (!response.error) {
                setIsLoggedIn(false);
                void ui.unsetLoading({
                    option: 'default',
                    message: 'successful',
                });
            }
            return response;
        },
        [ui],
    );

    return {
        users,
        user,
        userType,
        businessType,

        redirect,
        login,
        register,
        logout,
        logoutUser,
        activateAccount,
        resendOtp,
        forgotPassword,
        resetPassword,
        verifyOtp,
    };
};

export default useAuth;
