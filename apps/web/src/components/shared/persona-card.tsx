'use client'

import { FC } from 'react'

import Image from 'next/image'

import { motion } from 'motion/react' // Import motion
import { type LucideIcon } from 'lucide-react'

interface IPersonaCard {
    title?: string
    image?: string
    description?: string
    bgColor?: string // Added for completeness, although not used in the return JSX
    features?: { icon: LucideIcon, label: string }[] // Added for completeness
}

const PersonaCard: FC<IPersonaCard> = (data) => {

    const {
        title,
        description,
        image,
    } = data

    return (
        <motion.div // Use motion.div for animation/interaction
            className="flex flex-col group"
            whileHover={{ y: -5 }} // Lift the card slightly on hover
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <div className="mb-8 flex items-start gap-4 md:gap-2">
                <div className="min-w-0 flex-1">
                    <h2 className="font-text text-muted-foreground text-lg mb-2 transition-colors duration-300 group-hover:primary">
                        {title}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-gray-900">
                        {description}
                    </p>
                </div>


                <div className="w-20 h-20 flex-shrink-0">
                    {image && (
                        <Image
                            src={image}
                            alt={`${title} illustration`}
                            width={80}
                            height={80}
                            className="w-full h-full object-contain transition-opacity duration-500 opacity-90 group-hover:opacity-100"
                        />
                    )}
                </div>
            </div>

            <div>
                {/* Assuming features would be rendered here in a complete component */}
            </div>
        </motion.div>
    )
}

export default PersonaCard