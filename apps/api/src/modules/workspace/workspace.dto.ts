import { IUserDoc } from '../user/user.interface';

export interface CreateWorkspaceDTO {
  name: string;
  createdBy?: string;
  user?: IUserDoc;
}

export interface UpdateWorkspaceDTO {
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
