import { Button } from '@pacepard/ui/components/button';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

interface IAuthHeader {
    title: string;
    description?: string;
    buttonLabel?: string;
    onButtonClick?: () => void;
}

const AuthHeader = (props: IAuthHeader) => {
    const {
        title,
        description = '',
        buttonLabel = '',
        onButtonClick = () => {},
    } = props;

    useEffect(() => {}, []);
    return (
        <>
            <div className="px-6 py-2 text-start w-full">
                <h1 className="text-xl font-semibold">{title}</h1>

                {description && (
                    <div className="mt-2 flex items-center justify-start hover:space-x-1">
                        <p className="text-muted-foreground">{description}</p>

                        {buttonLabel && (
                            <Button
                                variant="link"
                                onClick={onButtonClick}
                                className="inline-flex items-center border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 hover:no-underline"
                            >
                                {buttonLabel}
                                <ArrowRight className=" h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default AuthHeader;
