import { Document, Types } from 'mongoose';
import { IUserDoc } from '../../users/user/user.interface';
import { IFormDoc } from '../../core/forms/form.interface';
import { ISubmissionDoc } from '../../hackathons/submission/submission.interface';
import { IHackathonDoc } from '../../hackathons/hackathon/hackathon.interface';

type ObjectId = Types.ObjectId;

// Entries are the top level container for a entry
// They contain forms, submissions, mentors, judges, and members
// They are used to manage the lifecycle of a entry
export interface IEntryDoc extends Document {
    code: string;

    // configuration
    name: string;
    slug: string;
    description: string;
    image: string;
    tags: Array<string>;
    category: string;

    entryType: EntryType;
    status: EntryStatusType;
    createdBy: IUserDoc | any;

    settings: {
        transferOwnershipTo: IUserDoc | any;
    };

    hackathon: Array<IHackathonDoc | any>; // an entry can belong to multiple hackathons except it has won an hack
    forms: Array<IFormDoc | any>; // forms used for this entry
    submissions: Array<ISubmissionDoc | any>; // forms used for this entry

    members: Array<IUserDoc | any>; // team members putting the entry
    mentors: Array<IUserDoc | any>;

    // time stamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}

export enum EntryType {
    INDIVIDUAL = 'individual',
    TEAM = 'team',
}

export enum EntryStatusType {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
    DISQUALIFIED = 'disqualified',
}
