import { Document, Types } from "mongoose";
import { IHackathonDoc } from "../hackathon/hackathon.interface";
import { IUserDoc } from "../user/user.interface";
import { IProjectDoc } from "../project/project.interface";

type ObjectId = Types.ObjectId;

export interface IWorkspaceDoc extends Document {

     code: string
     name: string
     createdBy: IUserDoc | any

     hackathons: Array<IHackathonDoc | any>
     projects: Array<IProjectDoc | any>
     members: Array<IUserDoc | any>
     invites: Array<IUserDoc | any>

     mentors: Array<IUserDoc | any>
     judges:  Array<IUserDoc | any>


     // time stamps
     createdAt: Date;
     updatedAt: Date;
     _version: number;
     _id: ObjectId;
     id: ObjectId;

}