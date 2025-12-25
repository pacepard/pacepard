import { Document, Types } from 'mongoose';
import { IUserDoc } from '../user/user.interface';
import { IWorkspaceDoc } from '../workspace/workspace.interface';
import { ISubscriptionDoc } from '../subscription/subscription.interface';
import { ITransactionDoc } from '../transaction/transaction.interface';
import { IHackathonDoc } from '../hackathon/hackathon.interface';
import { IEntryDoc } from '../entry/entry.interface';
import { ISubmissionDoc } from '../submission/submission.interface';
import { ISquadDoc } from '../squad/squad.interface';
import { IProjectDoc } from '../project/project.interface';
import { ITeamDoc } from '../team/team.interface';
import { ITaskDoc } from '../task/task.interface';
import { ITemplateDoc } from '../template/interface.template';

type ObjectId = Types.ObjectId;

export interface ITalentDoc extends Document {
    code: string;
    firstName: string;
    lastName: string;
    slug: string;
    email: string;

    specialties: Array<string>;
    intrests: Array<string>;
    skils: Array<string>;
    bio: string;

    gender: GenderType;
    dateOfBirth: string; // ISO Date

    occupation: OccupationType
    
    employment: {
        company: string;
        position: string;
        startDate: Date;
    };

    education: {
        institution: string;
        type: string
        degree: string;
        fieldOfStudy: string;
        startDate: Date;
        endDate: Date;
    };

    socials: Array<ISocials | any>;

    createdBy: ObjectId | any;
    settings: ObjectId | any;

    // relationships
    user: IUserDoc | any;
    workspaces: Array<IWorkspaceDoc | any>;
    subscription: ISubscriptionDoc | any;
    transactions: Array<ITransactionDoc | any>;
    templates: Array<ITemplateDoc | any>

    hackathons: Array<IHackathonDoc | any>;
    entries: Array<IEntryDoc | any>;
    submissions: Array<ISubmissionDoc | any>;
    squad: Array<ISquadDoc | any>;

    projects: Array<IProjectDoc | any>;
    teams: Array<ITeamDoc | any>;
    tasks: Array<ITaskDoc | any>;

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

export enum GenderType {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum OccupationType {
    STUDENT = 'student',
    PROFESSIONAL = 'professional',
    ENTREPRENEUR = 'entrepreneur',
    FREELANCER = 'freelancer',
    OTHER = 'other',
}