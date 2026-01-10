import { Document, Types } from "mongoose";
<<<<<<< HEAD
=======
import { IUserDoc } from "../user/user.interface";
import { ProjectMemberRole } from "../../utils/enums.util";
>>>>>>> af983945d9f8cb5ed1b44582a235135877f343b3

type ObjectId = Types.ObjectId;

export interface ITeamDoc extends Document {
<<<<<<< HEAD

     // time stamps
     createdAt: Date;
     updatedAt: Date;
     _version: number;
     _id: ObjectId;
     id: ObjectId;

=======
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
>>>>>>> af983945d9f8cb5ed1b44582a235135877f343b3
}