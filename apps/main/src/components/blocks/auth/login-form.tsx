// src/components/shared/auth/register-form.tsx
import { Button } from '@pacepard/ui/components/button';
import { Input } from '@pacepard/ui/components/input';
import { Label } from '@pacepard/ui/components/label';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from './validation';
import zxcvbn from 'zxcvbn';
import {
    Loader2,
    Mail,
    Eye,
    EyeOff,
    Lock,
} from 'lucide-react';
import { strengthColors } from '@/utils/helpers';
import { OAuthButtons } from './oauth-buttons';
import { PacepardAPI } from '@/config/pacepard';
import { toast } from '@pacepard/ui';
import { useNavigate } from 'react-router';


const LoginForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordScore, setPasswordScore] = useState(0);
    const [feedback, setFeedback] = useState<string[]>([]);

    const {
        register: formRegister,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { email: '', password: '' },
    });

    const passwordValue = watch('password', '');

    useEffect(() => {
        if (!passwordValue) {
            setPasswordScore(0);
            setFeedback([]);
            return;
        }

        const result = zxcvbn(passwordValue);
        setPasswordScore(result.score);
        setFeedback(result.feedback.suggestions);
    }, [passwordValue]);

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            const response = await PacepardAPI.auth.loginUser({
                email: data.email,
                password: data.password,
            });
            
            if (response.error) {
                // Use React Hook Form's setError for server errors (inline, not toast)
                setError('root', {
                    type: 'server',
                    message: response.message || response.data?.message || 'Invalid email or password',
                });
            } else {
                // Navigate first, then show optional success toast
                navigate('/dashboard');
                // Optional: Show success toast after navigation (non-blocking, informational)
                toast.success('Login successful!');
            }
        } catch (error) {
            // Use React Hook Form's setError for unexpected errors
            setError('root', {
                type: 'server',
                message: 'An unexpected error occurred. Please try again.',
            });
            console.error('Login error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="space-y-4">
                {/* Email */}
                <div className="flex flex-col gap-2 space-y-1">
                    <Label htmlFor="email">Enter your email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="yourname@email.com"
                            className="pl-9 h-11 ring-foreground/15 border-transparent ring-1"
                            {...formRegister('email')}
                            aria-invalid={!!errors.email}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-sm text-destructive">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2 space-y-1">
                    <div className="flex items-center">
                        <Label htmlFor="password">Enter your password</Label>
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </button>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="create a password"
                            className="pl-9 pr-10 h-11 ring-foreground/15 border-transparent ring-1"
                            {...formRegister('password')}
                            aria-invalid={!!errors.password}
                        />

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword((v) => !v)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                        </Button>
                    </div>

                    {errors.password && (
                        <p className="text-sm text-destructive">
                            {errors.password.message}
                        </p>
                    )}

                    {/* Server error from React Hook Form (inline, not toast) */}
                    {errors.root && (
                        <p className="text-sm text-destructive mt-1">
                            {errors.root.message}
                        </p>
                    )}

                    {/* Password strength bar */}
                    {passwordValue && (
                        <>
                            <div className="mt-1 h-2 w-full rounded bg-gray-200">
                                <div
                                    className={`h-2 rounded ${strengthColors[passwordScore]}`}
                                    style={{
                                        width: `${((passwordScore + 1) / 5) * 100}%`,
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    className="w-full h-11 justify-center items-center gap-2"
                    disabled={isSubmitting}
                    type="submit"
                >
                    {isSubmitting && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {isSubmitting ? 'Signing in...' : 'Continue'}
                </Button>
            </div>

            {/* OAuth Buttons and separator on Top */}
            <div className="grid gap-4">
                <OAuthButtons formType="register" />
            </div>
        </form>
    );
};

export default LoginForm;
