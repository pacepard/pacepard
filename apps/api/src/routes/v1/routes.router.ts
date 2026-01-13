import express, { Request, Response, NextFunction, Router } from 'express';
import authRoutes from '../../modules/auth/auth.router';
import userRoutes from '../../modules/user/user.router';
import businessRoutes from '../../modules/business/business.router';
import talentRoutes from '../../modules/talents/talent.router';
import workspaceRoutes from '../../modules/workspace/workspace.router';
import roleRoutes from '../../modules/role/role.router';
import previewRoutes from '../../views/preview/preview.router';
import { ENVType } from '@/utils/enums.util';
import ENV from '@/utils/env.util';

const router: Router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/business', businessRoutes);
router.use('/talent', talentRoutes);
router.use('/workspace', workspaceRoutes);
router.use('/roles', roleRoutes);
router.use('/preview', previewRoutes); // This is used to preview the email templates
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
