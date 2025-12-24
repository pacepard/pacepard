import { IRoute } from "@/utils/interfaces";

const businessRoutes: Array<IRoute> = [
    {
        name: 'business',
        title: 'Business',
        url: '/b',
        iconName: 'layout-right',
        action: 'open-secondary',
        isAuth: true,
        params: [],
        content: { collapsed: false },
        subroutes: [
            {
                name: 'home',
                title: 'Home',
                iconName: 'chart',
                url: '/home',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false }
            },
            {
                name: 'my-inbox',
                title: 'My Inbox',
                iconName: 'chart',
                url: '/messages',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false }
            },            {
                name: 'search',
                title: 'Search',
                iconName: 'chart',
                url: '/search',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false }
            },
            {
                name: 'domains',
                title: 'Domains',
                iconName: 'chart',
                url: '/domains',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false }
            },
            {
                name: 'members',
                title: 'Members',
                iconName: 'chart',
                url: '/members',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false }
            },
            {
                name: 'settings',
                title: 'Settings',
                iconName: 'folder',
                url: '/settings',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false }
            },
            {
                name: 'upgrade-plan',
                title: 'Upgrade Plan',
                iconName: 'trophy',
                url: '/upgrade-plan',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false }
            },
        ]
    },
];

export default businessRoutes;