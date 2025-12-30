import { Document, Types } from "mongoose";
import { IUserDoc } from "../user/user.interface";
import { ProjectMemberRole } from "../../utils/enums.util";

type ObjectId = Types.ObjectId;

export interface ITeamDoc extends Document {
  name: string;
  description: string;
  code: string;

  // Strict Hierarchy Chain
  workspaceId: ObjectId;
  businessId: ObjectId;
  projectId: ObjectId;

  // Participation
  // This is where Talents are "housed" within the project
  members: Array<ITeamMember>; 
  
  // Work Reference
  // Every team owns a specific set of tasks
  tasks: Array<ObjectId>;

  // System
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}

export interface ITeamMember {
  user: IUserDoc | ObjectId;
  role: ProjectMemberRole;
  joinedAt: Date;
}