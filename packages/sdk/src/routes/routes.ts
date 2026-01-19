import footer from './footer.route'
import appRoutes from './app.route';
import { IRoute } from '@/utils/interfaces';
import productRoutes from './product.route';
import helpRoutes from './help.route';
import workspaceRoutes from './workspace.route';
import businessRoutes from './business.route';
import adminRoutes from './admin.route';
import talentRoutes from './talent.route';
import sidebarRoutes from './sidebar.route';
import onboardRoutes from './onboard.route';

const routes: Array<IRoute> = [
    ...appRoutes,
    ...sidebarRoutes,
    ...onboardRoutes,
    ...footer,
    ...productRoutes,
    ...helpRoutes,
    ...workspaceRoutes,
    ...adminRoutes,
    ...businessRoutes,
    ...talentRoutes,
];

export default routes;
