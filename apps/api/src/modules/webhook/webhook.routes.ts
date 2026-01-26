import { Router } from 'express';
import { handlePaystack } from './webhook.controller';

const webhookRoutes: Router = Router({
    mergeParams: true,
});

webhookRoutes.post('/paystack', handlePaystack);

export default webhookRoutes;
