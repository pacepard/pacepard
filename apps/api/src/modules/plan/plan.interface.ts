import { Document, Types } from "mongoose";

type ObjectId = Types.ObjectId;

export interface IPlanDoc extends Document {

     // time stamps
     createdAt: Date;
     updatedAt: Date;
     _version: number;
     _id: ObjectId;
     id: ObjectId;

}