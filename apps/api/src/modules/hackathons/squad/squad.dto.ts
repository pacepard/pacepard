import { IUserDoc } from '../../users/user/user.interface';
import { SquadMemberRole } from './squad.interface';

export interface CreateSquadDTO {
    name: string;
    description?: string;
    hackathonId: string;
    createdBy?: string;
    user?: IUserDoc;
}

export interface UpdateSquadDTO {
    squadId: string;
    user: IUserDoc | string;
    name?: string;
    description?: string;
}

export interface InviteMemberDTO {
    squadId: string;
    email: string;
}

export interface AddMemberDTO {
    squadId: string;
    userId: string;
    role?: SquadMemberRole;
    invitedBy?: string;
    requestingUser: IUserDoc | string;
}

export interface RemoveMemberDTO {
    squadId: string;
    userId: string;
    requestingUser: IUserDoc | string;
}
