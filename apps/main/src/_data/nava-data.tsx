import { Mail, Settings, User } from 'lucide-react';

export const navItems = {
    mainNav: [
        {
            title: '',
            url: '#',
            roles: ['talent'],
            items: [
                {
                    title: 'Home',
                    url: '/talent-dashboard',
                    icon: User,
                    isActive: false,
                },
                {
                    title: 'My Inbox',
                    url: '/message',
                    icon: Mail,
                    isActive: false,
                },
            ],
        },
    ],
    hackSpace: [
        {
            title: 'Hackspace',
            roles: ['talent'],
            url: '#',
            items: [
                {
                    title: 'Projects',
                    url: '/projects',
                    icon: Mail,
                    isActive: false,
                },
                {
                    title: 'Hackers',
                    url: '/hackers',
                    icon: Mail,
                    isActive: false,
                },
                {
                    title: 'Mentors',
                    url: '/mentors',
                    icon: Mail,
                    isActive: false,
                },
                {
                    title: 'About',
                    url: '/hack-ogbomoso',
                    icon: Mail,
                    isActive: false,
                },
                {
                    title: 'Resources',
                    url: '/resources',
                    icon: Mail,
                    isActive: false,
                },
                {
                    title: 'Evaluation',
                    url: '/evaluation',
                    icon: Mail,
                    isActive: false,
                },
                {
                    title: 'Analytics',
                    url: '/analytics',
                    icon: Mail,
                    isActive: false,
                },
            ],
        },
    ],
    workSpace: [
        {
            title: 'Sermon Management',
            roles: ['staff', 'preacher'],
            url: '#',
            items: [
                {
                    title: 'Hackers',
                    url: '/hackers',
                    icon: Mail,
                    isActive: false,
                },
                {
                    title: 'Series',
                    url: '/my-series',
                    icon: Mail,
                    isActive: false,
                },
                {
                    title: 'Drafts',
                    url: '/user-draft',
                    icon: Mail,
                    isActive: false,
                },
                {
                    title: 'Trash',
                    url: '/user-trash',
                    icon: Mail,
                    isActive: false,
                },
            ],
        },
    ],
};

export const navFooterItems = [
    {
        title: 'Account',
        url: '/account',
        icon: User,
    },
    {
        title: 'Settings',
        url: '/settings',
        icon: Settings,
    },
];
