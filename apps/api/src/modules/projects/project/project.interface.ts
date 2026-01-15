import { Document, Types } from 'mongoose';
import { ITaskDoc } from '../task/task.interface';
import { IBlockDoc } from '../../../utils/blocks.interface';
import { IUserDoc } from '../../users/user/user.interface';
import { IWorkspaceDoc } from '../../core/workspace/workspace.interface';
import { IBusinessDoc } from '../../users/business/business.interface';

type ObjectId = Types.ObjectId;

export interface IProjectDoc extends Document {
    code: string;
    title: string;
    slug: string;
    tagline: string;
    description: string;

    items: Array<IBlockDoc>;
    documentation: string;

    category: string;
    tags: Array<string>;
    type: ProjectType;
    image: {
        fileName: string;
        s3Key: string;
    };

    createdBy: ObjectId | IUserDoc;
    status: ProjectStatus;
    publishedAt: Date;

    // State flags
    isOpen: boolean;
    isClosed: boolean;
    isPublic: boolean;
    isChallenge: boolean;

    // Relationships
    workspace: IWorkspaceDoc | any; // workspace the project belongs to
    business: IBusinessDoc | any; // business the project belongs to
    members: Array<IProjectMember>; // members of the project
    tasks: Array<ObjectId | ITaskDoc>; // tasks of the project

    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}

export enum ProjectType {
    PROJECT = 'project',
    CHALLENGE = 'challenge',
}

export enum ProjectStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    UNDER_REVIEW = 'under-review',
    PENDING = 'pending',
    CLOSED = 'closed',
}

export interface IProjectMember {
    user: IUserDoc;
    role: ProjectMemberRole;
    joinedAt: Date;
    invitedBy?: ObjectId | IUserDoc;
    status?: 'active' | 'inactive';
}

export enum DifficultyEnum {
    RANDOM = 'random',
    EASY = 'easy',
    NORMAL = 'normal',
    HARD = 'hard',
    DIFFICULT = 'difficult',
}

export enum ProjectMemberRole {
    OWNER = 'OWNER',
    MAINTAINER = 'MAINTAINER',
    CONTRIBUTOR = 'CONTRIBUTOR',
    SUBSCRIBER = 'SUBSCRIBER',
}
