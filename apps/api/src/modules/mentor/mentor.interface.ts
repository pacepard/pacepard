import { Document, Types } from 'mongoose';

type ObjectId = Types.ObjectId;

export interface IMentorDoc extends Document {
    // time stamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
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
