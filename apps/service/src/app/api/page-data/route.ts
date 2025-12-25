import { NextResponse } from "next/server";

const avatarList = [
    {
        image: "/images/avatar/avatar_1.jpg",
        title: "Sarah Johnson"
    },
    {
        image: "/images/avatar/avatar_2.jpg",
        title: "Olivia Miller"
    },
    {
        image: "/images/avatar/avatar_3.jpg",
        title: "Sophia Roberts"
    },
    {
        image: "/images/avatar/avatar_4.jpg",
        title: "Isabella Clark"
    },
];

const statsFactData = {
    number: '01',
    name: "Stats & facts",
    heading: "The trusted gateway to innovation, skill mastery and adoption.",
    description: "Pacepard is a community-as-a-service platform linking African talent with tech companies through innovative hackathons.",
    scoreData: [
        {
            number: 40,
            numberValue: 'K',
            scoreDescp: "Talents who have launched their websites"
        },
        {
            number: 238,
            scoreDescp: "Tech talent who are fostering ideas and building products."
        },
        {
            number: 3,
            numberValue: 'M',
            scoreDescp: "Providing support through messages and live consultations."
        },
    ]
};

const servicesData = {
    number: '03',
    name: "Services",
    heading: "What we do",
    description: "Discover our creativity—where innovative talent meets seamless hackathon experiences.",
    data: [
        {
            id: 1,
            image: "/images/home/services/Hackathon3.jpeg",
            heading: "Talent Growth Hack",
            descp: "Smart strategies that fast-track talent development and innovation through hackathons and project challenges."
        },
        {
            id: 2,
            image: "/images/home/services/Hackathon2.jpg",
            heading: "Tech Forge",
            descp: "we transform innovative ideas into fully functional digital products. Leveraging top-tier talent, collaborative hackathons, and agile development."
        },
        {
            id: 3,
            image: "/images/home/services/Hackathon1.jpeg",
            heading: "Mentor the Builders",
            descp: "Where mentors meet makers, a space for bold thinkers, doers, and innovators. Lead workshops, spark ideas, and guide emerging talent as they turn concepts into real-world solutions."
        },
        // {
        //     id: 4,
        //     image: "/images/home/services/services_4.png",
        //     heading: "Motion & 3d modeling",
        //     descp: "When selecting a web design agency, it's essential to consider its reputation, experience, and the specific needs of your project."
        // },
    ]
};

const testimonialData = {
    data_1: {
        preTitle: "Hear from them",
        title: "Our website redesign was flawless. They understood our vision perfectly!",
        author: "Albert Flores",
        company: "MasterCard"
    },
    data_2: {
        preTitle: "Hear from them",
        title: "From concept to execution, they delivered outstanding results. Highly recommend their expertise!",
        author: "Robert Fox",
        company: "Mitsubishi"
    },
    data_3: {
        preTitle: "Hear from them",
        title: "Super smooth process with incredible results. highly recommend!",
        author: "Jenny Wilson",
        company: "Pizza Hut"
    },
};

const teamData = {
    number: '06',
    data: [
        {
            image: "/images/home/team/TeamA.jpeg",
            name: "Damola Oladipo",
            position: "CEO/Co-Founder",
            socialLinks: [
                {
                    icon: "/images/socialIcon/twitter.svg",
                    // link: "https://twitter.com"
                },
                {
                    icon: "/images/socialIcon/Be.svg",
                    // link: "https://www.behance.net/"
                },
                {
                    icon: "/images/socialIcon/linkedin.svg",
                    // link: "https://linkedin.com"
                }
            ]
        },
        {
            image: "/images/home/team/TeamC.jpeg",
            name: "Okuselu Temitope",
            position: "CTO",
            socialLinks: [
                {
                    icon: "/images/socialIcon/twitter.svg",
                    // link: "https://twitter.com"
                },
                {
                    icon: "/images/socialIcon/Be.svg",
                    // link: "https://www.behance.net/"
                },
                {
                    icon: "/images/socialIcon/linkedin.svg",
                    // link: "https://linkedin.com"
                }
            ]
        },
        {
            image: "/images/home/team/Team7.jpeg",
            name: "Brodrick Favour",
            position: "COO",
            socialLinks: [
                {
                    icon: "/images/socialIcon/twitter.svg",
                    // link: "https://twitter.com"
                },
                {
                    icon: "/images/socialIcon/Be.svg",
                    // link: "https://www.behance.net/"
                },
                {
                    icon: "/images/socialIcon/linkedin.svg",
                    // link: "https://linkedin.com"
                }
            ]
        },
        {
            image: "/images/home/team/Team1.jpeg",
            name: "Stephanie Onwuagbaizu",
            position: "Backend Developer",
            socialLinks: [
                {
                    icon: "/images/socialIcon/twitter.svg",
                    // link: "https://twitter.com"
                },
                {
                    icon: "/images/socialIcon/Be.svg",
                    // link: "https://www.behance.net/"
                },
                {
                    icon: "/images/socialIcon/linkedin.svg",
                    // link: "https://linkedin.com"
                }
            ]
        },
        {
            image: "/images/home/team/TeamD..jpeg",
            name: "Happiness Peter",
            position: "Backend Developer",
            socialLinks: [
                {
                    icon: "/images/socialIcon/twitter.svg",
                    // link: "https://twitter.com"
                },
                {
                    icon: "/images/socialIcon/Be.svg",
                    // link: "https://www.behance.net/"
                },
                {
                    icon: "/images/socialIcon/linkedin.svg",
                    // link: "https://linkedin.com"
                }
            ]
        },
        {
            image: "/images/home/team/Team5.jpeg",
            name: "Damola Ifati",
            position: "Frontend Developer",
            socialLinks: [
                {
                    icon: "/images/socialIcon/twitter.svg",
                    // link: "https://twitter.com"
                },
                {
                    icon: "/images/socialIcon/Be.svg",
                    // link: "https://www.behance.net/"
                },
                {
                    icon: "/images/socialIcon/linkedin.svg",
                    // link: "https://linkedin.com"
                }
            ]
        },
        {
            image: "/images/home/team/TeamB.jpeg",
            name: "Toyosi Odewenwa",
            position: "UI/UX",
            socialLinks: [
                {
                    icon: "/images/socialIcon/twitter.svg",
                    // link: "https://twitter.com"
                },
                {
                    icon: "/images/socialIcon/Be.svg",
                    // link: "https://www.behance.net/"
                },
                {
                    icon: "/images/socialIcon/linkedin.svg",
                    // link: "https://linkedin.com"
                }
            ]
        },
    ]
};

