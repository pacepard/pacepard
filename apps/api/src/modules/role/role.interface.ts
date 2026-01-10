import { Document, Types } from "mongoose";
import { PermissionAction, ResourceType } from "../permission/permission.action";

type ObjectId = Types.ObjectId;

export interface IRoleDoc extends Document {
  name: string;
  description: string;
  slug: string;
  
  // Permission configuration
  permissions: Array<IRolePermission>;
  
  // Role hierarchy
  inheritsFrom?: ObjectId; // Parent role for inheritance
  
  // Role metadata
  resourceType: ResourceType; // What context this role applies to
  isSystemRole: boolean; // Predefined system roles
  
  // Relationships
  users: Array<ObjectId | any>;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  _id: ObjectId;
  id: ObjectId;
}

export interface IRolePermission {
  action: PermissionAction;
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'contains';
  value: any;
}

// Predefined System Roles
export enum SystemRole {
  // Workspace Level
  WORKSPACE_OWNER = 'workspace_owner',
  WORKSPACE_ADMIN = 'workspace_admin',
  WORKSPACE_MEMBER = 'workspace_member',
  
  // Project Level
  PROJECT_OWNER = 'project_owner',
  PROJECT_MAINTAINER = 'project_maintainer',
  PROJECT_MEMBER = 'project_member',
  PROJECT_MENTOR = 'project_mentor',
  PROJECT_JUDGE = 'project_judge',
  
  // Team Level
  TEAM_LEAD = 'team_lead',
  TEAM_MEMBER = 'team_member',
  
  // System Level
  SUPER_ADMIN = 'super_admin',
  PLATFORM_ADMIN = 'platform_admin',
  BUSINESS = 'business',
  TALENT = 'talent',
  MENTOR = 'mentor',
  EVALUATOR = 'evaluator',
}

/**
 * Role Permissions Mapping
 * Defines default permissions for each system role
 */
