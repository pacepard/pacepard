import { Background } from '@/components/background';
import ClCta from '@/components/collective/cl-cta';
import ClHero from '@/components/collective/cl-hero';
import ClFeatures from '@/components/collective/cl-features';
import ClPricing from '@/components/collective/cl-pricing';
import ClTestimonials from '@/components/collective/cl-testimonials';
import ClFAQ from '@/components/collective/cl-faq';
import ClUsecase from '@/components/collective/cl-usecase';
import ClTracks from '@/components/collective/cl-tracks';

const Collective = () => {
    return (
        <>
            <ClHero />

            <ClTracks />
            <Background>
                <ClUsecase />
                <ClCta />
                <ClTestimonials />
                <ClFAQ />
                 {/* 
          
                <ClFeatures /> */}
            </Background>

            <ClPricing />
        </>
    );
};

export default Collective;
