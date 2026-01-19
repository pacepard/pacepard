import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@pacepard/ui/components/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@pacepard/ui/components/select';
import { Label } from '@pacepard/ui/components/label';

interface Specialty {
    value: string;
    label: string;
}

interface Interest {
    value: string;
    label: string;
}

interface Skill {
    value: string;
    label: string;
}

const specialties: Specialty[] = [
    { value: 'design', label: 'Design' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'product', label: 'Product' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'operations', label: 'Operations' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' },
    { value: 'other', label: 'Other' },
];

const roles: Interest[] = [
    { value: 'individual-contributor', label: 'Individual Contributor' },
    { value: 'team-lead', label: 'Team Lead' },
    { value: 'using-just-myself', label: 'Using Pacepard just for myself' },
    { value: 'freelancer', label: 'Freelancer' },
    { value: 'student', label: 'Student' },
    { value: 'other', label: 'Other' },
];

const discoveryOptions: Skill[] = [
    { value: 'reddit', label: 'Reddit' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'friend', label: 'Friend' },
    { value: 'search', label: 'Search Engine' },
    { value: 'blog', label: 'Blog' },
    { value: 'other', label: 'Other' },
];

const TalentIllustration = () => (
    <svg width="1440" height="810" viewBox="0 0 1440 810" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <rect width="1440" height="810" fill="url(#pattern0_201_13823)"/>
        <defs>
            <pattern id="pattern0_201_13823" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlinkHref="#image0_201_13823" transform="scale(0.000347222 0.000617284)"/>
            </pattern>
            <image id="image0_201_13823" width="2880" height="1620" preserveAspectRatio="none" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAC0AAAAZUCAYAAABy34MtAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAXRrSURBVHgB7N0LtB1lfT/8hxDDxYMCIpIIKkoSEQENiFVrQkBRCGBRKyCC2jdy06rhoi4raBNvNEAiy0IWpEWEmEQEFEiqRQhJWxCFgIAtSbApKkms3CRH7g3v+Y3s8z9Jzt4ze5/rc87ns9ZeOXtm9uy5PM8zk7W+89tbPN8hAQAAAAAAAAAAAABkYEQCAAAAAAAAAAAAAMiEADQAAAAAAAAAAAAAkA0BaAAAAAAAAAAAAAAgGwLQAAAAAAAAAAAAAEA2BKABAAAAAAAAAAAAgGwIQAMAAAAAAAAAAAAA2RCABgAAAAAAAAAAAACyIQANAAAAAAAAAAAAAGRDABoAAAAAAAAAAAAAyIYANAAAAAAAAAAAAACQDQFoAAAAAAAAAAAAACAbAtAAAAAAAAAAAAAAQDYEoAEAAAAAAAAAAACAbAhAAwAAAAAAAAAAAADZEIAGAAAAAAAAAAAAALIhAA0AAAAAAAAAAAAAZEMAGgAAAAAAAAAAAADIhgA0AAAAAAAAAAAAAJANAWgAAAAAAAAAAAAAIBsC0AAAAAAAAAAAAABANgSgAQAAAAAAAAAAAIBsCEADAAAAAAAAAAAAANkQgAYAAAAAAAAAAAAAsiEADQAAAAAAAAAAAABkQwBaAAAAAAAAAAAAAMiGADQAAAAAAAAAAAAAkA0BaAAAAAAAAAAAAAAgGwLQAAAAAAAAAAAAAEA2BKABAAAAAAAAAAAAgGwIQAMAAAAAAAAAAAAA2RCABgAAAAAAAAAAAACyIQANAAAAAAAAAAAAAGRDABoAAAAAAAAAAAAAyIYANAAAAAAAAAAAAACQDQFoAAAAAAAAAAAAACAbAtAAAAAAAAAAAAAAQDYEoAEAAAAAAAAAAACAbAhAAwAAAAAAAAAAAADZEIAGAAAAAAAAAAAAALIhAA0AAAAAAAAAAAAAZGNkgkFmw4YNaeXKlcVr/PjxxQsAAAAAAAAAAAAAggD0IPHss8+mBx54IC1dujT97Gc/S694xSvSF7/4xbTtttumZsV6brvttnTrrbemRx55JM2ePTvtsMMOKRcXXHBBOvPMM9Nzzz2XRowYkWbMmFEcCwAAAAAAAAAAAADY4vkOiX4VFY7/8z//M/385z9P99xzT/rFL36R7rzzzvTEE090LtPW1pZWr16ddtppp7rriVMXVZIj7Hzvvfem22+/vVhXe3t7RsstWbIkHXjggSkHTz/9dNp5553T448/3jlt++23L47X6NGjEwAAAAAAAAAAAADD2/8P5V0Y0vq0Vl0AAAAASUVORK5CYII="/>
        </defs>
    </svg>
);

export const TalentInfo: React.FC = () => {
    const navigate = useNavigate();
    const [workType, setWorkType] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [discovery, setDiscovery] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        if (workType && role && discovery) {
            setIsLoading(true);
            try {
                // TODO: Make API call to /user/onboard/step-3-talent with form data
                navigate('/onboarding/complete');
            } catch (error) {
                console.error('Error submitting talent info:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        navigate('/onboarding/submit-info');
    };

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen py-12 px-4 relative">
            {/* SVG Illustration - Background */}
            <div className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                    <TalentIllustration />
                </div>
            </div>

            {/* Form Section */}
            <div className="w-full max-w-md mx-auto space-y-8 z-10">
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-semibold text-foreground tracking-tight">
                        Tell us a bit about yourself
                    </h1>
                    <p className="text-base text-muted-foreground">
                        We'd love to get to know you better.
                    </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    {/* Work Type */}
                    <div className="space-y-2.5">
                        <Label htmlFor="work-type" className="text-sm font-medium text-foreground">
                            What kind of work do you do?
                        </Label>
                        <Select value={workType} onValueChange={setWorkType}>
                            <SelectTrigger 
                                id="work-type" 
                                className="w-full h-10 border-border/50 bg-background hover:border-border transition-colors"
                            >
                                <SelectValue placeholder="Select work type" />
                            </SelectTrigger>
                            <SelectContent>
                                {specialties.map((spec) => (
                                    <SelectItem key={spec.value} value={spec.value}>
                                        {spec.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Role */}
                    <div className="space-y-2.5">
                        <Label htmlFor="role" className="text-sm font-medium text-foreground">
                            What is your role?
                        </Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger 
                                id="role" 
                                className="w-full h-10 border-border/50 bg-background hover:border-border transition-colors"
                            >
                                <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((r) => (
                                    <SelectItem key={r.value} value={r.value}>
                                        {r.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Discovery */}
                    <div className="space-y-2.5">
                        <Label htmlFor="discovery" className="text-sm font-medium text-foreground">
                            How did you discover Pacepard?
                        </Label>
                        <Select value={discovery} onValueChange={setDiscovery}>
                            <SelectTrigger 
                                id="discovery" 
                                className="w-full h-10 border-border/50 bg-background hover:border-border transition-colors"
                            >
                                <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                                {discoveryOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                    <Button
                        onClick={handleContinue}
                        disabled={!workType || !role || !discovery || isLoading}
                        className="w-full h-10 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Loading...' : 'Continue to dashboard'}
                    </Button>
                    <button
                        onClick={handleBack}
                        className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TalentInfo;
