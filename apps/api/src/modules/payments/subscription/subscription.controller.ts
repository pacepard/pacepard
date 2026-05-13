import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from '../../../middlewares/async.mdw';
import ErrorResponse from '../../../utils/error.util';
import { IUserDoc } from '../../users/user/user.interface';
import subscriptionService from './subscription.service';
import systemService from '../../internals/system.service';
import subscriptionIntentService from './subscription intent/subscriptionIntent.service';
import {
    CreateSubscriptionIntentDTO,
    ISubscriptionIntentDoc,
    SubscriptionIntentState,
} from './subscription intent/subscriptionIntent.interface';
import userRepository from '@/modules/users/user/user.repository';
import talentService from '@/modules/users/talent/talent.service';
import businessService from '@/modules/users/business/business.service';

/**
 * @name newSubscription
 * @description Subscribe a user to a plan.
 * @route POST /subscriptions
 * @access Private
 */

export const newSubscription: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?._id.toString();
        const user: IUserDoc = (req as any).user;
        const userProfile = (req as any).userProfile;

        // validate dto from request body
        const validationResult = await subscriptionService.validateDto(
            req.body,
        );

        if (validationResult.error) {
            return next(
                new ErrorResponse(
                    validationResult.message || 'Validation Error',
                    400,
                    validationResult.data || [],
                ),
            );
        }

        const { planId, currency, interval } = req.body;

        // create idempotency key

        const idempotencyKey = await systemService.encryptData({
            payload: `${planId}:${currency}:${interval}`,
            password: userId,
            separator: '-',
        });

        // Idempotency first (retry collapsing)

        const subscriptionIntent =
            await subscriptionIntentService.findByKey(idempotencyKey);

        if (subscriptionIntent) {
            const result = await subscriptionService.handleSubscriptionIntent(
                subscriptionIntent,
                userProfile,
            );

            res.status(result.code).json({
                error: result.error,
                message: result.message,
                data: result.data,
            });

            return;
        }

        // User-behaviour handling (Plan switching)

        const activeIntent =
            await subscriptionIntentService.findActiveByUser(userId);

        if (activeIntent) {
            // we compare the plan

            if (samePlan(activeIntent, { planId, currency, interval })) {
                const result =
                    await subscriptionService.handleSubscriptionIntent(
                        activeIntent,
                        userProfile,
                    );
                res.status(result.code).json({
                    error: result.error,
                    message: result.message,
                    data: result.data,
                });

                return;
            }

            // different plan - cancel old intent

            await subscriptionIntentService.cancel(String(activeIntent._id));
        }

        // fresh intent

        const newIntent = await subscriptionIntentService.create({
            idempotencyKey,
            userId,
            planId,
            currency,
            interval,
        });

        if (!newIntent) {
            return next(
                new ErrorResponse(
                    'Failed to start subscription process. Please try again.',
                    500,
                    [],
                ),
            );
        }
        const result = await subscriptionService.handleSubscriptionIntent(
            newIntent,
            userProfile,
        );

        res.status(result.code).json({
            error: result.error,
            message: result.message,
            data: result.data,
        });
        return;
    },
);

/**
 * @name handleCallback
 * @description Handle a redirect to callback url after Payment
 * @route GET /subscriptions/verify
 * @access Private
 */
export const handleCallback: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { reference } = req.query;

        if (!reference) {
            return next(
                new ErrorResponse('Missing Subscription reference', 400, []),
            );
        }

        // find intent by reference
        const intent =
            await subscriptionIntentService.findByTransactionReference(
                String(reference),
            );

        if (!intent) {
            return next(
                new ErrorResponse('Invalid subscription reference', 404, []),
            );
        }

        const userResult = await userRepository.findById(String(intent.userId));
        if (userResult.error || !userResult.data) {
            return next(new ErrorResponse('Could not resolve user', 401, []));
        }

        let userProfile = null;

        if (userResult.data.isTalent) {
            console.log('fetching,user profile');

            const talentProfile = await talentService.getTalentProfile(
                String(intent.userId),
            );

            if (talentProfile.error || !talentProfile.data) {
                return next(
                    new ErrorResponse(
                        talentProfile.message || 'Talent profile not found',
                        talentProfile.code || 404,
                        [],
                    ),
                );
            }
            userProfile = talentProfile.data;
        }

        if (userResult.data.isBusiness) {
            const businessProfile = await businessService.getBusinessProfile(
                String(intent.userId),
            );
            if (businessProfile.error || !businessProfile.data) {
                return next(
                    new ErrorResponse(
                        businessProfile.message || 'Business profile not found',
                        businessProfile.code || 404,
                        [],
                    ),
                );
            }
            userProfile = businessProfile.data;
        }

        const result = await subscriptionService.handleSubscriptionIntent(
            intent,
            userProfile,
        );

        res.status(result.code).json({
            error: result.error,
            message: result.message,
            data: result.data,
        });

        return;
    },
);

/**
 * @name getUserSubscription
 * @description Return the current user's subscription details.
 * @route GET /subscriptions/me
 * @access Private
 */
export const getUserSubscription = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userProfile = (req as any).userProfile;

        const result = await subscriptionService.userSubscription(userProfile);

        res.status(result.code).json({
            error: result.error,
            message: result.message,
            data: result.data,
        });
        return;
    },
);

/**
 * @name cancelUserSubscription
 * @description Cancel the current user's subscription.
 * @route POST /subscriptions/cancel
 * @access Private
 */
export const cancelUserSubscription = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        const user: IUserDoc = (req as any).user;
        const userProfile = (req as any).userProfile;

        const result =
            await subscriptionService.cancelSubscription(userProfile);

        res.status(result.code).json({
            error: result.error,
            message: result.message,
            data: result.data,
        });
    },
);

// Helper functions for controller
const samePlan = (
    intent: ISubscriptionIntentDoc,
    newPlan: { planId: string; currency: string; interval: string },
): boolean => {
    return (
        String(intent.planId) === String(newPlan.planId) &&
        intent.currency === newPlan.currency &&
        intent.interval === newPlan.interval
    );
};
