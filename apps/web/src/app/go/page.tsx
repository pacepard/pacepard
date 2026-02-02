import { Background } from '@/components/background';
import GoFAQ  from '@/components/go/go-faq';
import GoFeatures from '@/components/go/go-features';
import GoHero from '@/components/go/go-hero';
import GoUsecase from '@/components/go/go-usecase';

const Go = () => {
    return (
        <>
            <GoHero />

            <Background>
                <GoFeatures/>
                <GoUsecase/>
                <GoFAQ/>
            </Background>
        </>
    );
};

export default Go;
