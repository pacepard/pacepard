import { IUserDoc } from '../user/user.interface';
import {
    ProjectType,
    ProjectStatus,
    ProjectMemberRole,
} from './project.interface';
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

    // Hierarchy Links (populated from workspaceId/businessId in model)
    workspaceId?: string;
    businessId?: string;
    workspace?: any;
    business?: any;

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

    // State
    isOpen: boolean;
    isClosed: boolean;
    isPublic: boolean;
    isChallenge: boolean;
    publishedAt: Date;

    // Participation
    members: ProjectMemberDTO[];
    tasks: string[];

    // System timestamps
    createdAt: Date;
    updatedAt: Date;
}

/**
 * @interface CreateProjectDTO
 * @description Data transfer object for creating a new project
 */
export interface CreateProjectDTO {
    user: IUserDoc;
    workspaceId: string;
    title: string;
    tagline?: string;
    description: string;
    category?: string;
    type?: ProjectType;
    items?: Array<IBlockDoc>;
    tags?: Array<string>;
    image?: string;
    documentation?: string;
    isPublic?: boolean;
    isChallenge?: boolean;
    createdBy?: string;
}

/**
 * @interface UpdateProjectDTO
 * @description Data transfer object for updating a project
 */
export interface UpdateProjectDTO {
    title?: string;
    tagline?: string;
    description?: string;
    category?: string;
    tags?: string[];
    image?: string;
    isOpen?: boolean;
    isClosed?: boolean;
    isPublic?: boolean;
    isChallenge?: boolean;
    status?: ProjectStatus;
    items?: Array<IBlockDoc>;
    documentation?: string;
}
