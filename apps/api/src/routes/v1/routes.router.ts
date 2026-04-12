import express, { Request, Response, NextFunction, Router } from 'express';
import authRoutes from '../../modules/authentication/auth/auth.router';
import userRoutes from '../../modules/users/user/user.router';
import businessRoutes from '../../modules/users/business/business.router';
import talentRoutes from '../../modules/users/talent/talent.router';
import adminRoutes from '../../modules/users/admin/admin.route';
import guestRoutes from '../../modules/users/guest/guest.router';
import workspaceRoutes from '../../modules/core/workspace/workspace.router';
import storageRoutes from '../../modules/platform/storage/storage.router';
import roleRoutes from '../../modules/authentication/role/role.router';
import previewRoutes from '../../views/preview/preview.router';
import hackathonRoutes from '../../modules/hackathons/hackathon/hackathon.router';
import entryRoutes from '../../modules/hackathons/entry/entry.router';
import squadRoutes from '../../modules/hackathons/squad/squad.router';
import submissionRoutes from '../../modules/hackathons/submission/submission.router';
import { ENVType } from '@/utils/enums.util';
import ENV from '@/utils/env.util';

const router: Router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/business', businessRoutes);
router.use('/talent', talentRoutes);
router.use('/admin', adminRoutes);
router.use('/guests', guestRoutes);
router.use('/workspace', workspaceRoutes);
router.use('/storage', storageRoutes);
router.use('/roles', roleRoutes);
router.use('/preview', previewRoutes); // This is used to preview the email templates
router.use('/hackathons', hackathonRoutes);
router.use('/entries', entryRoutes);
router.use('/squads', squadRoutes);
router.use('/submissions', submissionRoutes);
// Add new routes

router.get('/me', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        error: false,
        errors: [],
        data: {
            name: 'Pacepard API',
            version: '1.00.00',
        },
        message: 'Pacepard api v1.0.0 is healthy',
        status: 200,
    });
});

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    let enviornemnt = ENVType.DEVELOPMENT;

    if (ENV.isProduction()) {
        enviornemnt = ENVType.PRODUCTION;
    } else if (ENV.isStaging()) {
        enviornemnt = ENVType.STAGING;
    } else if (ENV.isDevelopment()) {
        enviornemnt = ENVType.DEVELOPMENT;
    }

    res.status(200).render('health-check', {
        error: false,
        errors: [],
        data: {
            name: 'Pacepard API',
            version: '01.00.00',
        },
        message: `pacepard-api is running in ${enviornemnt} mode`,
        status: 200,
    });
});

export default router;
