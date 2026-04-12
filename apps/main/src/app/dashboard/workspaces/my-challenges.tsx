import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@pacepard/ui/components/button';

const MyChallenges = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-foreground">
                    My Challenges
                </h1>
                <Button
                    onClick={() => navigate('/challenge/create')}
                    className="bg-[#333234] hover:bg-[#333234]/90 text-[#eaeaea] rounded-md h-10 px-5 gap-2"
                >
                    <Plus className="h-4 w-4" />
                    New challenge
                </Button>
            </div>
            <p className="text-muted-foreground">
                No challenges yet. Create one to get started.
            </p>
        </div>
    );
};

export default MyChallenges;
