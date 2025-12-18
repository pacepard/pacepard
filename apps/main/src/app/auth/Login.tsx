import { AuthLayout } from '@/components/layouts/auth-layout';
import LoginForm from '@/components/blocks/auth/login-form';
import { useNavigate } from 'react-router';


const Login = () => {
    const navigate = useNavigate();

    return (
        <>
            <AuthLayout
                title="Login to Pacepard"
                description="Don't have an account?"
                maxWidth="sm"
                authType="signup"
                buttonLabel="Get started"
                onButtonClick={() => navigate('/register')}
            >
                <LoginForm />
            </AuthLayout>
        </>
    );
};

export default Login;
