import { Document, Types } from 'mongoose';
import { IHackathonDoc } from '../hackathon/hackathon.interface';
import { IUserDoc } from '../../users/user/user.interface';

type ObjectId = Types.ObjectId;

export interface ISquadDoc extends Document {
    code: string;
    name: string;
    description: string;

    createdBy: ObjectId | IUserDoc;

    // Relationships
    hackathon: IHackathonDoc | any; // hackathon the team belongs to
    members: Array<ISquadMember>; // members of the team

    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}

export interface ISquadMember {
    user: IUserDoc | ObjectId;
    role: SquadMemberRole;
    joinedAt: Date;
}

export enum SquadMemberRole {
    LEAD = 'LEAD',
    MEMBER = 'MEMBER',
}
