import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectEditor = () => {
    const { slug } = useParams<{ slug: string }>();

    if (!slug) {
        return (
            <div className="p-6">
                <p className="text-destructive">Missing project slug</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold">Edit Project</h1>
                <p className="text-muted-foreground mt-1">Slug: {slug}</p>
                <p className="text-muted-foreground text-sm mt-1">
                    Wire load/update by slug when project API is mounted.
                </p>
            </header>
        </div>
    );
};

export default ProjectEditor;
