import { Document, Types } from 'mongoose';
import { IUserDoc } from '../../users/user/user.interface';
import { IProjectDoc } from '../../projects/project/project.interface';
import { ITaskDoc } from '../../projects/task/task.interface';
import { IWorkspaceDoc } from '../../core/workspace/workspace.interface';
import { IBusinessDoc } from '../../users/business/business.interface';

type ObjectId = Types.ObjectId;

export interface ITeamDoc extends Document {
    code: string;
    name: string;
    description: string;
    image: {
        fileName: string;
        s3Key: string;
    };

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
