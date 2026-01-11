import { Document, Types } from 'mongoose';
import { IHackathonDoc } from '../hackathon/hackathon.interface';
import { IUserDoc } from '../user/user.interface';
import { IProjectDoc } from '../project/project.interface';


type ObjectId = Types.ObjectId;

// Workspaces are the top level container for a business or organisation
// They contain hackathons, mentors, judges, and members
// Projects are not part of the workspace, they are independent of the hackathon 
// They are used to manage the lifecycle of a business or organisation
export interface IWorkspaceDoc extends Document {
    code: string;
    name: string;
    description: string;
    index: number;

    createdBy: IUserDoc | any; // owner of workspace

    // relationships
    members: Array<IUserDoc | any>; // members of a business OR organisation that owns the workspace
    invites: Array<IUserDoc | any>; // members of a business OR organisation that owns the workspace who hasnt accepted invites

    hackathons: Array<IHackathonDoc | any>;
    projects: Array<IProjectDoc | any>; // challeges or projects that a business created
   
    mentors: Array<IUserDoc | any>; // mentors who can mentor an entry or submission in the workspace
    judges: Array<IUserDoc | any>; // judge who can judge an entry or submission in the workspace

    // time stamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}
