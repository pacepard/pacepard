import ChallengeAreas from "@/components/hack/containers/challenge-areas"
import EntryRequirements from "@/components/hack/containers/entry-req"

const Requirements = () => {
  return (


    //bg-[#171717] text-white py-16 pt-20 md:py-32 dark:bg-[#171717]
    <section className="bg-black text-white py-16 pt-20 md:py-32 px-6 md:px-40">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {/* Entry Requirements */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Entry Requirements
          </h2>
          
         
          <div className="bg-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-md shadow-sm">
            <EntryRequirements />
          </div>
        </div>

        {/* Challenge Areas */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold">
            #HACK2025 Global Challenges
          </h2>
          <div className="bg-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-md shadow-sm">
            <ChallengeAreas />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Requirements
