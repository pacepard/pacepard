import * as z from "zod";

export const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 8 characters"),
  });
  
  export type RegisterFormValues = z.infer<typeof registerSchema>;