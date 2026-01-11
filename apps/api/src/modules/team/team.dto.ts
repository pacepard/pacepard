import { IUserDoc } from '../user/user.interface';
import { TeamMemberRole } from './team.interface';

/**
 * @interface TeamMemberDTO
 * @description Represents a member within the team response.
 */
export interface TeamMemberDTO {
    user: string;
    role: TeamMemberRole;
    joinedAt: Date;
}

/**
 * @interface TeamDTO
 * @description The structure of a team as sent to the client (Frontend).
 */
export interface TeamDTO {
    id: string;
    code: string;
    name: string;
    description: string;

    // Hierarchy Links
    workspaceId?: string;
    businessId?: string;
    projectId?: string;
    workspace?: any;
    business?: any;
    project?: any;

    // Ownership
    createdBy: string;

    // Participation
    members: TeamMemberDTO[];
    tasks: string[];

    // System timestamps
    createdAt: Date;
    updatedAt: Date;
}

/**
 * @interface CreateTeamDTO
 * @description Data transfer object for creating a new team
 */
export interface CreateTeamDTO {
    user: IUserDoc;
    projectId: string;
    name: string;
    description?: string;
    createdBy?: string;
}

/**
 * @interface UpdateTeamDTO
 * @description Data transfer object for updating a team
 */
export interface UpdateTeamDTO {
    name?: string;
    description?: string;
}
