import React from 'react';
import { useParams } from 'react-router-dom';

const EditChallenge = () => {
    const { slug } = useParams<{ slug: string }>();

    if (!slug) {
        return (
            <div className="p-6">
                <p className="text-destructive">Missing challenge slug</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold">Edit Challenge</h1>
                <p className="text-muted-foreground mt-1">Slug: {slug}</p>
            </header>
        </div>
    );
};

export default EditChallenge;
