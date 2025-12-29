import { Model, Document, Types } from 'mongoose';

// Use Mongoose's Types.ObjectId for interface compatibility
export type ObjectId = Types.ObjectId;

export interface IInvitationDoc extends Document {
    inviteType: InvitationType; // as a mentor/team
    invitedBy: ObjectId;

    // invitee: { email: string; userId: ObjectId };
    inviteeEmail: string;
    inviteeUserId: ObjectId;
    invitedAt: Date;
    inviteToken: string | null;
    inviteStatus: InvitationStatus;

    resourceId: ObjectId;

    expiresAt: Date;
    acceptedAt: Date;
    revokedAt: Date;

    metadata: Record<string, unknown>;

    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    Id: ObjectId;
}

//ENUMS

export enum InvitationType {
    TEAM = 'teamInvite',
    MENTOR = 'mentorInvite',
    ADMIN = 'adminInvite',
    PROJECT = 'projectInvite',
    WORKSPACE = 'workspaceInvite'
}

export enum InvitationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
    EXPIRED = 'expired',
    REVOKED = 'revoked',
}

export enum InviteSendType {
    BULK = 'bulk',
    SINGLE = 'single',
}
