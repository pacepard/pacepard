import { IUserDoc } from '../user/user.interface';
import { ProjectType, ProjectStatus, ProjectCreatorType, ProjectMemberRole } from './project.interface';
import { IBlockDoc } from '../../utils/blocks.interface'; 

/**
 * @interface ProjectMemberDTO
 * @description Represents a member within the project response.
 */
export interface ProjectMemberDTO {
  user: string; 
  role: ProjectMemberRole;
  joinedAt: Date;
}

/**
 * @interface ProjectDTO
 * @description The structure of a project as sent to the client (Frontend).
 */
export interface ProjectDTO {
  id: string;
  code: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  
  // Hierarchy Links
  workspaceId: string;
  businessId: string;
  
  // Content & Classification
  category: string;
  type: ProjectType;
  status: ProjectStatus;
  tags: string[];
  image: string;
  items: IBlockDoc[];
  documentation: string;
  
  // Ownership
  createdBy: string;
  creatorType: ProjectCreatorType;
  
  // State
  isOpen: boolean;
  isClosed: boolean;
  publishedAt: Date;
  
  // Participation
  members: ProjectMemberDTO[];
  tasks: string[]; 

  // System timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDTO {
  user: IUserDoc;      
  workspaceId: string; 
  title: string;
  tagline: string;
  description: string;
  category: string;
  type: ProjectType;
  items: Array<IBlockDoc>; 
  tags: Array<string>;
  image: string;
  documentation: string;
  createdBy: string;   
}

export interface UpdateProjectDTO {
  title?: string;
  tagline?: string;
  description?: string;
  category?: string;
  tags?: string[];
  image?: string;
  isOpen?: boolean;
  isClosed?: boolean;
  status?: ProjectStatus;
  items?: Array<IBlockDoc>;
  documentation?: string;
}