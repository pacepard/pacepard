import { IUserDoc } from '../../users/user/user.interface';
import { WorkspaceMemberRole } from './workspace.interface';

export interface CreateWorkspaceDTO {
  name: string;
  createdBy?: string;
  user?: IUserDoc;
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
