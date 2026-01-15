import { Document, Types } from 'mongoose';
import { IUserDoc } from '../user/user.interface';
import { DbModels } from '../../../utils/enums.util';

type ObjectId = Types.ObjectId;

export interface IAdminDoc extends Document {
    code: string; // employeee ID
    firstName: string;
    lastName: string;
    slug: string;
    email: string;

    department: AdminDepartmentEnum; // product, platform, developer experience, infrastructure, data, security, education, people
    position: CompanyRoleEnum; // junior, associate, intermediate, senior, staff, principal, manager, director, vp, executive
    
    accessLevel: number;
    accessLevelName: string;
    accessLevelDescription?: string;
    
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
    createdAt: Date;
}

export enum AdminDepartmentEnum {
    PRODUCT_ENGINEERING = 'product-engineering', // Owns product, design, engineering, and marketing e.g payments, hackathon, workspace team etc.
    PLATFORM_ENGINEERING = 'platform-engineering', // Owns platform and engineering e.g billing, messaging, internal APIs, Auth libraries and SDKs etc.
    DEVELOPER_EXPERIENCE = 'developer-experience', // Owns developer experience e.g developer tools, developer platform, developer documentation, etc.
    INFRASTRUCTURE = 'infrastructure', // Owns reliability and scale e.g  CI/CD, monitoring, deployment, logging, etc.
    DATA = 'data', // Owns data and machine learning e.g data engineering, data science, machine learning, etc.
    SECURITY = 'security', // Owns security e.g authentication, authorization, data protection, compliance etc.
    EDUCATION = 'education', // Owns operations and education e.g hackathon as a education platform, API or product education, etc.
    PEOPLE = 'people', // Owns people and operations e.g HR, finance, legal, support, customer success team, etc.
}

export enum CompanyRoleEnum {
    JUNIOR = 'junior',
    ASSOCIATE = 'associate',
    INTERMEDIATE = 'intermediate',
    SENIOR = 'senior',
    STAFF = 'staff',
    PRINCIPAL = 'principal',
    MANAGER = 'manager',
    DIRECTOR = 'director',
    VP = 'vp',
    EXECUTIVE = 'executive',
}
