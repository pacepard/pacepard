import { Router } from 'express';
import Protect from '../../middlewares/checkAuth.mdw';
import {
    getBusiness,
    getBusinesses,
    updateBusiness,
    updateTags,
    addTag,
    removeTag,
} from './business.controller';

const businessRoutes = Router({ mergeParams: true });

// Business profile routes
businessRoutes.get('/', Protect, getBusiness);
businessRoutes.get('/list', Protect, getBusinesses);
businessRoutes.put('/', Protect, updateBusiness);

// Business tags routes
businessRoutes.put('/tags', Protect, updateTags);
businessRoutes.post('/tags', Protect, addTag);
businessRoutes.delete('/tags/:tag', Protect, removeTag);

export default businessRoutes;
