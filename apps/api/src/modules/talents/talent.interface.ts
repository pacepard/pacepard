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

<<<<<<< HEAD
=======

>>>>>>> af983945d9f8cb5ed1b44582a235135877f343b3
    specialties: Array<string>; // what kind of work do you do?
    intrests: Array<string>;
    skils: Array<string>; // skills you have
    bio: string;

    gender: GenderType;
    dateOfBirth: string; // ISO Date

<<<<<<< HEAD
    occupation: OccupationType;

=======
    occupation: OccupationType
    
>>>>>>> af983945d9f8cb5ed1b44582a235135877f343b3
    employment: {
        company: string;
        position: string;
        startDate: Date;
    };

    education: {
        institution: string;
<<<<<<< HEAD
        type: string;
=======
        type: string
>>>>>>> af983945d9f8cb5ed1b44582a235135877f343b3
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
    roles: Array<ITalentType | any>;

<<<<<<< HEAD
    workspaces: Array<IWorkspaceDoc | any>;
    subscription: ISubscriptionDoc | any;
    trial: { hasUsedTrial: boolean; planCode: string; usedAt: Date };
    transactions: Array<ITransactionDoc | any>;
    templates: Array<ITemplateDoc | any>;
=======

    workspaces: Array<IWorkspaceDoc | any>;
    subscription: ISubscriptionDoc | any;
    transactions: Array<ITransactionDoc | any>;
    templates: Array<ITemplateDoc | any>
>>>>>>> af983945d9f8cb5ed1b44582a235135877f343b3

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

export enum ITalentType {
    MENTOR = 'mentor',
    JUDGE = 'judge',
<<<<<<< HEAD
}
=======

}
>>>>>>> af983945d9f8cb5ed1b44582a235135877f343b3
