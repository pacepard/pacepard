'use client'

import { FC } from 'react'

import Image from 'next/image'

import { type LucideIcon } from 'lucide-react'

interface PersonaCardProps {
  title?: string
  image?: string
  description?: string
  bgColor?: string
  features: Array<{
    icon: LucideIcon
    label: string
  }>
}

export const PersonaCard: FC<PersonaCardProps> = ({
  title,
  description,
  image,
  bgColor,
  features,
}) => {
  return (
    <div className="flex flex-col group">
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1 pr-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-blue-600">
            {title}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed transition-colors duration-300 group-hover:text-gray-900">
            {description}
          </p>
        </div>

        
        <div
          className={`flex-shrink-0 w-28 h-28 rounded-full bg-gradient-to-br ${bgColor} flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-200 animate-pulse-subtle`}
        >
          {/* Use standard <img> tag for the image */}
            {image && (
              <Image
                src={image}
                alt={`${title} illustration`}
                width={20}
                height={20}
                className="w-full h-full object-cover transition-opacity duration-500 opacity-90 group-hover:opacity-100"
              />
            )}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 tracking-widest mb-3 transition-colors duration-300 group-hover:text-gray-700">
          KEY FEATURES
        </p>
        
        <div className="space-y-2">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="flex items-center gap-3 transition-all duration-300 group-hover:translate-x-1"
                style={{
                  transitionDelay: `${idx * 50}ms`,
                }}
              >
                <Icon className="w-5 h-5 text-gray-700 flex-shrink-0 transition-colors duration-300 group-hover:text-blue-600" />
                <span className="text-sm text-gray-700 transition-colors duration-300 group-hover:text-gray-900 font-medium">
                  {feature.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
