import MyInbox from '@/app/dashboard/partials/inbox/my-inbox';
import TalentDashboard from '@/app/dashboard/partials/home/talent-home';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import Tabs from '@/components/blocks/activity/test-tab';
import { ReusableTabs } from '@/components/blocks/activity';

export const privateRoutes = [
    {
        path: 'preview',
        element: '',
        userType: ['admin', 'talent', 'business'],
    },
    {
        path: '',
        element: <DashboardLayout />,
        children: [
            {
                path: 'talent-dashboard',
                element: <TalentDashboard />,
                userType: ['admin', 'talent', 'business'],
            },
            {
                path: 'messages',
                element: <MyInbox />,
                userType: ['admin', 'talent', 'business'],
            },
            {
                path: 'home',
                element: <ReusableTabs tabs={Tabs} defaultValue="overview" />,
                userType: ['admin', 'talent', 'business'],
            },
        ],
    },
];
