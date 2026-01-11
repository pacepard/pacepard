import { Document, Types } from 'mongoose';
import { IUserDoc } from '../user/user.interface';
import { IProjectDoc } from '../project/project.interface';
import { IWorkspaceDoc } from '../workspace/workspace.interface';
import { IBusinessDoc } from '../business/business.interface';
import { ITaskDoc } from '../task/task.interface';

type ObjectId = Types.ObjectId;

export interface ITeamDoc extends Document {
    code: string;
    name: string;
    description: string;

    createdBy: ObjectId | IUserDoc;

    // Relationships
    workspace: IWorkspaceDoc | any; // workspace the team belongs to
    business: IBusinessDoc | any; // business the team belongs to
    project: IProjectDoc | any; // project the team belongs to
    members: Array<ITeamMember>; // members of the team
    tasks: Array<ITaskDoc | ObjectId>; // tasks of the team

    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}

export interface ITeamMember {
    user: IUserDoc | ObjectId;
    role: TeamMemberRole;
    joinedAt: Date;
}

export enum TeamMemberRole {
    LEAD = 'LEAD',
    MEMBER = 'MEMBER',
    CONTRIBUTOR = 'CONTRIBUTOR',
}
