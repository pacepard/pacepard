'use client'

import { mentors, mentorSection } from "@/_data/hack/mentors"



const MentorSection = () => {
  return (
    <section className="py-16 pt-20 md:py-32 dark:bg-[#171717]">
      <div className="mx-auto max-w-5xl px-6">
        {/* Heading */}
        <div className="mt-16 gap-4 sm:grid sm:grid-cols-2">
          <div className="sm:w-2/5">
            <h2 className="text-title text-3xl font-bold sm:text-4xl">
              {mentorSection.title}
            </h2>
          </div>
          <div className="mt-6 sm:mt-0">
            <p>{mentorSection.description}</p>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="mt-24">
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="group overflow-hidden">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  width={826}
                  height={1239}
                  className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl"
                />
                <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                  <div className="flex justify-between">
                    <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">
                      {mentor.name}
                    </h3>
                    <span className="text-xs">{mentor.index}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="inline-block translate-y-6 text-sm transition duration-300 group-hover:translate-y-0">
                      {mentor.role}
                    </span>
                    <a
                      href={mentor.link}
                      className="inline-block translate-y-8 text-sm tracking-wide transition-all duration-500 group-hover:translate-y-0 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                    >
                      Linkedin
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MentorSection
