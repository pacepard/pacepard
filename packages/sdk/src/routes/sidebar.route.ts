import { IRoute } from '@/utils/interfaces';

const sidebarRoutes: Array<IRoute> = [
    {
        name: 'dashboard',
        title: 'Dashboard',
        url: '/dashboard',
        iconName: 'layout-right',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { collapsed: false },
    },
    {
        name: 'settings',
        title: 'Settings',
        iconName: 'settings',
        url: '/settings',
        action: 'open-secondary',
        isAuth: false,
        params: [],
        content: { collapsed: false },
        subroutes: [
            {
                name: 'security',
                title: 'Security',
                displayTitle: 'Security Settings',
                iconName: 'historic-shield',
                url: '/security',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true },
            },
            {
                name: 'notifications',
                title: 'Notification',
                iconName: 'bell',
                url: '/notifications',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true },
            },
            {
                name: 'team-settings',
                title: 'Team Settings',
                iconName: 'users',
                url: '/team-settings',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true },
            },
            {
                name: 'team-members',
                title: 'Team Members',
                iconName: 'user-plus',
                url: '/team-members',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true },
            },
        ],
    },
];

export default sidebarRoutes;
