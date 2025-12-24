import { IRoute } from "@/utils/interfaces";

const talentRoutes: Array<IRoute> = [
    {
        name: 'talent',
        title: 'Talent',
        url: '/t',
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
            },
            {
                name: 'workshops',
                title: 'Workshops',
                iconName: 'chart',
                url: '/workshops',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false }
            },
            {
                name: 'challenges',
                title: 'Challenges',
                iconName: 'chart',
                url: '/challenges',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false }
            },
            {
                name: 'mentors',
                title: 'Mentors',
                iconName: 'chart',
                url: '/mentors',
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

export default talentRoutes;
