import { Document, Types } from 'mongoose';

type ObjectId = Types.ObjectId;

export interface IAdminDoc extends Document {
    code: string; // employeee ID
    firstName: string;
    lastName: string;
    slug: string;
    email: string;

    department: string;        // e.g., "Engineering", "Marketing", "Trust & Safety"
    position: string;          // e.g., "Lead Moderator", "Support Agent"
    
    accessLevel: number;       // 1 (Junior) to 10 (Department Head)
    accessLevelName: string;
    accessLevelDescription: string;

  
    activityLog: Array<IActivityLog | any>;

    createdBy: ObjectId | any;
    settings: ObjectId | any;

    // relationships
    user: IUserDoc | any;

    // time stamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}

export interface IActivityLog {
    action: string;
    target: DbModels;
    targetId: ObjectId | any;
    creaedAt: Date;
}
0.77;
