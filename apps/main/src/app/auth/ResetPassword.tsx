import React from 'react';
import ResetPasswordForm from '@/components/blocks/auth/reset-password';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { useNavigate } from 'react-router';

const ResetPassword = () => {
    const navigate = useNavigate();

    return (
        <>
            <AuthLayout
                title="Reset your password"
                // description="Remember your password?"
                maxWidth="sm"
                // buttonLabel="Sign in"
                onButtonClick={() => navigate('/login')}
                showTermsAndPrivacy={false}
            >
                <ResetPasswordForm />
            </AuthLayout>
        </>
    );
};

export default ResetPassword;
