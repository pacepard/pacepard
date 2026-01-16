import { Router } from 'express';
import Protect from '../../../middlewares/checkAuth.mdw';
import { newSubscription } from './subscription.controller';
import Protect from '../../middlewares/checkAuth.mdw';
import {
    getUserSubscription,
    handleCallback,
    newSubscription,
} from './subscription.controller';

const subscriptionRoutes: Router = Router({
    mergeParams: true,
});

subscriptionRoutes.get('/me', Protect, getUserSubscription);
subscriptionRoutes.post('/', Protect, newSubscription);
subscriptionRoutes.get('/verify', handleCallback);
subscriptionRoutes.post('/cancel', Protect);

export default subscriptionRoutes;
