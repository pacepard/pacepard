import { Document, Types } from "mongoose";
import { PermissionAction } from "./permission.action";

type ObjectId = Types.ObjectId;

export interface IPermissionDoc extends Document {
  action: PermissionAction;
  resource: string;
  description?: string;
  
  // Metadata
  isActive: boolean;
  
  // System
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}

export interface IRolePermission {
  permission: string;
  conditions?: Record<string, any>;
}
