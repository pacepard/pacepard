'use client';

import { motion, Variants } from 'motion/react';
import { Smile, Wrench, Trophy, ArrowRight } from 'lucide-react';

import PersonaCard from '../shared/persona-card';
import { Button } from '../ui/button';
import Link from 'next/link';

const personas = [
    {
        id: 'product-design-folks',
        title: 'Product & Design folks',
        description:
            'Become the person others trust with the hardest user problems.',
        image: '/blocks/product.png',
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
            'Build advanced tools like Git, S3 buckets, and CLIs from scratch.',
        image: '/blocks/eng.png',
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
            'Build ML Models and pipelines for the toughest data challenges.',
        image: '/blocks/ai.png',
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
        image: '/blocks/security.png',
        description:
            'Uncover hidden failures and security flaws on live systems.',
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
            'Drive adoption, and engagement for socio-good products.', 


        image: '/blocks/market.png',
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
        image: '/blocks/learner.png',
        description:
            'We hold your hands as you learn by doing tasks beyond basics.',
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

export function PPPersona() {
    return (
        // Adjusted horizontal padding for small screens -  #e5f6ff
        <section className="py-24 px-4 sm:px-8 bg-[#f1ffee] overflow-hidden">
            <div className="max-w-6xl mx-auto ">
                <div className="flex flex-wrap items-start justify-start gap-4 pb-16">
                    <motion.h1
                        className="max-w-2xl text-balance font-regular tracking-tight text-foreground text-3xl md:text-4xl"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={titleVariants}
                    >
                        Who&apos;s on Pacepard?
                    </motion.h1>

                </div>

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
