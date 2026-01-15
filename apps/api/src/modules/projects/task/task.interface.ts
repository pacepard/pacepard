import { Document, Types } from 'mongoose';
import { IUserDoc } from '../../users/user/user.interface';

export enum TaskDifficulty {
    EASY = 'easy',
    NORMAL = 'normal',
    HARD = 'hard',
    EXPERT = 'expert',
}

type ObjectId = Types.ObjectId;

export interface ITaskDoc extends Document {
    code: string;
    title: string;
    description: string;

    // Strict Hierarchy
    workspaceId: ObjectId;
    businessId: ObjectId;
    projectId: ObjectId;
    teamId: ObjectId;

    // Status & Work
    status: TaskStatusType;
    priority: TaskPriorityType;
    points: number;

    // Assignment
    assignedTo: Array<IUserDoc | ObjectId>;
    createdBy: ObjectId;

    // Metadata
    tags: Array<string>;
    dueDate: Date;
    completedAt: Date;
    image: {
        fileName: string;
        s3Key: string;
    };

    // System
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}

export enum TaskStatusType {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    IN_REVIEW = 'in_review',
    DONE = 'done',
    BLOCKED = 'blocked',
}

export enum TaskPriorityType {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}
