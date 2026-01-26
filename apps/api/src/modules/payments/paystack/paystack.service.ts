import { Paystack } from 'paystack-sdk';

import crypto from 'crypto';
import {
    CreatePlanDTO,
    initializePaymentDTO,
    verifWebhookDTO,
} from './paystack.interface';
import dotenv from 'dotenv';
import { RequestHandler } from 'express';
import transactionService from '../transaction/transaction.service';
dotenv.config();

const secretKey = process.env.PAYSTACK_SECRET_KEY;

if (!secretKey) {
    throw new Error('Paystack secret key not set');
}

const paystack = new Paystack(secretKey);

/**
 * Initialize a Paystack transaction.
 * Does NOT confirm payment.
 */
export const initializePayment = async (
    dto: initializePaymentDTO,
): Promise<any> => {
    try {
        const response = await paystack.transaction.initialize({
            email: dto.email,
            amount: '1000000',
            plan: dto.plan,
            reference: dto.reference,
            callback_url: dto.callbackUrl,
        });
        return response;
    } catch (err) {
        console.log(err.response.data);
        return err.response.data;
    }
};

/**
 * Verify a Paystack transaction by reference.
 */
export const verifyTransaction = async (reference: string): Promise<any> => {
    try {
        const response = await paystack.transaction.verify(reference);
        return response;
    } catch (err) {
        console.log(err.response.data);
        return err.response.data;
        /// create errror object
    }
};

// Plan

/**
 * Create a Paystack subscription plan.
 */
export const paystackCreatePlan = async (dto: CreatePlanDTO): Promise<any> => {
    try {
        const response = await paystack.plan.create({
            name: dto.name,
            amount: dto.amount,
            interval: dto.interval,
            description: dto.description,
        });

        return response;
    } catch (err) {
        console.log(err.response.data);
        return err.response.data;
    }
};

/**
 * Update a Paystack subscription plan.
 */
export const paystackPlanUpdate = async (
    planCode: string,
    updateData: CreatePlanDTO,
): Promise<any> => {
    try {
        const response = await paystack.plan.update(planCode, updateData);

        return response;
    } catch (error) {}
};

/**
 * Cancel a user subscription on paystack.
 */
export const cancelSubscription = async (
    subscriptionCode: string,
    token: string,
) => {
    try {
        const response = await paystack.subscription.disable({
            code: subscriptionCode,
            token,
        });
        return response;
    } catch (error) {
        console.log(error.response.data);
        return error.response.data;
    }
};

// export const fetchPlan = async () => {};

// Webhooks

/**
 * Verify Paystack webhook signature.
 *
 * IMPORTANT:
 * `payload` MUST be the raw request body (Buffer or string).
 */
export const verifyWebhookSignature = (
    signature: string,
    payload: any,
): boolean => {
    const hash = crypto
        .createHmac('sha512', secretKey)
        .update(JSON.stringify(payload))
        .digest('hex');
    return hash === signature;
};

/**
 * Handle Paystack webhook calling the appropriate service based on event type.
 */
export const handlePaystackWebhook = async (eventData: any): Promise<void> => {
    const eventType = eventData.event;
    switch (eventType) {
        case 'charge.success':
            // handle charge success
            await transactionService.handleWebhook(eventData);

            break;
        case 'subscription.create':
            // handle subscription creation
            break;
        // add more cases as needed
        default:
            console.log(`Unhandled event type: ${eventType}`);
    }
};

/**
 * import express from 'express';

const app = express();

raw body ONLY for Paystack route

// Normal JSON for everything else
app.use(express.json());

// RAW body for Paystack webhook
app.post(
  '/webhooks/paystack',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const signature = req.headers['x-paystack-signature'] as string;
    const rawBody = req.body; // Buffer

    // verify HMAC here
    // crypto.createHmac(...).update(rawBody)

    res.sendStatus(200);
  },
);

 */
