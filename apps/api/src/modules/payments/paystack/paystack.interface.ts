export interface initializePaymentDTO {
    email: string;
    amount?: string; // kobo
    plan?: string;
    currency: string;
    reference: string;
    metadata?: Record<string, any>;
    callbackUrl?: string;
}

export interface CreatePlanDTO {
    name: string;
    amount: number; // kobo
    interval: string; // daily, weekly, monthly, etc
    description: string;
    currency?: string;
}

export interface verifWebhookDTO {
    signature: string;
    paystackSecret: string;
    payload: string | Buffer;
}
