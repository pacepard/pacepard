import { NextResponse } from 'next/server';

const avatarList = [
    {
        image: '/images/avatar/avatar_1.jpg',
        title: 'Sarah Johnson',
    },
    {
        image: '/images/avatar/avatar_2.jpg',
        title: 'Olivia Miller',
    },
    {
        image: '/images/avatar/avatar_3.jpg',
        title: 'Sophia Roberts',
    },
    {
        image: '/images/avatar/avatar_4.jpg',
        title: 'Isabella Clark',
    },
];

const statsFactData = {
    // number: '01',
    name: 'Stats & facts',
    heading: ' Our reinforced trust and results.',
    description:
        'We deliver solutions that achieve measurable results, drive adoption, and create real impact for users and businesses alike.',
    scoreData: [
        {
            number: 8,
            // numberValue: 'K',
            scoreDescp: 'Market-ready websites, built to perform and convert',
        },
        {
            number: 10,
            scoreDescp:
                'AI models that transcribe audio with local language context.',
        },
        {
            number: 3,
            // numberValue: 'k',
            scoreDescp:
                'Fashioned products that users love and it convert problem to scalability.',
        },
    ],
};

const servicesData = {
    // number: '03',
    name: 'Services',
    heading: 'What we do',
    description:
        'We don’t ship features, we engineer systems that perform under pressure, adapt to context, and grow with your business.',
    data: [
        {
            id: 1,
            image: '/images/home/services/AI.jpg',
            heading: 'AI AND ML',
            descp: 'Turning data into intelligence that predicts, learns, and adapts.',
        },
        {
            id: 2,
            image: '/images/home/services/Web.jpg',
            heading: 'Web Development',
            descp: 'Building seamless, scalable web experiences that perform flawlessly.',
        },
        {
            id: 3,
            image: '/images/home/services/Product1.jpg',
            heading: 'Product Design',
            descp: 'Designing products users love—simple, intuitive, and behavior-driven.',
        },
        {
            id: 4,
            image: '/images/home/services/mobil1.jpg',
            heading: 'Mobile Development',
            descp: 'We treat mobile as living infrastructure, not just an app. Our products are built to move with people—adapting to context, surviving real-world constraints, and quietly expanding access, connection, and possibility at scale.',
        },
    ],
};

const testimonialData = {
    data_1: {
        preTitle: 'Hear from them',
        title: 'Our website redesign was flawless. They understood our vision perfectly!',
        author: 'Albert Flores',
        company: 'MasterCard',
    },
    data_2: {
        preTitle: 'Hear from them',
        title: 'From concept to execution, they delivered outstanding results. Highly recommend their expertise!',
        author: 'Robert Fox',
        company: 'Mitsubishi',
    },
    data_3: {
        preTitle: 'Hear from them',
        title: 'Super smooth process with incredible results. highly recommend!',
        author: 'Jenny Wilson',
        company: 'Pizza Hut',
    },
};

