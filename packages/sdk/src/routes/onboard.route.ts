import { IRoute } from "@/utils/interfaces";

const onboardRoutes: Array<IRoute> = [
    {
        name: 'onboarding',
        title: 'Onboard',
        url: '/onboarding',
        iconName: 'nav',
        action: 'navigate',
        isAuth: false,
        params: [],
        content: { collapsed: false },
        subroutes: [
            {
                name: 'onboard-welcome',
                title: 'Welcome',
                displayTitle: 'Welcome',
                iconName: 'user',
                url: '/welcome',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'onboard-submit-info',
                title: 'Step 2: Basic Info',
                displayTitle: 'Basic Information',
                iconName: 'user-circle',
                url: '/submit-info',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'onboard-create-workspace',
                title: 'Step 3: Create Workspace',
                displayTitle: 'Create Workspace',
                iconName: 'building',
                url: '/create-workspace',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'onboard-invite-teammates',
                title: 'Step 4: Invite Teammates',
                displayTitle: 'Invite Teammates',
                iconName: 'users',
                url: '/invite-teammates',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'onboard-talent-info',
                title: 'Step 3: Talent Info',
                displayTitle: 'Talent Information',
                iconName: 'user-check',
                url: '/talent-info',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'onboard-business-info',
                title: 'Step 3: Business Info',
                displayTitle: 'Business Information',
                iconName: 'building',
                url: '/business-info',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'onboard-complete',
                title: 'Complete Onboarding',
                displayTitle: 'Complete Onboarding',
                iconName: 'check-circle',
                url: '/complete',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'onboard-status',
                title: 'Onboarding Status',
                displayTitle: 'Onboarding Status',
                iconName: 'info',
                url: '/status',
                action: 'navigate',
                isAuth: false,
                params: [],
                content: { collapsed: false, backButton: true }
            },
        ]
    },
]

export default onboardRoutes;