export const RolePermissions: Record<SystemRole, PermissionAction[]> = {
  // Super Admin - Full system access
  [SystemRole.SUPER_ADMIN]: [
    PermissionAction.MANAGE_ALL_WORKSPACES,
    PermissionAction.MANAGE_ALL_PROJECTS,
    PermissionAction.MANAGE_ALL_USERS,
  ],
  
  // Platform Admin - Manage all content
  [SystemRole.PLATFORM_ADMIN]: [
    PermissionAction.CREATE_WORKSPACE,
    PermissionAction.VIEW_WORKSPACE,
    PermissionAction.EDIT_WORKSPACE,
    PermissionAction.DELETE_WORKSPACE,
    PermissionAction.MANAGE_WORKSPACE_MEMBERS,
    PermissionAction.CREATE_PROJECT,
    PermissionAction.VIEW_PROJECT,
    PermissionAction.EDIT_PROJECT,
    PermissionAction.DELETE_PROJECT,
    PermissionAction.PUBLISH_PROJECT,
    PermissionAction.CLOSE_PROJECT,
    PermissionAction.MANAGE_PROJECT_MEMBERS,
    PermissionAction.INVITE_PROJECT_MEMBERS,
    PermissionAction.REMOVE_PROJECT_MEMBERS,
    PermissionAction.CREATE_TEAM,
    PermissionAction.VIEW_TEAM,
    PermissionAction.EDIT_TEAM,
    PermissionAction.DELETE_TEAM,
    PermissionAction.MANAGE_TEAM_MEMBERS,
    PermissionAction.ROTATE_TEAM_MEMBERS,
    PermissionAction.CREATE_TASK,
    PermissionAction.VIEW_TASK,
    PermissionAction.EDIT_TASK,
    PermissionAction.DELETE_TASK,
    PermissionAction.ASSIGN_TASK,
    PermissionAction.UPDATE_TASK_STATUS,
    PermissionAction.EVALUATE_SUBMISSION,
    PermissionAction.VIEW_EVALUATIONS,
  ],
  
  // Workspace Owner - Full workspace control
  [SystemRole.WORKSPACE_OWNER]: [
    PermissionAction.VIEW_WORKSPACE,
    PermissionAction.EDIT_WORKSPACE,
    PermissionAction.MANAGE_WORKSPACE_MEMBERS,
    PermissionAction.CREATE_PROJECT,
    PermissionAction.VIEW_PROJECT,
    PermissionAction.EDIT_PROJECT,
    PermissionAction.DELETE_PROJECT,
    PermissionAction.PUBLISH_PROJECT,
    PermissionAction.CLOSE_PROJECT,
    PermissionAction.MANAGE_PROJECT_MEMBERS,
    PermissionAction.INVITE_PROJECT_MEMBERS,
    PermissionAction.REMOVE_PROJECT_MEMBERS,
    PermissionAction.CREATE_TEAM,
    PermissionAction.VIEW_TEAM,
    PermissionAction.EDIT_TEAM,
    PermissionAction.DELETE_TEAM,
    PermissionAction.MANAGE_TEAM_MEMBERS,
    PermissionAction.ROTATE_TEAM_MEMBERS,
    PermissionAction.CREATE_TASK,
    PermissionAction.VIEW_TASK,
    PermissionAction.EDIT_TASK,
    PermissionAction.DELETE_TASK,
    PermissionAction.ASSIGN_TASK,
  ],
  
  // Workspace Admin - Manage workspace and projects
  [SystemRole.WORKSPACE_ADMIN]: [
    PermissionAction.VIEW_WORKSPACE,
    PermissionAction.EDIT_WORKSPACE,
    PermissionAction.MANAGE_WORKSPACE_MEMBERS,
    PermissionAction.CREATE_PROJECT,
    PermissionAction.VIEW_PROJECT,
    PermissionAction.EDIT_PROJECT,
    PermissionAction.PUBLISH_PROJECT,
    PermissionAction.CLOSE_PROJECT,
    PermissionAction.MANAGE_PROJECT_MEMBERS,
    PermissionAction.INVITE_PROJECT_MEMBERS,
    PermissionAction.CREATE_TEAM,
    PermissionAction.VIEW_TEAM,
    PermissionAction.EDIT_TEAM,
    PermissionAction.MANAGE_TEAM_MEMBERS,
    PermissionAction.ROTATE_TEAM_MEMBERS,
    PermissionAction.CREATE_TASK,
    PermissionAction.VIEW_TASK,
    PermissionAction.EDIT_TASK,
    PermissionAction.ASSIGN_TASK,
  ],
  
  // Workspace Member - Basic access
  [SystemRole.WORKSPACE_MEMBER]: [
    PermissionAction.VIEW_WORKSPACE,
    PermissionAction.VIEW_PROJECT,
    PermissionAction.JOIN_PROJECT,
  ],
  
  // Project Owner - Full project control
  [SystemRole.PROJECT_OWNER]: [
    PermissionAction.VIEW_PROJECT,
    PermissionAction.EDIT_PROJECT,
    PermissionAction.DELETE_PROJECT,
    PermissionAction.PUBLISH_PROJECT,
    PermissionAction.CLOSE_PROJECT,
    PermissionAction.MANAGE_PROJECT_MEMBERS,
    PermissionAction.INVITE_PROJECT_MEMBERS,
    PermissionAction.REMOVE_PROJECT_MEMBERS,
    PermissionAction.CREATE_TEAM,
    PermissionAction.VIEW_TEAM,
    PermissionAction.EDIT_TEAM,
    PermissionAction.DELETE_TEAM,
    PermissionAction.MANAGE_TEAM_MEMBERS,
    PermissionAction.ROTATE_TEAM_MEMBERS,
    PermissionAction.CREATE_TASK,
    PermissionAction.VIEW_TASK,
    PermissionAction.EDIT_TASK,
    PermissionAction.DELETE_TASK,
    PermissionAction.ASSIGN_TASK,
  ],
  
  // Project Maintainer - Manage project content and teams
  [SystemRole.PROJECT_MAINTAINER]: [
    PermissionAction.VIEW_PROJECT,
    PermissionAction.EDIT_PROJECT,
    PermissionAction.PUBLISH_PROJECT,
    PermissionAction.MANAGE_PROJECT_MEMBERS,
    PermissionAction.INVITE_PROJECT_MEMBERS,
    PermissionAction.REMOVE_PROJECT_MEMBERS,
    PermissionAction.CREATE_TEAM,
    PermissionAction.VIEW_TEAM,
    PermissionAction.EDIT_TEAM,
    PermissionAction.MANAGE_TEAM_MEMBERS,
    PermissionAction.ROTATE_TEAM_MEMBERS,
    PermissionAction.CREATE_TASK,
    PermissionAction.VIEW_TASK,
    PermissionAction.EDIT_TASK,
    PermissionAction.ASSIGN_TASK,
  ],
  
  // Project Member - Basic project access
  [SystemRole.PROJECT_MEMBER]: [
    PermissionAction.VIEW_PROJECT,
    PermissionAction.CREATE_TASK,
    PermissionAction.VIEW_TASK,
    PermissionAction.UPDATE_TASK_STATUS,
    PermissionAction.LEAVE_PROJECT,
  ],
  
  // Project Mentor - Guidance role
  [SystemRole.PROJECT_MENTOR]: [
    PermissionAction.VIEW_PROJECT,
    PermissionAction.VIEW_TEAM,
    PermissionAction.VIEW_TASK,
    PermissionAction.PROVIDE_FEEDBACK,
  ],
  
  // Project Judge - Evaluation role
  [SystemRole.PROJECT_JUDGE]: [
    PermissionAction.VIEW_PROJECT,
    PermissionAction.VIEW_TASK,
    PermissionAction.EVALUATE_SUBMISSION,
    PermissionAction.VIEW_EVALUATIONS,
  ],
  
  // Team Lead - Manage team and tasks
  [SystemRole.TEAM_LEAD]: [
    PermissionAction.VIEW_TEAM,
    PermissionAction.EDIT_TEAM,
    PermissionAction.MANAGE_TEAM_MEMBERS,
    PermissionAction.CREATE_TASK,
    PermissionAction.VIEW_TASK,
    PermissionAction.EDIT_TASK,
    PermissionAction.DELETE_TASK,
    PermissionAction.ASSIGN_TASK,
    PermissionAction.UPDATE_TASK_STATUS,
  ],
  
  // Team Member - Basic team access
  [SystemRole.TEAM_MEMBER]: [
    PermissionAction.VIEW_TEAM,
    PermissionAction.VIEW_TASK,
    PermissionAction.UPDATE_TASK_STATUS,
  ],
  
  // Business - Business account capabilities
  [SystemRole.BUSINESS]: [
    PermissionAction.CREATE_WORKSPACE,
    PermissionAction.VIEW_WORKSPACE,
    PermissionAction.EDIT_WORKSPACE,
    PermissionAction.MANAGE_WORKSPACE_MEMBERS,
    PermissionAction.MANAGE_BUSINESS_PROFILE,
    PermissionAction.MANAGE_OWN_WORKSPACES,
    PermissionAction.MANAGE_OWN_PROJECTS,
  ],
  
  // Talent - Talent account capabilities
  [SystemRole.TALENT]: [
    PermissionAction.VIEW_PUBLIC_PROJECTS,
    PermissionAction.APPLY_TO_PROJECTS,
    PermissionAction.VIEW_TASK,
    PermissionAction.UPDATE_TASK_STATUS,
  ],
  
  // Mentor - Mentor capabilities
  [SystemRole.MENTOR]: [
    PermissionAction.VIEW_PROJECT,
    PermissionAction.VIEW_TEAM,
    PermissionAction.VIEW_TASK,
    PermissionAction.PROVIDE_FEEDBACK,
  ],
  
  // Evaluator - Evaluator capabilities
  [SystemRole.EVALUATOR]: [
    PermissionAction.VIEW_PROJECT,
    PermissionAction.VIEW_TASK,
    PermissionAction.EVALUATE_SUBMISSION,
    PermissionAction.VIEW_EVALUATIONS,
  ],
};
