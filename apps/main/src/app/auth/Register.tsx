import { AuthLayout } from '@/components/layouts/auth-layout';
import RegisterForm from '@/components/blocks/auth/register-form';
import useLocationDetection from '@/hooks/useLocationDetection';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Register = () => {
    const { detectUserLocation } = useLocationDetection();

    useEffect(() => {
        // Auto-detect location on registration page load
        detectUserLocation();
    }, [detectUserLocation]);

    const navigate = useNavigate();

    return (
        <>
            <AuthLayout
                title="Get Started with Pacepard"
                description="Already have an account?"
                maxWidth="sm"
                buttonLabel="Sign in"
                onButtonClick={() => navigate('/login')}
            >
                <RegisterForm />
            </AuthLayout>
        </>
    );
};

export default Register;
