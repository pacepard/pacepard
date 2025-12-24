import { IRoute } from "@/utils/interfaces";

const adminRoutes: Array<IRoute> = [
    {
        name: 'admin',
        title: 'Dashboard',
        url: '/admin',
        iconName: 'layout-right',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { collapsed: false },
    },
    {
        name: 'users',
        title: 'Users',
        url: '/admin/users',
        iconName: 'users',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { collapsed: false },
        subroutes: [
            {
                name: 'all-users',
                title: 'All Users',
                iconName: 'user',
                url: '/all-users',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'talents',
                title: 'Talents',
                iconName: 'user',
                url: '/talents',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'businesses',
                title: 'Businesses',
                iconName: 'user',
                url: '/businesses',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'divider',
                url: '/',
                isAuth: true,
                params: [],
                content: {}
            },
            {
                name: 'admins',
                title: 'Admins',
                iconName: 'user',
                url: '/admins',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            }
        ]
    },
    {
        name: 'hackathons',
        title: 'Hackathons',
        url: '/admin/hackathons',
        iconName: 'trophy',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { collapsed: false },
        subroutes: [
            {
                name: 'admin-hackathons-list',
                title: 'All Hackathons',
                url: '/list',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false }
            },
            {
                name: 'admin-hackathons-moderate',
                title: 'Moderation',
                url: '/moderate',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false }
            }
        ]
    },
    
    {
        name: 'admin-settings',
        title: 'System Settings',
        url: '/admin/settings',
        iconName: 'settings',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { collapsed: false },
        subroutes: [
            {
                name: 'admin-settings-general',
                title: 'General',
                url: '/general',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false }
            },
            {
                name: 'admin-settings-security',
                title: 'Security',
                url: '/security',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false }
            },
            {
                name: 'admin-settings-invitations',
                title: 'Invitations',
                url: '/invitations',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false }
            }
        ]
    },
    {
        name: 'resources',
        title: 'Resources',
        url: '/resources',
        iconName: 'settings',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { collapsed: false },
    },    {
        name: 'referrals',
        title: 'Referrals',
        iconName: 'gift',
        url: '/referrals',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { collapsed: false, backButton: true }
    },

    {
        name: 'payments',
        title: 'Payments',
        iconName: 'credit-card',
        url: '/payments',
        action: 'open-secondary',
        isAuth: true,
        params: [],
        content: { collapsed: false },
        subroutes: [
            {
                name: 'transactions',
                title: 'Transactions',
                iconName: 'star',
                url: '/transactions',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'subscriptions',
                title: 'Subscriptions',
                iconName: 'shopping-bag',
                url: '/subscriptions',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'divider',
                url: '/',
                isAuth: true,
                params: [],
                content: {}
            }
        ]
    },

    {
        name: 'account',
        title: 'Account',
        iconName: 'layout-left',
        url: '/account',
        action: 'open-secondary',
        isAuth: true,
        params: [],
        content: { collapsed: false },
        subroutes: [
            {
                name: 'profile',
                title: 'Profile',
                iconName: 'user',
                url: '/profile',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'preferences',
                title: 'Preferences',
                iconName: 'user',
                url: '/preferences',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'divider',
                url: '/',
                isAuth: true,
                params: [],
                content: {}
            },
            {
                name: 'billing',
                title: 'Billing',
                iconName: 'user',
                url: '/billing',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            }
        ]
    },

    {
        name: 'support',
        title: 'Support',
        iconName: 'layout-left',
        url: '/support',
        action: 'open-secondary',
        isAuth: true,
        params: [],
        content: { collapsed: false },
        subroutes: [
            {
                name: 'feedback',
                title: 'Feedback',
                iconName: 'user',
                url: '/feedback',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'updates',
                title: 'Updates',
                iconName: 'user',
                url: '/updates',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'divider',
                url: '/',
                isAuth: true,
                params: [],
                content: {}
            },
            {
                name: 'help',
                title: 'Help',
                iconName: 'user',
                url: '/help',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            }
        ]
    },
];

export default adminRoutes;