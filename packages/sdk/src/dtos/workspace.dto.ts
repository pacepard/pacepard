import Hackathon from '@/dtos/hackathon.dto';
import Project from '@/dtos/project.dto';
import User from '@/dtos/user.dto';

interface Workspace {
    code: string;
    name: string;
    description: string;
    index: number;

    createdBy: User; // owner of workspace

    // relationships
    members: Array<User>; // members of a business OR organisation that owns the workspace
    invites: Array<User>; // members of a business OR organisation that owns the workspace who hasnt accepted invites

    hackathons: Array<Hackathon>;
    projects: Array<Project>; // challeges or projects that a business created

    mentors: Array<User>; // mentors who can mentor an entry or submission in the workspace
    judges: Array<User>; // judge who can judge an entry or submission in the workspace

    // time stamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: any;
    id: any;
}

export interface CreateWorkspaceDTO {
  name: string;
  description: string;
  index?: number;
  createdBy?: string;
  user?: User;
}

export interface UpdateWorkspaceDTO extends CreateWorkspaceDTO {
  id: string;
}


export interface GetWorkspaceDTO {
  id: string;

}

export default Workspace;
