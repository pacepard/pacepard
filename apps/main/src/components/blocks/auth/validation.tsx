import * as z from 'zod';

// Base schemas - strict rules, minimal messages
const emailSchema = z.string().email();

const strongPasswordSchema = z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character');

const otpSchema = z.string().length(6).regex(/^\d+$/);

// Composite schemas
export const registerSchema = z.object({
    email: emailSchema,
    password: strongPasswordSchema,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const verifyOtpSchema = z.object({
    otp: otpSchema,
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
    .object({
        newPassword: strongPasswordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
