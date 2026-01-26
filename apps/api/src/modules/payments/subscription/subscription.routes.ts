import { Request, Response, NextFunction, Router } from 'express';
import Protect from '../../../middlewares/checkAuth.mdw';
import {
    cancelUserSubscription,
    getUserSubscription,
    handleCallback,
    newSubscription,
} from './subscription.controller';
import asyncHandler from '@/middlewares/async.mdw';
import { IUserDoc } from '@/modules/users/user/user.interface';
import ErrorResponse from '@/utils/error.util';
import talentService from '@/modules/users/talent/talent.service';
import businessService from '@/modules/users/business/business.service';

const subscriptionRoutes: Router = Router({
    mergeParams: true,
});

// middleware to add userProfile to req object
const addUserProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        const user: IUserDoc = (req as any).user;

        if (!userId) {
            return next(new ErrorResponse('Unauthorized', 401, []));
        }

        // Here we get the user profile if business or talent

        let userProfile = null;

        if (user.isTalent) {
            const talentProfile = await talentService.getTalentProfile(
                String(userId),
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

        if (user.isBusiness) {
            const businessProfile = await businessService.getBusinessProfile(
                String(userId),
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

        req.userProfile = userProfile;
        return next();
    },
);

subscriptionRoutes.get('/me', Protect, addUserProfile, getUserSubscription);
subscriptionRoutes.post('/', Protect, addUserProfile, newSubscription);
subscriptionRoutes.get('/verify', handleCallback);
subscriptionRoutes.post(
    '/cancel',
    Protect,
    addUserProfile,
    cancelUserSubscription,
);

export default subscriptionRoutes;
