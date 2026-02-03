import { AuthLayout } from '@/components/layouts/auth-layout';
import OtpForm from '@/components/blocks/auth/otp-form';
import { OtpType, storage } from '@pacepard/sdk';

const Verification = () => {
    const email = storage.getUserEmail() as string;

    return (
        <>
            <AuthLayout
                title="Enter activation code"
                description="We sent a 6-digit code to your email address"
                maxWidth="sm"
                showTermsAndPrivacy={false}
            >
                <OtpForm
                    email={email}
                    otpType={OtpType.ACTIVATEACCOUNT}
                    successMessage="Account activated successfully!"
                    redirectTo="/onboarding"
                />
            </AuthLayout>
        </>
    );
};

export default Verification;
