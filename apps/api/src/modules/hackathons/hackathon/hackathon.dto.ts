import { IUserDoc } from '../../users/user/user.interface';
import {
    HackStatusType,
    HackathonType,
    HackathonMemberRole,
} from './hackathon.interface';

export interface CreateHackathonDTO {
    name: string;
    description: string;
    type?: HackathonType;
    workspaceId: string;
    businessId?: string;
    image?: string;
    settings?: {
        language?: string;
        startTime?: string;
        startDate?: string;
        startTimeZone?: string;
        isClosed?: string;
        closeTime?: string;
        closeDate?: string;
        closeTimeZone?: string;
        closeMessageTitle?: string;
        closeMessageDescription?: string;
        redirectOnClose?: string;
    };
    formtype?: string;
    createdBy?: string;
    user?: IUserDoc;
}

export interface UpdateHackathonDTO {
    hackathonId: string;
    user: IUserDoc | string;
    name?: string;
    description?: string;
    type?: HackathonType;
    status?: HackStatusType;
    image?: string;
    settings?: {
        language?: string;
        startTime?: string;
        startDate?: string;
        startTimeZone?: string;
        isClosed?: string;
        closeTime?: string;
        closeDate?: string;
        closeTimeZone?: string;
        closeMessageTitle?: string;
        closeMessageDescription?: string;
        redirectOnClose?: string;
    };
    formtype?: string;
}

export interface InviteMemberDTO {
    hackathonId: string;
    email: string;
}

export interface AddMemberDTO {
    hackathonId: string;
    userId: string;
    role?: HackathonMemberRole;
    invitedBy?: string;
    requestingUser: IUserDoc | string;
}

export interface RemoveMemberDTO {
    hackathonId: string;
    userId: string;
    requestingUser: IUserDoc | string;
}
