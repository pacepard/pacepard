import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@pacepard/ui/components/button';
import { Card, CardContent } from '@pacepard/ui/components/card';
import { 
    CheckCircle, 
    Circle,
} from '@phosphor-icons/react';
import { cn } from '@pacepard/ui/lib/utils';
import { UserType, UserContext } from '@pacepard/sdk';

interface UserTypeOption {
    id: UserType;
    title: string;
    description: string;
    image: string;
    alt: string;
}

const userTypeOptions: UserTypeOption[] = [
    {
        id: UserType.BUSINESS,
        title: 'For workplace',
        description: 'Run memorable hackthons, turn developers into loyal customers',
        image: '/items/Planning-A-Trip.png',
        alt: 'Workplace collaboration illustration',
    },
    {
        id: UserType.TALENT,
        title: 'For personal use',
        description: 'Build mastery, work on real projects, and get paid for it',
        image: '/items/Peace.png',
        alt: 'Personal development illustration',
    },
    {
        id: UserType.USER,
        title: 'For Education',
        description: 'Organise in-house internships, and scale learning outcomes',
        image: '/items/Affiliate-Program.png',
        alt: 'Education and learning illustration',
    },
];

export const Welcome: React.FC = () => {
    const [selectedType, setSelectedType] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUserType } = useContext(UserContext) || {};

    const handleContinue = async () => {
        if (selectedType && setUserType) {
            setIsLoading(true);
            try {
                // Store the selected user type in context
                setUserType(selectedType);
                
                // TODO: Make API call to /user/onboard/step-1 with { userType: selectedType }
                // For now, we'll just navigate to the next step
                // The API call can be added here or in the next step component
                
                navigate('/onboarding/submit-info');
            } catch (error) {
                console.error('Error setting user type:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-2 w-full max-w-3xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                    How are you planning to use Pacepard?
                </h1>
                <p className="text-lg text-muted-foreground">
                    We'll streamline your setup experience accordingly.
                </p>
            </div>

            {/* User Type Selection Cards - Using Flex */}
            <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 w-full max-w-4xl mx-auto md:px-4">
                {userTypeOptions.map((option, index) => {
                    const isSelected = selectedType === option.id;

                    return (
                        <Card
                            key={`${option.id}-${index}`}
                            className={cn(
                                'relative cursor-pointer transition-all duration-200 hover:shadow-md',
                                'flex-1 basis-0', // Equal distribution with basis-0
                                'min-w-[280px] md:min-w-0', // Min width on mobile only
                                'max-w-[380px]', // Max width to prevent cards from getting too wide
                                isSelected
                                    ? 'border-primary border-2 shadow-md'
                                    : 'border-border hover:border-primary/50'
                            )}
                            onClick={() => setSelectedType(option.id)}
                        >
                            {/* Selection Indicator */}
                            <div className="absolute top-4 right-4 z-10">
                                {isSelected ? (
                                    <CheckCircle
                                        className="size-6 text-primary fill-primary"
                                        weight="fill"
                                    />
                                ) : (
                                    <Circle
                                        className="size-6 text-muted-foreground"
                                        weight="regular"
                                    />
                                )}
                            </div>

                            <CardContent className="pt-6 pb-6 px-6 h-full">
                                <div className="flex flex-col items-center text-center space-y-4 h-full">
                                    {/* Image */}
                                    <div
                                        className={cn(
                                            'w-full flex items-center justify-center transition-all duration-200 flex-shrink-0',
                                            isSelected
                                                ? 'scale-105'
                                                : 'scale-100'
                                        )}
                                    >
                                        <img
                                            src={option.image}
                                            alt={option.alt}
                                            className={cn(
                                                'w-full h-auto object-contain',
                                                'max-h-[180px] md:max-h-[200px]',
                                                isSelected
                                                    ? 'opacity-100'
                                                    : 'opacity-80'
                                            )}
                                        />
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className={cn(
                                            'text-xl font-semibold',
                                            isSelected
                                                ? 'text-foreground'
                                                : 'text-foreground'
                                        )}
                                    >
                                        {option.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground">
                                        {option.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Continue Button */}
            <div className="w-full flex justify-center pt-4">
                <Button
                    onClick={handleContinue}
                    disabled={!selectedType || isLoading}
                    size="lg"
                    className="min-w-[200px]"
                >
                    {isLoading ? 'Loading...' : 'Continue'}
                </Button>
            </div>
        </div>
    );
};

export default Welcome;
