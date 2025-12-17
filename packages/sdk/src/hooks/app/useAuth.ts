import cookieService from '@/services/cookies';
import useContextType from '@/state/useContextType';
import storage from '@/storage/local-storage';
import { useCallback, useEffect, useState } from 'react';
import useGoTo from '../shared/useGoTo';
import PacepardAPI from '@/api/clients/pacepard';
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

const useAuth = () => {
    const { userContext } = useContextType();
    const { goTo, location, navigate, toMainRoute } = useGoTo();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const {
        users,
        user,
        userType,
        businessType,
        setUserType,
        setBusinessType,
        currentSidebar,
        setLoading,
        unsetLoading,
    } = userContext;

    useEffect(() => {
        let ut = cookieService.getUserType();
        let bt = cookieService.getBusinessType();
        setUserType(ut ? ut : '');
        setBusinessType(bt ? bt : '');
    }, []);

    useEffect(() => {
        if (!storage.checkToken() || !storage.checkUserID()) {
            if (
                location.pathname.includes('/invite') ||
                location.pathname.includes('/register') ||
                location.pathname.includes('/verify')
            ) {
                goTo(location.pathname);
            } else {
                PacepardAPI.auth.logout();
                goTo('/login');
            }
        } else {
            setIsLoggedIn(true);
            currentSidebar(false);

            if (
                location.pathname === '/login' ||
                location.pathname === '/home' ||
                location.pathname === '/'
            ) {
                goTo('/dashboard');
            }
        }
    }, [navigate]);

    useEffect(() => {
        let ut = cookieService.getUserType();
        let bt = cookieService.getBusinessType();
        setUserType(ut ? ut : '');
        setBusinessType(bt ? bt : '');
    }, [isLoggedIn]);


    const redirect = useCallback( (roles: Array<string>) => {

        if (!storage.checkToken() || !storage.checkUserID()) {
            PacepardAPI.auth.logout();
            goTo('/login');
        } else {
            const userType = cookieService.getUserType();
            //const businessType = cookieService.getBusinessType();
            const token = storage.getToken();
            

            if (token) {
                if (userType && !roles.includes(userType)) {
                    goTo('/login');
                    PacepardAPI.auth.logout();
                } else {
                    setIsLoggedIn(true);
                    currentSidebar(false); // set sidebar

                    if (
                        location.pathname === '/login' ||
                        location.pathname === '/home' ||
                        location.pathname === '/'
                    ) {
                        toMainRoute(null, 'dashboard');
                    }
                }
            } else {
                PacepardAPI.auth.logout();
                goTo('/login');
            }
        }
    }, [navigate])

    const login = async (data: LoginDTO) => {
        const response = await PacepardAPI.auth.loginUser(data);

        if (!response.error) {
            if (response.status === 200) {
                if (
                    response.data.userType === UserType.SUPER ||
                    response.data.userType === UserType.ADMIN
                ) {
                    // store auth credentials
                    storage.storeAuth(
                        response.token!,
                        response.data._id,
                        response.data.userType,
                        response.data.email,

                    );

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
                    // store auth credentials
                    storage.storeAuth(
                        response.token!,
                        response.data._id,
                        response.data.userType,
                        response.data.email,
                        response.data.businessType,
                    );

                    cookieService.setData({
                        key: 'userType',
                        payload: response.data.userType,
                        expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        path: '/',
                    });

                    setIsLoggedIn(true);
                }

                if (response.data.userType === UserType.BUSINESS) {
                    // store auth credentials
                    storage.storeAuth(
                        response.token!,
                        response.data._id,
                        response.data.userType,
                        response.data.email,
                        response.data.businessType,
                    );

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
                    
                    setUserType(response.data.userType);
                    setBusinessType(response.data.businessType);

                    setIsLoggedIn(true);
                }

                
                if (response.data.userType === UserType.TALENT) {
                    // store auth credentials
                    storage.storeAuth(
                        response.token!,
                        response.data._id,
                        response.data.userType,
                        response.data.email,
                    );

                    cookieService.setData({
                        key: 'userType',
                        payload: response.data.userType,
                        expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                        path: '/',
                    });
                    
                    setUserType(response.data.userType);

                    setIsLoggedIn(true);
                }
            }

            if (response.status === 206) {
            }
        }

        return response;
    };

    const logout = async () => {
        await PacepardAPI.auth.logout();
        storage.clearAuth();
        cookieService.removeData({ key: 'userType' });
        cookieService.removeData({ key: 'token' });
        cookieService.removeData({ key: 'userID' });
        cookieService.removeData({ key: 'email' });
        cookieService.removeData({ key: 'userType' });
        cookieService.removeData({ key: 'businessType' });

        setUserType('');
        setBusinessType(''); 

        goTo('/login');
        setIsLoggedIn(false);

    };

    const logoutUser = useCallback(
        async (data: LogoutDTO) => {
            setLoading({ option: 'default' });

            const response = await PacepardAPI.auth.logoutUser({
                userId: data.userId || storage.getUserID(),
            });
            if (!response.error) {
                setIsLoggedIn(false);
                storage.clearAuth();
                cookieService.removeData({ key: 'userType' });
                cookieService.removeData({ key: 'token' });
                cookieService.removeData({ key: 'userID' });
                cookieService.removeData({ key: 'email' });
                cookieService.removeData({ key: 'userType' });
                cookieService.removeData({ key: 'businessType' });

                setUserType('');
                setBusinessType('');

                unsetLoading({ option: 'default', message: 'successful' });

                goTo('/login');
            }
            return response;
        },
        [setLoading],
    );

    const register = useCallback(
        async (data: RegisterUserDTO) => {
            setLoading({ option: 'default' });

            const response = await PacepardAPI.auth.registerUser(data);

            if (!response.error) {
                setIsLoggedIn(false);
                unsetLoading({
                    option: 'default',
                    message: 'successful',
                });
            }

            return response;
        },
        [setLoading],
    );

    const verifyOtp = useCallback(
        async (data: VerifyOtpDTO) => {
            setLoading({ option: 'default' });

            const response = await PacepardAPI.auth.verifyOTP({
                email: data.email,
                otp: data.otp,
                otpType: data.otpType,
            });
            if (!response.error) {
                setIsLoggedIn(false);
                unsetLoading({ option: 'default', message: 'successful' });
            }
            return response;
        },
        [setLoading],
    );

    const activateAccount = useCallback(
        async (data: ActivateDTO) => {
            setLoading({ option: 'default' });

            const response = await PacepardAPI.auth.activateUser({
                otp: data.otp,
                otpType: data.otpType,
                email: data.email,
            });

            if (!response.error) {
                setIsLoggedIn(false);
                unsetLoading({
                    option: 'default',
                    message: 'successful',
                });
            }

            return response;
        },
        [setLoading],
    );

    const resendOtp = useCallback(
        async (data: ResendOtpDTO) => {
            const { email, otpType } = data;
            const response = await PacepardAPI.auth.resendOTP({
                email,
                otpType,
            });
            if (!response.error) {
                setIsLoggedIn(false);
                unsetLoading({ option: 'default', message: 'successful' });
            }

            return response;
        },
        [setLoading],
    );

    const forgotPassword = useCallback(
        async (data: ForgotPasswordDTO) => {
            setLoading({ option: 'default' });

            const response = await PacepardAPI.auth.forgotPassword({
                email: data.email,
            });

            if (!response.error) {
                setIsLoggedIn(false);
                unsetLoading({ option: 'default', message: 'successful' });
            }
            return response;
        },
        [setLoading],
    );

    const resetPassword = useCallback(
        async (data: ResetPasswordDTO) => {
            const { newPassword, email } = data;

            setLoading({ option: 'default' });

            const response = await PacepardAPI.auth.resetPassword({
                newPassword,
                email,
            });
            if (!response.error) {
                setIsLoggedIn(false);
                unsetLoading({ option: 'default', message: 'successful' });
            }
            return response;
        },
        [setLoading],
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
