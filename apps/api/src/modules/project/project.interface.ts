import { Document, Types } from "mongoose";
import { ITaskDoc, IUserDoc } from "../../utils/interfaces.util";
import { IBlockDoc } from "../../utils/blocks.interface";

type ObjectId = Types.ObjectId;

/**
 * Defines a member's specific footprint within a project.
 * This structure allows us to track when they joined and what their role is.
 */

export interface IProjectDoc extends Document {
  // Identity
  code: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;

  // Content (Notion-style)
  items?: Array<IBlockDoc>;
  documentation?: string;

  // Classification
  category: string;
  tags: Array<string>;
  type: ProjectType;

  // Media
  image?: string;

  // Lifecycle & visibility
  status: ProjectStatus;
  isOpen: boolean;
  isClosed: boolean;
  publishedAt?: Date;

  // Ownership
  createdBy: ObjectId;
  creatorType: ProjectCreatorType;

  // Relationships/participation
  // FIXED: Changed from IUserDoc[] to IProjectMember[] to match Schema sub-docs
  members: Array<IProjectMember>; 
  mentors: Array<IUserDoc>;

  businessId: ObjectId;

  // Work
  tasks: Array<ITaskDoc>;

  // System
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}

export enum ProjectType {
  PROJECT = "project",
  CHALLENGE = "challenge",
}

export enum ProjectStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  UNDER_REVIEW = "under-review",
  PENDING = "pending",
  CLOSED = "closed"
}

export enum ProjectCreatorType {
  ADMIN = "admin",
  BUSINESS = "business",
}


export interface IProjectMember {
  user: IUserDoc;
  role: "member" | "mentor" | "maintainer";
  joinedAt: Date;
}


// import { Document, Types } from "mongoose";
// import { ITaskDoc, IUserDoc } from "../../utils/interfaces.util";
// import { IBlockDoc } from "../../utils/blocks.interface";

// type ObjectId = Types.ObjectId;


// export interface IProjectDoc extends Document {
//   // Identity
//   code: string;
//   title: string;
//   slug: string;
//   tagline: string;
//   description: string;

//   // Content (Notion-style)
//   items?: Array<IBlockDoc>;
//   documentation?: string;

//   // Classification
//   category: string;
//   tags: string[];
//   type: ProjectType;

//   // Media
//   image?: string;

//   // Lifecycle & visibility
//   status: ProjectStatus;
//   isOpen: boolean;
//   isClosed: boolean;
//   publishedAt?: Date;

//   // Ownership
//   createdBy: ObjectId;
//   creatorType: ProjectCreatorType;

//   // Relationships/participation
//   members: Array<IUserDoc | any>;
//   maintainers: Array<IUserDoc | any>;
//   mentors: Array<IUserDoc | any>;

//   //work
//   tasks: Array<ITaskDoc | any>;

//   //system
//      createdAt: Date;
//      updatedAt: Date;
//     _version: number;
//     _id: ObjectId;
//      id: string;
// }

// export enum ProjectType {
//   PROJECT = "project",
//   CHALLENGE = "challenge",
// }

// export enum ProjectStatus {
//   DRAFT = "draft",
//   PUBLISHED = "published",
//   UNDER_REVIEW = "under-review",
//   PENDING = "pending",
//   CLOSED = "closed"
// }

// export enum ProjectCreatorType {
//   ADMIN = "admin",
//   BUSINESS = "business",
// }