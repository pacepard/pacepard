import { Document, Types } from "mongoose";
import { IUserDoc } from "../user/user.interface";
import { TaskStatus, TaskPriority } from "../../utils/enums.util";

type ObjectId = Types.ObjectId;

export interface ITaskDoc extends Document {
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
}