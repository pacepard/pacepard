import { Router } from 'express';

const planRoutes = Router({
    mergeParams: true,
});

planRoutes.get('/plans');
