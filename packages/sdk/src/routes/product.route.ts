import { IRoute } from "@/utils/interfaces";

const productRoutes: Array<IRoute> = [

    {
        name: 'product',
        title: 'Product',
        url: '',
        iconName: 'layout-right',
        action: 'navigate',
        isAuth: false,
        params: [],
        content: { collapsed: false },
        subroutes: [
                {
                    name: 'templates',
                    title: 'Templates',
                    iconName: 'nav',
                    url: '/templates',
                    action: 'navigate',
                    isAuth: false,
                    params: [],
                    content: { collapsed: false, backButton: true }
                },
                {
                    name: 'whats-new',
                    title: "What's new",
                    iconName: 'nav',
                    url: '/whats-new',
                    action: 'navigate',
                    isAuth: false,
                    params: [],
                    content: { collapsed: false, backButton: true }
                },
                {
                    name: 'roadmap',
                    title: 'Roadmap',
                    iconName: 'nav',
                    url: '/roadmap',
                    action: 'navigate',
                    isAuth: false,
                    params: [],
                    content: { collapsed: false, backButton: true }
                },
                {
                    name: 'feature-requests',
                    title: 'Feature Requests',
                    iconName: 'nav',
                    url: '/feature-requests',
                    action: 'navigate',
                    isAuth: false,
                    params: [],
                    content: { collapsed: false, backButton: true }
                },
        ]
    },
]

export default productRoutes;