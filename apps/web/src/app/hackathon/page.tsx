import { Background } from '@/components/background';
import GoFAQ  from '@/components/go/go-faq';
import GoFeatures from '@/components/go/go-features';
import GoHero from '@/components/go/go-hero';
import GoUsecase from '@/components/go/go-usecase';
import GoCTA from '@/components/go/go-cta';
import ClCta from '@/components/collective/cl-cta';

const Go = () => {
    return (
        <>
            <GoHero />

            <Background>
                <GoFeatures/>
                <GoUsecase/>
                <GoFAQ/>
                <GoCTA/>
            </Background>
        </>
    );
};

export default Go;
