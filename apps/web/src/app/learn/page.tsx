import { Background } from '@/components/background';
import ClCta from '@/components/collective/cl-cta';
import ClHero from '@/components/collective/cl-hero';
import ClTestimonials from '@/components/collective/cl-testimonials';
import ClTracks from '@/components/collective/cl-tracks';
import PPApprenticeship from '@/components/pacepard/pp-apprenticship';
import PPAgentUsecases from '@/components/pacepard/pp-agent-usecases';
import PPLovedBy from '@/components/pacepard/pp-lovedby';
import PpGoCTA from '@/components/collective/cta';

const Collective = () => {
    return (
        <>
            <ClHero />

            <ClTracks />

            <Background>

                <PPLovedBy/>
                <PpGoCTA/>
                <PPApprenticeship />
                <PPAgentUsecases />
             
                {/* <PPCollective /> */}
                {/* <ClUsecase /> */}

                <PpGoCTA/>
                <ClTestimonials />
                {/* <ClFAQ /> */}

                <ClCta />
                {/* 
          
                <ClFeatures /> */}
            </Background>
            {/* 
            <ClPricing /> */}
        </>
    );
};

export default Collective;
