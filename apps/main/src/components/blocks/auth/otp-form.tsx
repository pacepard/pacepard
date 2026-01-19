import { Button } from "@pacepard/ui/components/button";
import { Input } from "@pacepard/ui/components/input";
import { Label } from "@pacepard/ui/components/label";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, VerifyOtpFormValues } from "./validation";
import { toast } from "@pacepard/ui";
import { useNavigate } from "react-router";
import { OtpType, storage } from "@pacepard/sdk";
import { pacepardAPI } from "@/config/pacepard";
import { CircleNotchIcon } from "@phosphor-icons/react";

interface OtpFormProps {
    className?: string;
    email?: string;
    otpType: OtpType;
    successMessage?: string;
    redirectTo?: string;
    onSuccess?: () => void;
    onResend?: () => void;
}

const OtpForm = ({
    className = "",
    email,
    otpType,
    successMessage = "OTP verified successfully",
    redirectTo,
    onSuccess,
    onResend,
    ...props
}: OtpFormProps) => {
    const navigate = useNavigate();
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [resendCountdown, setResendCountdown] = useState(0);

    const {
        handleSubmit,
        setValue,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<VerifyOtpFormValues>({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: { otp: "" },
    });

    const otpValue = watch("otp", "");

    useEffect(() => {
        if (resendCountdown <= 0) return;

        const timer = setInterval(() => {
            setResendCountdown((v) => (v <= 1 ? 0 : v - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [resendCountdown]);

    const cleanEmail = (): string => {
        let e = storage.getUserEmail() as string;
        if (!e) return email || "";
        if (e.startsWith('"') && e.endsWith('"')) {
            try {
                e = JSON.parse(e);
            } catch {
                e = e.replace(/^"(.*)"$/, "$1");
            }
        }
        return e || email || "";
    };

    const handleOtpChange = (index: number, value: string) => {
        const digits = value.replace(/\D/g, "");
        const otpArray = otpValue.padEnd(6, " ").split("");

        if (!digits) {
            otpArray[index] = "";
            const newOtp = otpArray.join("").trim();
            setValue("otp", newOtp);
            return;
        }

        digits.split("").forEach((d, i) => {
            if (index + i < 6) otpArray[index + i] = d;
        });

        const newOtp = otpArray.join("").trim();
        setValue("otp", newOtp);

        const nextIndex = Math.min(index + digits.length, 5);
        otpRefs.current[nextIndex]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);
        
        if (pasted) {
            setValue("otp", pasted);
            const focusIndex = Math.min(pasted.length - 1, 5);
            otpRefs.current[focusIndex]?.focus();
        }
    };

    const onSubmit = async ({ otp }: VerifyOtpFormValues) => {
        try {
            // Use activateUser for account activation, verifyOTP for other OTP types
            const response =
                otpType === OtpType.ACTIVATEACCOUNT
                    ? await pacepardAPI.auth.activateUser({
                          email: cleanEmail(),
                          otp: Number(otp),
                          otpType,
                      })
                    : await pacepardAPI.auth.verifyOTP({
                          email: cleanEmail(),
                          otp: Number(otp),
                          otpType,
                      });

            if (response.error) {
                // Use React Hook Form's setError for server errors (inline, not toast)
                setError('otp', {
                    type: 'server',
                    message: response.message || response.data || "Invalid OTP. Please try again.",
                });
            } else {
                // Navigate first, then show optional success toast
                onSuccess?.();
                if (redirectTo) {
                    navigate(redirectTo);
                }
                // Optional: Show success toast after navigation (non-blocking, informational)
                toast.success(successMessage);
            }
        } catch (error) {
            // Use React Hook Form's setError for unexpected errors
            setError('otp', {
                type: 'server',
                message: "An error occurred during OTP verification. Please try again.",
            });
            console.error("OTP verification error:", error);
        }
    };

    const handleResend = async () => {
        setValue("otp", "");
        setResendCountdown(60);
        otpRefs.current[0]?.focus();

        try {
            const response = await pacepardAPI.auth.resendOTP({
                email: cleanEmail(),
                otpType,
            });

            if (response.error) {
                // Use React Hook Form's setError for resend failures (inline, not toast)
                setError('root', {
                    type: 'server',
                    message: response.message || response.data || "Failed to resend OTP. Please try again.",
                });
            } else {
                // Toast for resend success - non-blocking, informational
                toast.success("OTP resent successfully");
            }
        } catch (error) {
            // Use React Hook Form's setError for unexpected errors
            setError('root', {
                type: 'server',
                message: "An error occurred while resending OTP. Please try again.",
            });
            console.error("Resend OTP error:", error);
        }

        onResend?.();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={`flex flex-col gap-6 p-6 ${className}`}
            {...props}
        >
            <div className="space-y-4">
                {email && (
                    <div className="text-center text-sm text-muted-foreground">
                        <p>We sent a verification code to</p>
                        <p className="font-medium text-foreground">{email}</p>
                    </div>
                )}

                <div className="space-y-2">
                    <Label>Verification Code</Label>
                    <div className="flex gap-2 justify-center">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Input
                                key={index}
                                // @ts-ignore - ref assignment for OTP inputs
                                ref={(el) => (otpRefs.current[index] = el)}
                                inputMode="numeric"
                                maxLength={1}
                                value={otpValue[index] || ""}
                                onChange={(e) =>
                                    handleOtpChange(index, e.target.value)
                                }
                                onPaste={index === 0 ? handlePaste : undefined}
                                onFocus={(e) => e.currentTarget.select()}
                                className={`w-12 h-12 text-center text-lg font-semibold ${
                                    errors.otp ? "border-destructive" : ""
                                }`}
                                aria-invalid={!!errors.otp}
                            />
                        ))}
                    </div>

                    {errors.otp && (
                        <p className="text-sm text-destructive text-center">
                            {errors.otp.message}
                        </p>
                    )}
                    {/* Server error from React Hook Form (inline, not toast) */}
                    {errors.root && (
                        <p className="text-sm text-destructive text-center">
                            {errors.root.message}
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
                            disabled={isSubmitting}
                            className="text-primary underline hover:no-underline"
                        >
                            Resend code
                        </button>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 justify-center items-center gap-2"
                >
                    {isSubmitting && (
                        <CircleNotchIcon className="h-4 w-4 animate-spin" />
                    )}
                    {isSubmitting ? "Verifying..." : "Verify code"}
                </Button>
            </div>
        </form>
    );
};

export default OtpForm;
