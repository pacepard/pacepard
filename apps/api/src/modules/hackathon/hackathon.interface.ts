import { Document, Types } from 'mongoose';
import { IWorkspaceDoc } from '../workspace/workspace.interface';
import { IBusinessDoc } from '../business/business.interface';
import { IEntryDoc } from '../entry/entry.interface';
import { ISubmissionDoc } from '../submission/submission.interface';
import { IUserDoc } from '../user/user.interface';
import { FormType, IFormDoc } from '../forms/form.interface';

type ObjectId = Types.ObjectId;

// Hackathons are the top level container for a hackathon
// They contain forms, entries, submissions, mentors, judges, and members
// They are used to manage the lifecycle of a hackathon
export interface IHackathonDoc extends Document {
    code: string;

    // configuration
    name: string;
    slug: string;
    description: string;
    image: string;

    status: HackStatusType;
    type: HackathonType;

    // ownership
    createdBy: IUserDoc | any; // owner of hackathon
    settings: {
        language: string;

        startTime: string;
        startDate: string;
        startTimeZone: string;

        isClosed: string;
        closeTime: string;
        closeDate: string;
        closeTimeZone: string;
        closeMessageTitle: string;
        closeMessageDescription: string;

        redirectOnClose: string;
    };

    // context
    formtype: FormType; //onboarding, entiries + submission , feedback, mentor, judging,

    // relationships
    workspace: IWorkspaceDoc | any; // workspace that a hackathon belong to

    forms: Array<IFormDoc | any>; // forms that is used in a hackathon
    entries: Array<IEntryDoc | any>; // entriies to an hacothon
    submissions: Array<ISubmissionDoc | any>; // submissions to an hacothon

    members: Array<IUserDoc | any>; // assigned members of a workspace who can manage a hackathon
    mentors: Array<IUserDoc | any>; // mentors of a hackathon
    judges: Array<IUserDoc | any>; // judges of a hackathon

    // time stamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}

export enum HackathonType {
    ONLINE = 'online',
    OFFLINE = 'offline',
    IN_PERSON = 'in-person',
    HYBRID = 'hybrid',
    GLOBAL = 'global',
    NATIONAL = 'national',
    INTERNATIONAL = 'international',
    REGIONAL = 'regional',
    LOCAL = 'local',
}

export enum HackStatusType {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    CLOSED = 'closed',
    ARCHIVED = 'archived',
}
