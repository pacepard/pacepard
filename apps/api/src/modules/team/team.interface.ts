import { Document, Types } from "mongoose";

type ObjectId = Types.ObjectId;

export interface ITeamDoc extends Document {
  projectId: Types.ObjectId;
  name: string;
  members: Types.ObjectId[]; // Array of User IDs (Talents)
  createdAt: Date;
  updatedAt: Date;
}

// export interface ITeamDoc extends Document {

//      // time stamps
//      createdAt: Date;
//      updatedAt: Date;
//      _version: number;
//      _id: ObjectId;
//      id: ObjectId;

// }

// export interface ITeamDoc extends Document {
//   projectId: ObjectId;
//   name: string;
//   members: Array<{
//     userId: ObjectId;
//     role: string;
//     joinedAt: Date;
//   }>;
// }