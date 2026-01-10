import { Types, Document } from 'mongoose';
import { IUserDoc } from '../user/user.interface';
import { IAdminDoc } from '../admin/admin.interface';
import { IWorkspaceDoc } from '../workspace/workspace.interface';
import { ISubscriptionDoc } from '../subscription/subscription.interface';
import { ITransactionDoc } from '../transaction/transaction.interface';
import { IHackathonDoc } from '../hackathon/hackathon.interface';
import { IEntryDoc } from '../entry/entry.interface';
import { ISubmissionDoc } from '../submission/submission.interface';
import { IProjectDoc } from '../project/project.interface';
import { ITeamDoc } from '../team/team.interface';
import { ITaskDoc } from '../task/task.interface';
import { IDomainDoc } from '../domain/domain.interface';
import { ITemplateDoc } from '../template/interface.template';
import { IDiscoveryDoc } from '../discovery/discovery.interface';
import { IPlanDoc } from '../plan/plan.interface';

type ObjectId = Types.ObjectId;

export interface IBusinessDoc extends Document {
    code: string; // business public ID
    firstName: string;
    lastName: string;
    slug: string;
    email: string;

    businessName: string;
    businessType: BusinessType;
    description: string;
    size: string;
    industry: string; // category
    tags: Array<string>;
    website: string;
    socials: Array<ISocials | any>;

    verification: Iverification;
    registration: IBusinessRegistration;
    verifiedBy: IAdminDoc | any;
    isPublic: boolean; // Only set to true AFTER verification

    createdBy: ObjectId | any;
    settings: Array<string>;

    
    // relationships
    user: IUserDoc | any;
    workspaces: Array<IWorkspaceDoc | any>;
    subscription: ISubscriptionDoc | any;
    trial: { hasUsedTrial: boolean; planCode: string; usedAt: Date };

    transactions: Array<ITransactionDoc | any>;

    discovery: Array<IDiscoveryDoc | any>;
    customDomain: Array<IDomainDoc | any>;
    templates: Array<ITemplateDoc | any>;

    hackathons: Array<IHackathonDoc | any>;
    entries: Array<IEntryDoc | any>;
    submissions: Array<ISubmissionDoc | any>;

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

export interface IBusinessRegistration {
    RegisteredBusinessName: string;
    registrationNumber: string;
    registrationDate: Date;
    registrationCountry: string;
}

export interface Iverification {
    status: VerificationType;
    verifiedBy: IAdminDoc | any;
    verifiedAt: Date;
    reason: string;
}

export enum VerificationType {
    UNVERIFIED = 'unverified',
    PENDING = 'pending',
    VERIFIED = 'verified',
    REJECTED = 'rejected',
}

export enum BusinessType {
    COMPANY = 'company',
    NONPROFIT = 'non-profit',
    GOVERNMENT = 'government',
    EDUCATION = 'education',
    PARTNER = 'partner',
    OTHER = 'other',
}
