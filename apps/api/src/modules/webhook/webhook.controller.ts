import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from '@/middlewares/async.mdw';
import ErrorResponse from '@/utils/error.util';
import { verifyWebhookSignature } from '../payments/paystack/paystack.service';

/**
 *@name handlePaystack
 @description verifies paystack signature, call the service to handle the webhook and respond immediately which is very important
 @route POST webhook/paystack
 */

export const handlePaystack = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const eventData = req.body;
        const signature = req.headers['x-paystack-signature'];

        // verify paystack signature here (implementation depends on your secret and hashing method)
        // if (!verifyWebhookSignature(signature, eventData)) {
        //     console.log("wrong paystack signature")
        //     return res.sendStatus(400); // Invalid signature
        // }
        const verify = verifyWebhookSignature(signature as string, eventData);
        console.log('Paystack Webhook Signature Verified:', verify);

        console.log('Paystack Webhook Event Received:', eventData);

        // res.sendStatus(200);
    },
);
