import { type IconName } from 'lucide-react/dynamic'

export type FAQItem = {
  id: string
  icon: IconName
  question: string
  answer: string
}

export type FAQSection = {
  title: string
  description: string
  contactText: string
  contactLink: string
}

export const hackFaqSection: FAQSection = {
  title: 'Frequently Asked Questions',
  description: "Can't find what you're looking for?",
  contactText: 'Send us a mail',
  contactLink: '#', // Replace with your real contact link or email
}

export const hackFaqItems: FAQItem[] = [
  {
    id: 'item-1',
    icon: 'rocket',
    question: 'What exactly is #HACK2025?',
    answer:
      '#HACK2025 is a global missional hackathon where Christians come together to use technology, creativity, and innovation to solve real-world challenges and share the love of Christ in practical ways. This hands-on event is for computer programmers, developers, engineers, user experience specialists, project managers, and others. People with technical backgrounds come together, form teams around a problem or idea, and collaboratively develop a unique solution.',
  },
  {
    id: 'item-2',
    icon: 'users',
    question: 'Who can participate?',
    answer:
      "The #HACK is not just for people who write code; it's for every believer with cutting-edge digital skills who seeks to build solutions that advance the gospel and bless humanity. We welcome participation from product developers, product managers, designers, marketing experts, content creators, and others.",
  },
  {
    id: 'item-3',
    icon: 'heart-handshake',
    question: 'Do I have to be a Christian to join?',
    answer:
      '#HACK2025 is a Christian-led event centered on faith and impact, but anyone open to the mission and values is welcome to participate.',
  },
  {
    id: 'item-4',
    icon: 'lightbulb',
    question: 'Do I need to know how to code?',
    answer:
      'No. While many participants are tech-savvy, #HACK2025 also needs creatives, communicators, problem-solvers, and visionaries. Every skill counts.',
  },
  {
    id: 'item-5',
    icon: 'ticket',
    question: 'How much does it cost to attend?',
    answer:
      'Participation is free, but registration is required. Slots are limited, so early registration is encouraged.',
  },
  {
    id: 'item-6',
    icon: 'map-pin',
    question: 'Where will the event take place?',
    answer:
      'At The Assembly by Ennovate Lab, beside BON Nest Hotel, along LAUTECH Main Gate, Ogbomoso, Oyo State.',
  },
  {
    id: 'item-7',
    icon: 'calendar-days',
    question: 'When is it happening?',
    answer:
      'From October 23rd to 25th, 2025 — three days of learning, building, and impact.',
  },
  {
    id: 'item-8',
    icon: 'briefcase',
    question: 'What should I bring?',
    answer:
      'Bring your laptop, charger, notebook, and a mindset ready to collaborate. We’ll provide workspace, internet, and all necessary resources.',
  },
  {
    id: 'item-9',
    icon: 'timer',
    question: 'About how many hours of work will be accomplished during the Hack?',
    answer:
      'Between 10–30 hours, depending on the specific schedule of the #HACK location.',
  },
  {
    id: 'item-10',
    icon: 'sparkles',
    question: 'What happens after #HACK?',
    answer:
      'Depending on the individual teams and partnering organizations, further collaboration, internships, or paid work can be initiated.',
  },
  {
    id: 'item-11',
    icon: 'graduation-cap',
    question: 'Will there be mentors or facilitators?',
    answer:
      'Yes! You’ll have access to experienced mentors, facilitators, and thought leaders guiding your team through ideation, strategy, and execution.',
  },
  {
    id: 'item-12',
    icon: 'users-round',
    question: 'How are teams formed?',
    answer:
      'You can come with your team or join one at the event. We’ll help connect you with others who share similar passions or skills.',
  },
  {
    id: 'item-13',
    icon: 'target',
    question: 'What kind of challenges will we work on?',
    answer:
      'Real community challenges — from faith-driven outreach to tech-enabled solutions for social, spiritual, or local impact.',
  },
  {
    id: 'item-14',
    icon: 'link',
    question: 'How do I register?',
    answer:
      'Simply visit bit.ly/TheHackOgbomoso2025 and complete the sign-up form. You’ll receive a confirmation email with the next steps.',
  },
]
