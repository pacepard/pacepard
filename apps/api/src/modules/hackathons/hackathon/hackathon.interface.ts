import { Document, Types } from 'mongoose';
import { IWorkspaceDoc } from '../../core/workspace/workspace.interface';
import { IBusinessDoc } from '../../users/business/business.interface';
import { IEntryDoc } from '../entry/entry.interface';
import { ISubmissionDoc } from '../submission/submission.interface';
import { IUserDoc } from '../../users/user/user.interface';
import { FormType, IFormDoc } from '../../core/forms/form.interface';

type ObjectId = Types.ObjectId;

// Hackathons are the top level container for a hackathon
// They contain forms, entries, submissions, mentors, judges, and members
// They are used to manage the lifecycle of a hackathon
export interface IHackathonDoc extends Document {
    code: string;
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
    business: IBusinessDoc | any; // business that a hackathon belong to

    forms: Array<IFormDoc | any>; // forms that is used in a hackathon
    entries: Array<IEntryDoc | any>; // entriies to an hacothon
    submissions: Array<ISubmissionDoc | any>; // submissions to an hacothon

    members: Array<IHackathonMember>; // assigned members of a workspace who can manage a hackathon
    mentors: Array<IHackathonMentor>; // mentors of a hackathon
    judges: Array<IHackathonJudge>; // judges of a hackathon
    organizers: Array<IHackathonOrganizer>; // organizers of a hackathon

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

export interface IHackathonMember {
    user: ObjectId | IUserDoc;
    role: HackathonMemberRole;
    joinedAt: Date;
    assignedBy?: ObjectId;
}

export interface IHackathonMentor {
    user: ObjectId | IUserDoc;
    assignedAt: Date;
    assignedBy: ObjectId;
    status?: 'active' | 'inactive';
}

export interface IHackathonJudge {
    user: ObjectId | IUserDoc;
    assignedAt: Date;
    assignedBy: ObjectId;
    status?: 'active' | 'inactive';
}

export interface IHackathonOrganizer {
    user: ObjectId | IUserDoc;
    assignedAt: Date;
    assignedBy: ObjectId;
}

export enum HackathonMemberRole {
    OWNER = 'OWNER', // Created the hackathon
    ORGANIZER = 'ORGANIZER', // Can manage hackathon but not delete
}
