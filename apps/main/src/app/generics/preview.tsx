import { LinkPreview, ShareLink, ShareTabs } from "@/components/blocks/activity";
import LoginForm from "@/components/blocks/auth/login-form";
import Trigger from "@/components/blocks/navigation/trigger";
import MainLoader from "./main-loader";
import { EmptyState } from "@pacepard/ui";


const Preview = () => {

    return (
        <div className="flex items-center justify-center min-h-screen">

            
            
            <div className="w-full max-w-md sm:w-full">

                {/* <Trigger /> */}

                {/* <LoginForm/> */}

                <MainLoader/>

                <LinkPreview/>

                <EmptyState/>

                <div className="mt-10"></div>

                <ShareLink/>
                <ShareTabs/>


            </div>
        </div>
    );
};

export default Preview;
