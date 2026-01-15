import { Document, Types } from 'mongoose';
import { IUserDoc } from '../user/user.interface';
import { IHackathonDoc } from '../../hackathons/hackathon/hackathon.interface';
import { IProjectDoc } from '../../projects/project/project.interface';
import { IWorkspaceDoc } from '../../core/workspace/workspace.interface';

type ObjectId = Types.ObjectId;

// Judges are profiles that can judge submissions in hackathons and projects
// They contain profile information, expertise areas, and relationships to hackathons and projects
// They are used to manage the lifecycle of a judge profile
export interface IJudgeDoc extends Document {
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

    visibility: JudgeVisibiltyEnum;
    status: JudgeStatusEnum;
    inviteStatus: JudgeInviteStatus;

    // ownership
    createdBy: IUserDoc | any;

    settings: {
        // Additional settings can be added here
    };

    // relationships
    user: IUserDoc | any; // user this judge profile belongs to
    hackathons: Array<IHackathonDoc | any>; // hackathons this judge is assigned to
    projects: Array<IProjectDoc | any>; // projects this judge is assigned to
    workspace: Array<IWorkspaceDoc | any>; // workspaces this judge belongs to
    

    // time stamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}


export interface ISocials {
    name: string;
    url: string;
    username: string;
}

export enum JudgeVisibiltyEnum {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

export enum JudgeStatusEnum {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum JudgeInviteStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
}
