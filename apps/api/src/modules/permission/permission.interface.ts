import { Document, Types } from "mongoose";
<<<<<<< HEAD
=======
import { PermissionAction } from "./permission.action";
>>>>>>> af983945d9f8cb5ed1b44582a235135877f343b3

type ObjectId = Types.ObjectId;

export interface IPermissionDoc extends Document {
<<<<<<< HEAD
     action: string;
     description?: string;
   
     // time stamps
     createdAt: Date;
     updatedAt: Date;
     _version: number;
     _id: ObjectId;
     id: ObjectId;

}
=======
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
>>>>>>> af983945d9f8cb5ed1b44582a235135877f343b3
