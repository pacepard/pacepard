import { AuthLayout } from '@/components/layouts/auth-layout';
import ActivateUserForm from '@/components/blocks/auth/activate-account';
import { useNavigate } from 'react-router';

const ActivateAccount = () => {
    const navigate = useNavigate();

    return (
        <>
            <AuthLayout
                title="Enter activation code"
                description="We sent a 6-digit code to your email address"
                maxWidth="sm"
                showTermsAndPrivacy={false}
            >
                <ActivateUserForm />
            </AuthLayout>
        </>
    );
};

export default ActivateAccount;
