'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function GoFAQ() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How quickly can I set up a hackathon?',
            answer: 'You can create challenges, register participants, and set timelines in minutes with our simple, customizable setup. No complicated tools needed. Our reusable event templates help you draft challenges and hackathons with smart instructions, so you don\'t need to start from scratch each time.',
        },
        {
            id: 'item-2',
            question: 'Can I run online, in-person, or hybrid hackathons?',
            answer: 'Yes! Pacepard Go supports all hackathon formats. You can organize online, in-person, or hybrid hackathons all in one place. Our platform adapts to your event format and helps you manage participants regardless of how they\'re participating.',
        },
        {
            id: 'item-3',
            question: 'How do I track participant progress and project status?',
            answer: 'Our platform provides real-time tracking from start to finish. You can see who\'s participating, what they\'re building, and how projects are progressing at every stage. The project status overview gives you complete visibility into all active projects, reviews, and completed work.',
        },
        {
            id: 'item-4',
            question: 'How do I help participants get up to speed quickly?',
            answer: 'Our knowledge base feature helps participants get up to speed quickly so they can create better projects and add real value to your product. You can provide getting started guides, API documentation, and other resources that participants can access throughout the hackathon.',
        },
        {
            id: 'item-5',
            question: 'How can I collect feedback from participants?',
            answer: 'Pacepard Go includes friendly feedback channels that integrate seamlessly into your hackathon. You\'ll receive continuous feedback and insights from participants through notifications, project updates, and direct communication channels. This helps you build consistent usage momentum and maintain a healthy feedback loop.',
        },
        {
            id: 'item-6',
            question: 'Is Pacepard Go suitable for small teams and large organizations?',
            answer: 'Absolutely! Pacepard Go is built for both small teams and large organizations. Whether you\'re running an internal hackathon for your startup or organizing a large-scale event with thousands of participants, our platform scales to meet your needs.',
        },
        {
            id: 'item-7',
            question: 'What makes Pacepard Go different from other hackathon platforms?',
            answer: 'Pacepard Go is built on the habits that make the best hackathons successful: knowledgeable participants, fast engagement, and launching high-quality initiatives without the usual headaches. We focus on helping you get thousands to stick around your product and technology, building lasting engagement and loyalty.',
        },
        {
            id: 'item-8',
            question: 'Can I reuse templates for multiple hackathons?',
            answer: 'Yes! Our reusable event templates allow you to draft challenges and hackathons with smart instructions and templates. Once you create a template, you can use it for future events, saving you time and ensuring consistency across your hackathons.',
        },
        {
            id: 'item-9',
            question: 'How do I ensure participants stay engaged after the hackathon?',
            answer: 'Pacepard Go helps you build consistent usage momentum and a healthy feedback loop. By providing knowledge resources, tracking progress, and maintaining open communication channels, participants stay engaged with your product and technology long after the hackathon ends.',
        },
        {
            id: 'item-10',
            question: 'What kind of support do you offer for hackathon organizers?',
            answer: 'We provide comprehensive support to help you run memorable and rewarding hackathons. From setup assistance to tracking tools and feedback channels, our platform includes everything you need. If you need additional help, our support team is available to assist you.',
        },
    ]

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-2xl px-6">
                <div className="space-y-12">
                    <h2 className="text-left text-4xl font-regular tracking-tight text-foreground">Your questions answered</h2>

                    <Accordion
                        type="single"
                        collapsible
                        className="-mx-2 sm:mx-0">
                        {faqItems.map((item) => (
                            <div
                                className="group"
                                key={item.id}>
                                <AccordionItem
                                    value={item.id}
                                    className="data-[state=open]:bg-muted peer rounded-xl border-none px-5 py-1 data-[state=open]:border-none md:px-7">
                                    <AccordionTrigger className="cursor-pointer text-lg font-medium text-foreground hover:no-underline">{item.question}</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-lg leading-relaxed text-muted-foreground">{item.answer}</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <hr className="mx-5 -mb-px group-last:hidden peer-data-[state=open]:opacity-0 md:mx-7" />
                            </div>
                        ))}
                    </Accordion>

                    <p className="text-muted-foreground text-left">
                        Can't find what you're looking for? Contact our{' '}
                        <Link
                            href="mailto:hello@pacepard.com"
                            className="text-primary font-medium hover:underline">
                            Support team
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}