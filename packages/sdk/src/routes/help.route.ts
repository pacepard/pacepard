import { IRoute } from "@/utils/interfaces";

const helpRoutes: Array<IRoute> = [

    {
        name: 'help',
        title: 'Help',
        url: '/help',
        iconName: 'layout-right',
        action: 'navigate',
        isAuth: false,
        params: [],
        content: { collapsed: false },
        subroutes: [
            {
                name: 'get-started',
                title: 'Get Started',
                iconName: 'nav',
                url: '/get-started',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'how-to-guides',
                title: 'How to Guides',
                iconName: 'nav',
                url: '/how-to-guides',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true }
            },            {
                name: 'Help Center',
                title: 'Help Center',
                iconName: 'nav',
                url: '/help-center',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true }
            },            {
                name: 'trash',
                title: 'Trash',
                iconName: 'nav',
                url: '/trash',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true }
            },
        ]
    },
]

export default helpRoutes;