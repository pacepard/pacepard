import { Document, Types } from "mongoose";
<<<<<<< HEAD
=======
import { IUserDoc } from "../user/user.interface";
import { TaskStatus, TaskPriority } from "../../utils/enums.util";
export { TaskStatus, TaskPriority };

export enum TaskDifficulty {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
  EXPERT = 'expert'
}
>>>>>>> af983945d9f8cb5ed1b44582a235135877f343b3

type ObjectId = Types.ObjectId;

export interface ITaskDoc extends Document {
<<<<<<< HEAD

     // time stamps
     createdAt: Date;
     updatedAt: Date;
     _version: number;
     _id: ObjectId;
     id: ObjectId;

=======
  code: string;
  title: string;
  description: string;
  
  // Strict Hierarchy
  workspaceId: ObjectId;
  businessId: ObjectId;
  projectId: ObjectId;
  teamId: ObjectId;

  // Status & Work
  status: TaskStatus;
  priority: TaskPriority;
  points: number;
  
  // Assignment
  assignedTo: Array<IUserDoc | ObjectId>; 
  createdBy: ObjectId;

  // Metadata
  tags: Array<string>;
  dueDate: Date;
  completedAt: Date; 

  // System
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
>>>>>>> af983945d9f8cb5ed1b44582a235135877f343b3
}