import Paystack from 'paystack-sdk';
import crypto from 'crypto';
import {
    CreatePlanDTO,
    initializePaymentDTO,
    verifWebhookDTO,
} from './paystack.interface';
import dotenv from 'dotenv';
dotenv.config();

const paystackTestKey =
    process.env.PAYSTACK_SECRET_KEY ||
    'sk_test_278d03426302859dff63192ce4929043909c4a4a';

const paystack = new Paystack(paystackTestKey);
console.log(paystack);

export const initializePayment = async (dto: initializePaymentDTO) => {
    try {
        const response = await paystack.transaction.initialize({
            email: dto.email,
            amount: dto.amount,
            plan: dto.plan,
            callback_url: dto.callback_url,
        });
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const verifyTransaction = async (reference: string) => {
    try {
        const response = await paystack.transaction.verify(reference);
        return response;
    } catch (err) {
        console.log(err);
    }
};

// Plan

export const paystackCreatePlan = async (dto: CreatePlanDTO) => {
    try {
        const response = await paystack.plan.create({
            name: dto.name,
            amount: dto.amount,
            interval: dto.interval,
            description: dto.description,
        });

        return response;
    } catch (err) {
        console.log(err);
    }
};

// export const fetchPlan = async () => {};

// Webhooks
export const verifyWebhookSignature = async (
    dto: verifWebhookDTO,
): Promise<boolean> => {
    const { paystackSecret, signature, payload } = dto;
    try {
        const hash = crypto
            .createHmac('sha512', paystackSecret)
            .update(JSON.stringify(payload))
            .digest('hex');
        return hash === signature;
    } catch (err) {
        console.log(err);
        return false;
    }
};
