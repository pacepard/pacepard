import { Button } from '@pacepard/ui/components/button';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { useEffect } from 'react';

interface IPageHeader {
    title: string;
    description?: string;
    buttonLabel?: string;
    onButtonClick?: () => void;
}

const AuthHeader = (props: IPageHeader) => {
    const {
        title,
        description = '',
        buttonLabel = '',
        onButtonClick = () => {},
    } = props;

    useEffect(() => {}, []);
    return (
        <>
            <div className="p-6 text-start w-full">
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
                                <ArrowRightIcon className=" h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default AuthHeader;
