'use client';

import { motion, Variants } from 'motion/react';
import { Smile, Wrench, Trophy } from 'lucide-react';

import PersonaCard from '../persona-card';

const personas = [
    {
        id: 'product-design-folks',
        title: 'Product & Design folks',
        description:
            'Become the person others trust with the hardest customer  and user problems.',
        image: '/blocks/learners.svg',
        bgColor: 'from-blue-300 to-cyan-200',
        features: [
            { icon: Trophy, label: 'ML competition hosting' },
            { icon: Wrench, label: 'Model training datasets' },
            { icon: Trophy, label: 'Open-sourced models' },
        ],
    },
    {
        id: 'engineers',
        title: 'Engineers',
        description:
            'Be part of recreating advanced tools like Git, S3 bucket, Redis and SQLite from scratch.',
        image: '/blocks/learners.svg',
        bgColor: 'from-yellow-400 to-yellow-200',
        features: [
            { icon: Wrench, label: 'Open-sourced models' },
            { icon: Wrench, label: 'Competition solution write-ups' },
            { icon: Wrench, label: 'Public notebooks' },
        ],
    },
    {
        id: 'data-ai-professionals',
        title: 'Data & AI Professionals',
        description:
            'Be part of building ML Models and pipelines for the toughest data challenges.',
        image: '/blocks/learners.svg',
        bgColor: 'from-yellow-400 to-yellow-200',
        features: [
            { icon: Wrench, label: 'Open-sourced models' },
            { icon: Wrench, label: 'Competition solution write-ups' },
            { icon: Wrench, label: 'Public notebooks' },
        ],
    },

    {
        id: 'security-and-testing-folks',
        title: 'Security & testing folks',
        image: '/blocks/learners.svg',
        description:
            'Become the safeguard we rely on to uncover hidden failures and security flaws.',
        bgColor: 'from-blue-400 to-blue-200',
        features: [
            { icon: Smile, label: 'Beginner competitions' },
            { icon: Wrench, label: 'Practical courses' },
            { icon: Trophy, label: 'Public datasets' },
        ],
    },
    {
        id: 'product-marketing-and-sales',
        title: 'Marketing & sales',
        description:
            'Become the pillar that generates leads and drives product usage with effective strategies.',
        image: '/blocks/learners.svg',
        bgColor: 'from-blue-300 to-cyan-200',
        features: [
            { icon: Trophy, label: 'ML competition hosting' },
            { icon: Wrench, label: 'Model training datasets' },
            { icon: Trophy, label: 'Open-sourced models' },
        ],
    },

    {
        id: 'learners', // Note: Duplicate ID, changed to avoid React warnings if this were production
        title: 'Learners',
        image: '/blocks/learners.svg',
        description:
            'Projects that go beyond basics and make you understand the underlying complexity.',
        bgColor: 'from-blue-400 to-blue-200',
        features: [
            { icon: Smile, label: 'Beginner competitions' },
            { icon: Wrench, label: 'Practical courses' },
            { icon: Trophy, label: 'Public datasets' },
        ],
    },
];

// Animation variants for the title
const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Animation variants for the card containers (staggered fade-in-up)
const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15, // Staggered delay
            duration: 0.5,
            ease: 'easeOut',
        },
    }),
};

export function PersonasShowcase() {
    return (
        // Adjusted horizontal padding for small screens
        <section className="py-16 px-4 sm:px-8 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <motion.h1
                    className="mb-12 text-2xl tracking-tight md:text-4xl lg:text-5xl"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={titleVariants}
                >
                    Who&apos;s on Pacepard?
                </motion.h1>

                {/* --- RESPONSIVENESS APPLIED HERE --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {personas.map((persona, idx) => (
                        <motion.div
                            key={persona.id}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            custom={idx} // Pass index as a custom prop for staggered delay
                            variants={cardVariants}
                        >
                            <PersonaCard {...persona} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
