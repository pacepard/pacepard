import { InvitationStatus, InvitationType } from './invitation.interface';

export interface CreateInvitationDTO {
    invitedBy: string;
    inviteeEmail: string;
    inviteeUserId?: string;
    inviteType: InvitationType;
    resourceId: string;
    expiresAt?: Date
    inviteStatus?: InvitationStatus,
    inviteToken?: string,
}

export interface InviteTokenDTO {
    token: string;
    email: string;
}
