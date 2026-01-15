import { IUserDoc } from '../../users/user/user.interface';
import { EntryType, EntryStatusType } from './entry.interface';

export interface CreateEntryDTO {
    name: string;
    description: string;
    hackathonId: string;
    entryType?: EntryType;
    image?: string;
    tags?: Array<string>;
    category?: string;
    settings?: {
        transferOwnershipTo?: string;
    };
    createdBy?: string;
    user?: IUserDoc;
}

export interface UpdateEntryDTO {
    entryId: string;
    user: IUserDoc | string;
    name?: string;
    description?: string;
    entryType?: EntryType;
    status?: EntryStatusType;
    image?: string;
    tags?: Array<string>;
    category?: string;
    settings?: {
        transferOwnershipTo?: string;
    };
}

export interface InviteMemberDTO {
    entryId: string;
    email: string;
}

export interface AddMemberDTO {
    entryId: string;
    userId: string;
    invitedBy?: string;
    requestingUser: IUserDoc | string;
}

export interface RemoveMemberDTO {
    entryId: string;
    userId: string;
    requestingUser: IUserDoc | string;
}
