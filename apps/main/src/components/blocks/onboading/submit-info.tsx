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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@pacepard/ui/components/popover';
import { Checkbox } from '@pacepard/ui/components/checkbox';
import { cn } from '@pacepard/ui/lib/utils';

interface WorkType {
    value: string;
    label: string;
}

interface Role {
    value: string;
    label: string;
}

interface CompanySize {
    value: string;
    label: string;
}

interface PlanningOption {
    value: string;
    label: string;
}

const workTypes: WorkType[] = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'product', label: 'Product' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'operations', label: 'Operations' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' },
    { value: 'other', label: 'Other' },
];

const roles: Role[] = [
    { value: 'individual-contributor', label: 'Individual Contributor' },
    { value: 'team-manager', label: 'Team Manager' },
    { value: 'department-head', label: 'Department Head' },
    { value: 'executive', label: 'Executive' },
    { value: 'founder', label: 'Founder' },
    { value: 'other', label: 'Other' },
];

const companySizes: CompanySize[] = [
    { value: '1-49', label: '1-49' },
    { value: '50-249', label: '50-249' },
    { value: '250-999', label: '250-999' },
    { value: '1000-4999', label: '1000-4999' },
    { value: '5000+', label: '5000+' },
];

const planningOptions: PlanningOption[] = [
    { value: 'project-management', label: 'Project Management' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'team-wiki', label: 'Team Wiki' },
    { value: 'task-tracking', label: 'Task Tracking' },
    { value: 'meeting-notes', label: 'Meeting Notes' },
    { value: 'personal-notes', label: 'Personal Notes' },
    { value: 'database', label: 'Database' },
    { value: 'collaboration', label: 'Collaboration' },
];

export const SubmitInfo: React.FC = () => {
    const navigate = useNavigate();
    const [workType, setWorkType] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [companySize, setCompanySize] = useState<string>('');
    const [selectedPlanning, setSelectedPlanning] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPlanningOpen, setIsPlanningOpen] = useState(false);

    const handlePlanningToggle = (value: string) => {
        setSelectedPlanning((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const handleContinue = async () => {
        if (workType && role && companySize && selectedPlanning.length > 0) {
            setIsLoading(true);
            try {
                // TODO: Make API call to /user/onboard/step-2 with form data
                // For now, we'll just navigate to the next step
                // The API call can be added here
                
                // Navigate based on user type (this would come from context)
                // For now, navigate to talent-info as default
                navigate('/onboarding/talent-info');
            } catch (error) {
                console.error('Error submitting info:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        navigate('/onboarding/welcome');
    };

    const getPlanningDisplayText = () => {
        if (selectedPlanning.length === 0) {
            return 'Select options...';
        }
        if (selectedPlanning.length === 1) {
            const option = planningOptions.find((opt) => opt.value === selectedPlanning[0]);
            return option?.label || '1 selected';
        }
        return `${selectedPlanning.length} selected`;
    };

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen py-12 px-4">
            {/* Form Section */}
            <div className="w-full max-w-md mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-semibold text-foreground tracking-tight">
                        Tell us about yourself
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
                                {workTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
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

                    {/* Company Size */}
                    <div className="space-y-2.5">
                        <Label htmlFor="company-size" className="text-sm font-medium text-foreground">
                            What is the size of your company?
                        </Label>
                        <Select value={companySize} onValueChange={setCompanySize}>
                            <SelectTrigger 
                                id="company-size" 
                                className="w-full h-10 border-border/50 bg-background hover:border-border transition-colors"
                            >
                                <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                            <SelectContent>
                                {companySizes.map((size) => (
                                    <SelectItem key={size.value} value={size.value}>
                                        {size.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Planning Options - Multi-select */}
                    <div className="space-y-2.5">
                        <Label htmlFor="planning" className="text-sm font-medium text-foreground">
                            What are you planning to do in Pacepard?
                        </Label>
                        <Popover open={isPlanningOpen} onOpenChange={setIsPlanningOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    id="planning"
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        'w-full h-10 justify-between font-normal border-border/50 bg-background hover:border-border transition-colors',
                                        !selectedPlanning.length && 'text-muted-foreground'
                                    )}
                                >
                                    {getPlanningDisplayText()}
                                    <svg
                                        className="ml-2 h-4 w-4 shrink-0 opacity-50"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent 
                                className="w-[448px] max-w-[calc(100vw-2rem)] p-1 border-border/50 shadow-sm" 
                                align="start"
                                sideOffset={4}
                            >
                                <div className="max-h-[300px] overflow-y-auto">
                                    {planningOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            className="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-accent/50 cursor-pointer transition-colors"
                                            onClick={() => handlePlanningToggle(option.value)}
                                        >
                                            <Checkbox
                                                checked={selectedPlanning.includes(option.value)}
                                                onCheckedChange={() =>
                                                    handlePlanningToggle(option.value)
                                                }
                                                className="h-4 w-4"
                                            />
                                            <label
                                                className="text-sm font-normal cursor-pointer flex-1"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                    <Button
                        onClick={handleContinue}
                        disabled={
                            !workType ||
                            !role ||
                            !companySize ||
                            selectedPlanning.length === 0 ||
                            isLoading
                        }
                        className="w-full h-10 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Loading...' : 'Continue'}
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

export default SubmitInfo;
