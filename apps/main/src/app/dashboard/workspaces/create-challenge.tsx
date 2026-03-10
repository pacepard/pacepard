import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateChallenge = () => {
    const navigate = useNavigate();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold">New Challenge</h1>
            <p className="text-muted-foreground mt-1">Create a new challenge. Wire to challenge API when available.</p>
            <button
                type="button"
                onClick={() => navigate('/challenge')}
                className="mt-4 text-sm text-primary hover:underline"
            >
                Back to challenges
            </button>
        </div>
    );
};

export default CreateChallenge;

