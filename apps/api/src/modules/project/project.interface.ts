import { Document, Types } from "mongoose";
import { IUserDoc } from "../../utils/interfaces.util";
import { ITaskDoc } from "../task/task.interface";
import { IBlockDoc } from "../../utils/blocks.interface";

type ObjectId = Types.ObjectId;

/**
 * Defines a member's specific footprint within a project.
 * This structure allows us to track when they joined and what their role is.
 */

export interface IProjectDoc extends Document {
  code: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;

  items: Array<IBlockDoc>;
  documentation: string;

  category: string;
  tags: Array<string>;
  type: ProjectType;
  image?: string;

  status: ProjectStatus;
  isOpen: boolean;
  isClosed: boolean;
  publishedAt: Date;

  // Ownership - Defined by the hierarchy
  workspaceId: ObjectId; 
  businessId: ObjectId;  
  
  createdBy: ObjectId;
  creatorType: ProjectCreatorType;

  // Unified Participation
  members: Array<IProjectMember>; 

  tasks: Array<ITaskDoc>;

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
  user: Types.ObjectId | IUserDoc; 
  role: ProjectMemberRole;
  joinedAt: Date;
}

export enum DifficultyEnum {
    RANDOM = 'random',
    EASY = 'easy',
    NORMAL = 'normal',
    HARD = 'hard',
    DIFFICULT = 'difficult'
}

/**
 * Defines the specific roles a user can hold within a project, 
 * squad, or team context.
 */
export enum ProjectMemberRole {
  MEMBER = "member",
  MENTOR = "mentor",
  MAINTAINER = "maintainer",
  LEAD = "lead",
  JUDGE = "judge",
  FACILITATOR = "facilitator"
}