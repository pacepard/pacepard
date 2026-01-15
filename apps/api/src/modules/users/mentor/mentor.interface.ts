import { Document, Types } from 'mongoose';
import { IUserDoc } from '../user/user.interface';
import { IHackathonDoc } from '../../hackathons/hackathon/hackathon.interface';
import { IEntryDoc } from '../../hackathons/entry/entry.interface';
import { IProjectDoc } from '../../projects/project/project.interface';
import { IWorkspaceDoc } from '../../core/workspace/workspace.interface';

type ObjectId = Types.ObjectId;

// Mentors are profiles that can mentor entries, submissions in hackathons, and projects
// They contain profile information, expertise areas, and relationships to hackathons, entries, and projects
// They are used to manage the lifecycle of a mentor profile
export interface IMentorDoc extends Document {
    code: string;
    firstName: string;
    lastName: string;
    slug: string;
    email: string;

    bio: string;
    jobTitle: string;
    organization: string;
    areasOfExpertise: Array<string>;
    yearsOfExperience: string;
    socials: Array<ISocials | any>;
    
    image: {
        fileName: string;
        s3Key: string;
    };

    mentorType: MentorTypeEnum;
    visibility: MentorVisibiltyEnum;
    status: MentorStatusEnum;
    inviteStatus: MentorInviteStatus;

    // ownership
    createdBy: IUserDoc | any;

    settings: {
        // Additional settings can be added here
    };

    // relationships
    user: IUserDoc | any; // user this mentor profile belongs to
    hackathons: Array<IHackathonDoc | any>; // hackathons this mentor is assigned to
    entries: Array<IEntryDoc | any>; // entries this mentor is mentoring
    projects: Array<IProjectDoc | any>; // projects this mentor is mentoring
    workspace: Array<IWorkspaceDoc | any>; // workspaces this mentor belongs to

    // time stamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}

export enum MentorTypeEnum {
    ENTRY = 'entry',
    SUBMISSION = 'submission',
    PROJECT = 'project',
    HACKATHON = 'hackathon',
}


export interface ISocials {
    name: string;
    url: string;
    username: string;
}

export enum MentorVisibiltyEnum {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

export enum MentorStatusEnum {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum MentorInviteStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
}
