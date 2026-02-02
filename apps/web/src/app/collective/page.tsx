import { Background } from '@/components/background';
import ClCta from '@/components/collective/cl-cta';
import ClHero from '@/components/collective/cl-hero';
import ClFeatures from '@/components/collective/cl-features';
import ClPricing from '@/components/collective/cl-pricing';
import ClTestimonials from '@/components/collective/cl-testimonials';
import ClFAQ from '@/components/collective/cl-faq';
import Separator from '@/components/collective/separator';
import ClUsecase from '@/components/collective/cl-usecase';

const Collective = () => {
    return (
        <>
            <ClHero />

            <Background>
                {/* <Separator /> */}
                <ClFeatures />
                <ClUsecase />
                <ClCta />
                <ClTestimonials />
                <ClFAQ />

            </Background>

            <ClPricing />
        </>
    );
};

export default Collective;
