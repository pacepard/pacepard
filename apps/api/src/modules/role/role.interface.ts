import { Document, Types } from "mongoose";

type ObjectId = Types.ObjectId;

export interface IRoleDoc extends Document {

     name: string;
     description: string;
     slug: string;
   
     // relationships
     permissions: Array<string>;
     users: Array<ObjectId | any>;
     
     // time stamps
     createdAt: Date;
     updatedAt: Date;
     _version: number;
     _id: ObjectId;
     id: ObjectId;

}