const teamData = {
    // number: '06',
    data: [
        {
            image: '/images/home/team/damola.png',
            name: 'Damola Oladipo',
            position: 'CEO/Co-Founder',
            socialLinks: [
                {
                    icon: '/images/socialIcon/twitter.svg',
                    // link: "https://twitter.com"
                },
                {
                    icon: '/images/socialIcon/Be.svg',
                    // link: "https://www.behance.net/"
                },
                {
                    icon: '/images/socialIcon/linkedin.svg',
                    // link: "https://linkedin.com"
                },
            ],
        },
        {
            image: '/images/home/team/tope.png',
            name: 'Okuselu Temitope',
            position: 'Deputy CEO',
            socialLinks: [
                {
                    icon: '/images/socialIcon/twitter.svg',
                    // link: "https://twitter.com"
                },
                {
                    icon: '/images/socialIcon/Be.svg',
                    // link: "https://www.behance.net/"
                },
                {
                    icon: '/images/socialIcon/linkedin.svg',
                    // link: "https://linkedin.com"
                },
            ],
        },
        {
            image: '/images/home/team/favour.png',
            name: 'Brodrick Favour',
            position: 'Head of Operations',
            socialLinks: [
                {
                    icon: '/images/socialIcon/twitter.svg',
                    // link: "https://twitter.com"
                },
                {
                    icon: '/images/socialIcon/Be.svg',
                    // link: "https://www.behance.net/"
                },
                {
                    icon: '/images/socialIcon/linkedin.svg',
                    // link: "https://linkedin.com"
                },
            ],
        },
        {
            image: '/images/home/team/steph.png',
            name: 'Stephanie Onwuagbaizu',
            position: 'Backend Engineer',
            socialLinks: [
                {
                    icon: '/images/socialIcon/twitter.svg',
                    // link: "https://twitter.com"
                },
                {
                    icon: '/images/socialIcon/Be.svg',
                    // link: "https://www.behance.net/"
                },
                {
                    icon: '/images/socialIcon/linkedin.svg',
                    // link: "https://linkedin.com"
                },
            ],
        },
        {
            image: '/images/home/team/harry.png',
            name: 'Happiness Peter',
            position: 'Backend Engineer',
            socialLinks: [
                {
                    icon: '/images/socialIcon/twitter.svg',
                    // link: "https://twitter.com"
                },
                {
                    icon: '/images/socialIcon/Be.svg',
                    // link: "https://www.behance.net/"
                },
                {
                    icon: '/images/socialIcon/linkedin.svg',
                    // link: "https://linkedin.com"
                },
            ],
        },
        {
            image: '/images/home/team/daniel.png',
            name: 'Daniel Ayokunle',
            position: 'Frontend Engineer',
            socialLinks: [
                {
                    icon: '/images/socialIcon/twitter.svg',
                    // link: "https://twitter.com"
                },
                {
                    icon: '/images/socialIcon/Be.svg',
                    // link: "https://www.behance.net/"
                },
                {
                    icon: '/images/socialIcon/linkedin.svg',
                    // link: "https://linkedin.com"
                },
            ],
        },
        {
            image: '/images/home/team/toyosi.png',
            name: 'Toyosi Odewenwa',
            position: 'Product Designer',
            socialLinks: [
                {
                    icon: '/images/socialIcon/twitter.svg',
                    // link: "https://twitter.com"
                },
                {
                    icon: '/images/socialIcon/Be.svg',
                    // link: "https://www.behance.net/"
                },
                {
                    icon: '/images/socialIcon/linkedin.svg',
                    // link: "https://linkedin.com"
                },
            ],
        },
        {
            image: '/images/home/team/gbemiga.png',
            name: 'Shoga Oluwagbemiga',
            position: 'Product Designer',
            socialLinks: [
                {
                    icon: '/images/socialIcon/twitter.svg',
                    // link: "https://twitter.com"
                },
                {
                    icon: '/images/socialIcon/Be.svg',
                    // link: "https://www.behance.net/"
                },
                {
                    icon: '/images/socialIcon/linkedin.svg',
                    // link: "https://linkedin.com"
                },
            ],
        },
    ],
};

const pricingData = {
    data: [
        {
            planName: 'Launch',
            planPrice: '$699',
            planDescp:
                'Ideal for startups and small businesses taking their first steps online.',
            planIncludes: [
                'Competitive research & insights',
                'Wireframing and prototyping',
                'Basic tracking setup (Google Analytics, etc.)',
                'Standard contact form integration',
            ],
        },
        {
            planName: 'Scale',
            tag: 'Most popular',
            planPrice: '$1,699',
            cancelPrice: '$2,199',
            planDescp:
                'Perfect for growing brands needing more customization and flexibility.',
            planIncludes: [
                'Everything in the Launch Plan',
                'Custom design for up to 10 pages',
                'Seamless social media integration',
                'SEO enhancements for key pages',
            ],
        },
        {
            planName: 'Elevate',
            planPrice: '$3,499',
            planDescp:
                'Best suited for established businesses wanting a fully tailored experience.',
            planIncludes: [
                'Everything in the Scale Plan',
                'E-commerce functionality (if needed)',
                'Branded email template design',
                'Priority support for six months after launch',
            ],
        },
    ],
    partnerLogo: [
        {
            light: '/images/home/pricing/ennovate1.svg',
            dark: '/images/home/pricing/ennovate4.svg',
        },
        {
            light: '/images/home/pricing/ahiaoma2.svg',
            dark: '/images/home/pricing/ahiaoma5.svg',
        },
        {
            light: '/images/home/pricing/masterminds3.svg',
            dark: '/images/home/pricing/masterminds6.svg',
        },
        {
            light: '/images/home/pricing/yali9.svg',
            dark: '/images/home/pricing/yali10.svg',
        },
        {
            light: '/images/home/pricing/folabi7.svg',
            dark: '/images/home/pricing/folabi8.svg',
        },
        {
            light: '/images/home/pricing/global11.svg',
            dark: '/images/home/pricing/global12.svg',
        },
    ],
};

