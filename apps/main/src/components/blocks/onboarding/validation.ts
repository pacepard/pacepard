import * as z from 'zod';

export const createWorkspaceSchema = z.object({
    name: z.string().min(1, 'Workspace name is required').trim(),
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceSchema>;

const emailSchema = z.object({
    email: z.string().email('Invalid email address').or(z.literal('')),
});

export const inviteTeammatesSchema = z
    .object({
        emails: z.array(emailSchema).min(1, 'At least one email is required'),
        allowDomainAccess: z.boolean(),
    })
    .refine(
        (data) => {
            // At least one non-empty email is required
            const nonEmptyEmails = data.emails.filter(
                (e) => e.email.trim() !== '',
            );
            return nonEmptyEmails.length > 0;
        },
        {
            message: 'At least one email address is required',
            path: ['emails'],
        },
    );

export type InviteTeammatesFormValues = z.infer<typeof inviteTeammatesSchema>;
