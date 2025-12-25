import { ObjectId } from 'mongoose';
import { InvitationType } from '../../utils/eums.util';

export interface CreateInvitationDTO {
    invitedBy: ObjectId;
    inviteeEmail: string;
    inviteeUserId?: ObjectId;
    inviteType: InvitationType;
    resourceId: ObjectId;
}

export interface inviteTokenDTO {
    token: string;
    email: string;
}
