import { Background } from '@/components/background';
import ClCta from '@/components/collective/cl-cta';
import ClHero from '@/components/collective/cl-hero';
import ClTestimonials from '@/components/collective/cl-testimonials';
import ClFAQ from '@/components/collective/cl-faq';
import ClTracks from '@/components/collective/cl-tracks';
import PPCollective from '@/components/pacepard/pp-collective';

const Collective = () => {
    return (
        <>
            <ClHero />

            <ClTracks />
            <Background>
                <PPCollective />
                {/* <ClUsecase /> */}
                <ClCta />
                <ClTestimonials />
                <ClFAQ />

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
