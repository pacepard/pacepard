import { Types } from "mongoose";
import { ProjectStatus, ProjectType, ProjectCreatorType } from "./project.interface";


//
// CREATE DTO
//
export interface CreateProjectDTO {
  title: string;
  tagline?: string;
  description: string;

  // items?: IBlockDoc[];
  documentation?: string;


  category?: string;
  tags?: string[];
  image?: string;
  items: string;
  type: ProjectType;      // PROJECT | CHALLENGE
}

export interface IProjectMember {
  user: Types.ObjectId | string;
  role: "member" | "mentor" | "maintainer";
  joinedAt: Date;
}

// UPDATE DTO
export interface UpdateProjectDTO {
  title?: string;
  tagline?: string;
  description?: string;

  // items?: IBlockDoc[];
  documentation?: string;

  category?: string;
  tags?: string[];
  image?: string;
}

export interface PublishProjectDTO {
  projectId: string;
}

export interface CloseProjectDTO {
  projectId: string;
  reason?: string;
}

export interface InviteTalentToProjectDTO {
  projectId: string;
  email: string;
  talentId: string[];

  role: "member" | "mentor" | "maintainer";
}

export interface ProjectPreviewDTO {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  image?: string;

  category: string;
  tags: string[];
  type: ProjectType;

  isOpen: boolean;
  publishedAt?: Date;

  createdBy: {
    id: string;
    name: string;
    type: ProjectCreatorType;
  };
}

export interface ProjectWorkspaceDTO {
  id: string;
  code: string;

  title: string;
  slug: string;
  tagline: string;
  description: string;
  documentation?: string;
  // items: IBlockDoc[];

  category: string;
  tags: string[];
  image?: string;

  status: ProjectStatus;
  isOpen: boolean;
  isClosed: boolean;
  publishedAt?: Date;

  members: Array<{
    id: string;
    name: string;
    role: "member" | "maintainer" | "mentor";
  }>;

  // tasks: Array<{
  //   id: string;
  //   title: string;
  //   status: string;
  // }>;

  createdAt: Date;
  updatedAt: Date;
}