const pricingData = {
    data: [
        {
            planName: "Launch",
            planPrice: "$699",
            planDescp: "Ideal for startups and small businesses taking their first steps online.",
            planIncludes: ["Competitive research & insights","Wireframing and prototyping","Basic tracking setup (Google Analytics, etc.)","Standard contact form integration"]
        },
        {
            planName: "Scale",
            tag: "Most popular",
            planPrice: "$1,699",
            cancelPrice: "$2,199",
            planDescp: "Perfect for growing brands needing more customization and flexibility.",
            planIncludes: ["Everything in the Launch Plan","Custom design for up to 10 pages","Seamless social media integration","SEO enhancements for key pages"]
        },
        {
            planName: "Elevate",
            planPrice: "$3,499",
            planDescp: "Best suited for established businesses wanting a fully tailored experience.",
            planIncludes: ["Everything in the Scale Plan","E-commerce functionality (if needed)","Branded email template design","Priority support for six months after launch"]
        },
    ],
    partnerLogo: [
        { light: "/images/home/pricing/partner-1.svg", dark: "/images/home/pricing/partner-dark-1.svg" },
        { light: "/images/home/pricing/partner-2.svg", dark: "/images/home/pricing/partner-dark-2.svg" },
        { light: "/images/home/pricing/partner-3.svg", dark: "/images/home/pricing/partner-dark-3.svg" },
        { light: "/images/home/pricing/partner-4.svg", dark: "/images/home/pricing/partner-dark-4.svg" },
        { light: "/images/home/pricing/partner-5.svg", dark: "/images/home/pricing/partner-dark-5.svg" },
      ],
};

const faqData = {
    data: [
        {
            faq_que: "What services does your agency offer?",
            faq_ans: 'Yes, we provide post-launch support to ensure smooth implementation and offer ongoing maintenance packages for clients needing regular updates or technical assistance.'
        },
        {
            faq_que: "How long does a typical project take?",
            faq_ans: 'Yes, we provide post-launch support to ensure smooth implementation and offer ongoing maintenance packages for clients needing regular updates or technical assistance.'
        },
        {
            faq_que: "Do you offer custom designs, or do you use templates?",
            faq_ans: 'Yes, we provide post-launch support to ensure smooth implementation and offer ongoing maintenance packages for clients needing regular updates or technical assistance.'
        },
        {
            faq_que: "What’s the cost of a project?",
            faq_ans: 'Yes, we provide post-launch support to ensure smooth implementation and offer ongoing maintenance packages for clients needing regular updates or technical assistance.'
        },
        {
            faq_que: "Do you provide ongoing support after project completion?",
            faq_ans: 'Yes, we provide post-launch support to ensure smooth implementation and offer ongoing maintenance packages for clients needing regular updates or technical assistance.'
        }
    ]
};
const contactData = {
    keypoint:["Always-On Customer Support","Service Across the Globe"],
    managerProfile:{
        image:"/images/avatar/avatar_1.jpg",
        name:"Courtney Henry",
        position:"Onboarding & Success Manager"
    }
}

const aboutusStats = [
    {
        number: 45,
        postfix:"+",
        title: 'Presence in global markets',
        descp: "Expanding reach across international regions with localized expertise and worldwide impact."
    },
    {
        number: 15,
        prefix: "$",
        postfix: "M",
        title: 'In strategic investments',
        descp: "Driving growth with curated partnerships and high-performing, audience-driven initiatives."
    },
    {
        number: 158,
        postfix: "+",
        title: 'Trusted brand collaborations',
        descp: "Shaping industry conversations through innovation, creativity, and lasting influence."
    },
]

const servicesSliderData = [
    "Branding", "Web development", "Agency","Content creation","SaaS","Motion & 3d modeling","Photography"
]



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
        aboutusStats,
        servicesSliderData
    });
};