const faqData = {
    data: [
        {
            faq_que: 'What services do you provide?',
            faq_ans:
                'We deliver end-to-end digital product development, including scalable web applications, mobile solutions, AI/ML-powered systems, and product design. Our work spans discovery, architecture, development, deployment, and optimization, ensuring products are technically sound, user-centric, and built for growth.',
        },
        {
            faq_que: 'Do you offer installment-based payment options?',
            faq_ans:
                'Yes. We provide milestone-based payment structures tied to clearly defined deliverables. This ensures transparency, predictable budgeting, and shared accountability throughout the project lifecycle.',
        },
        {
            faq_que: 'Is post-implementation support available?',
            faq_ans:
                'Absolutely. We offer structured post-deployment support, including system monitoring, performance optimization, bug resolution, and feature enhancements. Support can be scoped as short-term stabilization or long-term maintenance contracts.',
        },
        {
            faq_que: 'How do you ensure product scalability and performance?',
            faq_ans:
                'We implement best practices in architecture design, conduct thorough performance testing, and use scalable cloud infrastructure to ensure products can handle growth and maintain high performance.',
        },
        {
            faq_que: 'Can you work with existing products or legacy systems?',
            faq_ans:
                'Yes. We audit existing systems, identify technical debt, and implement incremental improvements without disrupting ongoing operations. This includes refactoring, system upgrades, and AI feature integration.',
        },
        {
            faq_que: 'What is your typical project timeline?',
            faq_ans:
                'Timelines depend on scope and complexity. However, we follow an agile delivery model-breaking projects into sprints with clear milestones, enabling faster releases and continuous feedback',
        },
        {
            faq_que: 'How involved will we be during development?',
            faq_ans:
                'Clients are integrated into the development cycle through regular updates, demos, and technical reviews. This ensures alignment, transparency, and early validation of product direction.',
        },
    ],
};
const contactData = {
    keypoint: ['Always-On Customer Support', 'Service Across the Globe'],
    managerProfile: {
        image: '/images/avatar/avatar_1.jpg',
        name: 'Courtney Henry',
        position: 'Onboarding & Success Manager',
    },
};

// const aboutusStats = [
//     {
//         number: 45,
//         postfix:"+",
//         title: 'Presence in global markets',
//         descp: "Expanding reach across international regions with localized expertise and worldwide impact."
//     },
//     {
//         number: 15,
//         prefix: "$",
//         postfix: "M",
//         title: 'In strategic investments',
//         descp: "Driving growth with curated partnerships and high-performing, audience-driven initiatives."
//     },
//     {
//         number: 158,
//         postfix: "+",
//         title: 'Trusted brand collaborations',
//         descp: "Shaping industry conversations through innovation, creativity, and lasting influence."
//     },
// ]

const servicesSliderData = [
    'Mobile Development',
    'Web development',
    'Machine Learning (AI)',
    'Product Design',
];

export const GET = async () => {
    return NextResponse.json({
        avatarList,
        statsFactData,
        servicesData,
        testimonialData,
        teamData,
        pricingData,
        faqData,
        contactData,
        // aboutusStats,
        servicesSliderData,
    });
};
