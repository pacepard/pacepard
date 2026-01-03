// src/components/shared/auth/register-form.tsx
import { Button } from '@pacepard/ui/components/button';
import { Input } from '@pacepard/ui/components/input';
import { Label } from '@pacepard/ui/components/label';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VerifyOtpFormValues, verifyOtpSchema } from './validation';
import { CircleNotchIcon } from '@phosphor-icons/react';
import { OAuthButtons } from './oauth-buttons';
import { OtpType, storage } from '@pacepard/sdk';
import { pacepardAPI } from '@/config/pacepard';

export interface IForm extends React.ComponentProps<'form'> {
    className?: string;
    email?: string;
    onStepChange?: (step: 'email' | 'otp' | 'success') => void;
    onSuccess?: () => void;
    onResend?: () => void;
}

const ActivateUserForm = (data: IForm) => {
    const { className, email, onSuccess, onResend, ...props } = data;
    //const { ActivateUser } = useAuth();
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [resendCountdown, setResendCountdown] = useState(0);

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<VerifyOtpFormValues>({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: { otp: '' },
    });

    const otpValue = watch('otp');

    useEffect(() => {
        if (resendCountdown <= 0) return;

        const timer = setInterval(() => {
            setResendCountdown((v) => (v <= 1 ? 0 : v - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [resendCountdown]);

    const maskEmail = (value?: string) => {
        if (!value) return '';
        const parts = value.split('@');
        if (parts.length !== 2) return value;
        const [local, domain] = parts;
        if (!local || local.length <= 2) return value;
        return `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
    };

    const handleOtpChange = (index: number, value: string) => {
        const digits = value.replace(/\D/g, '');
        const otpArray = otpValue.padEnd(6).split('');

        if (!digits) {
            otpArray[index] = '';
            setValue('otp', otpArray.join(''));
            return;
        }

        digits.split('').forEach((d, i) => {
            if (index + i < 6) otpArray[index + i] = d;
        });

        setValue('otp', otpArray.join(''));

        const nextIndex = Math.min(index + digits.length, 5);
        otpRefs.current[nextIndex]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 6);
        setValue('otp', pasted);
        otpRefs.current[Math.min(pasted.length - 1, 5)]?.focus();
    };

    const onSubmit = async ({ otp }: VerifyOtpFormValues) => {
        let cleanEmail = storage.getUserEmail() as string;

        if (cleanEmail?.startsWith('"')) {
            try {
                cleanEmail = JSON.parse(cleanEmail);
            } catch {
                cleanEmail = cleanEmail.replace(/^"(.*)"$/, '$1');
            }
        }

        await pacepardAPI.auth.activateUser({
            email: cleanEmail,
            otp: Number(otp),
            otpType: OtpType.ACTIVATEACCOUNT,
        });
    };

    const handleResend = () => {
        setValue('otp', '');
        setResendCountdown(60);
        otpRefs.current[0]?.focus();
        onResend?.();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="space-y-4">
                {email && (
                    <div className="text-center text-sm text-muted-foreground">
                        <p>We sent a verification code to</p>
                        <p className="font-medium text-foreground">
                            {maskEmail(email)}
                        </p>
                    </div>
                )}

                <div className="space-y-2">
                    <Label>Verification code</Label>

                    <div className="flex justify-center gap-2">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Input
                                key={index}
                                ref={(el) => { otpRefs.current[index] = el; }}
                                inputMode="numeric"
                                maxLength={1}
                                value={otpValue[index] || ''}
                                onChange={(e) =>
                                    handleOtpChange(index, e.target.value)
                                }
                                onPaste={index === 0 ? handlePaste : undefined}
                                onFocus={(e) => e.currentTarget.select()}
                                className="h-12 w-12 text-center text-lg font-semibold"
                                aria-invalid={!!errors.otp}
                            />
                        ))}
                    </div>

                    {errors.otp && (
                        <p className="text-sm text-destructive text-center">
                            {errors.otp.message}
                        </p>
                    )}
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    {resendCountdown > 0 ? (
                        <span>Resend in {resendCountdown}s</span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            className="underline underline-offset-4"
                        >
                            Resend code
                        </button>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    className="w-full h-11 justify-center items-center gap-2"
                    disabled={isSubmitting}
                    type="submit"
                >
                    {isSubmitting && (
                        <CircleNotchIcon className="h-4 w-4 animate-spin" />
                    )}
                    {isSubmitting ? 'Verifying code...' : 'Verify code'}
                </Button>
            </div>
        </form>
    );
};

export default ActivateUserForm;
