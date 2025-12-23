import * as z from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 8 characters'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const verifyOtpSchema = z.object({
    otp: z
        .string()
        .min(6, 'Enter all 6 digits')
        .max(6, 'Enter all 6 digits')
        .regex(/^\d+$/, 'OTP must be numeric'),
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
