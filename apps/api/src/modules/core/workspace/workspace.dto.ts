import { IUserDoc } from '../../users/user/user.interface';
import { WorkspaceMemberRole } from './workspace.interface';

import { IFile } from '../../../utils/interfaces.util';

export interface CreateWorkspaceDTO {
    name: string;
    createdBy?: string;
    user?: IUserDoc;
    icon?: IFile; // Optional icon file for workspace
}

export interface UpdateWorkspaceDTO {
    workspaceId: string;
    user: IUserDoc | string;
    name?: string;
}

export interface WorkspaceDTO {
    id: string;
    code: string;
    name: string;
    createdBy: string;
    hackathons?: Array<any>;
    projects?: Array<any>;
    members?: Array<any>;
    invites?: Array<any>;
    mentors?: Array<any>;
    judges?: Array<any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface InviteMemberDTO {
    workspaceId: string;
    email: string;
}

export interface BulkInviteMemberDTO {
    workspaceId: string;
    emails: string[]; // Array of email addresses
}

export interface AddMemberDTO {
    workspaceId: string;
    userId: string;
    role?: WorkspaceMemberRole;
    invitedBy?: string;
    requestingUser: IUserDoc | string;
}

export interface RemoveMemberDTO {
    workspaceId: string;
    userId: string;
    requestingUser: IUserDoc | string;
}

export interface AddGuestDTO {
    workspaceId: string;
    guestId: string;
    guestType: 'mentor' | 'judge'; // Type of guest to add
    requestingUser: IUserDoc | string;
}

export interface RemoveGuestDTO {
    workspaceId: string;
    guestId: string;
    requestingUser: IUserDoc | string;
}

// Legacy DTOs for backward compatibility during migration (will be removed)
export interface AddMentorDTO {
    workspaceId: string;
    mentorId: string;
    requestingUser: IUserDoc | string;
}

export interface RemoveMentorDTO {
    workspaceId: string;
    mentorId: string;
    requestingUser: IUserDoc | string;
}

export interface AddJudgeDTO {
    workspaceId: string;
    judgeId: string;
    requestingUser: IUserDoc | string;
}

export interface RemoveJudgeDTO {
    workspaceId: string;
    judgeId: string;
    requestingUser: IUserDoc | string;
}

export interface UpdateDomainAccessDTO {
    workspaceId: string;
    allowDomainAccess: boolean;
    domain?: string; // Extract from first email if not provided
    user?: IUserDoc | string; // Requesting user (for permission check)
}

export interface GenerateShareableLinkDTO {
    workspaceId: string;
    expiresInDays?: number; // Default 7 days
    user?: IUserDoc | string; // Requesting user (for permission check)
}

export interface JoinWorkspaceByLinkDTO {
    token: string;
    workspaceId: string;
    userEmail?: string; // Optional: user's email for domain validation
}
