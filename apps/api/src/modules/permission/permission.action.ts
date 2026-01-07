/**
 * Permission Actions
 * Defines all possible actions users can perform on resources
 */
export enum PermissionAction {
  // Workspace Management
  CREATE_WORKSPACE = 'create_workspace',
  VIEW_WORKSPACE = 'view_workspace',
  EDIT_WORKSPACE = 'edit_workspace',
  DELETE_WORKSPACE = 'delete_workspace',
  MANAGE_WORKSPACE_MEMBERS = 'manage_workspace_members',
  
  // Project Management
  CREATE_PROJECT = 'create_project',
  VIEW_PROJECT = 'view_project',
  EDIT_PROJECT = 'edit_project',
  DELETE_PROJECT = 'delete_project',
  PUBLISH_PROJECT = 'publish_project',
  CLOSE_PROJECT = 'close_project',
  MANAGE_PROJECT_MEMBERS = 'manage_project_members',
  INVITE_PROJECT_MEMBERS = 'invite_project_members',
  REMOVE_PROJECT_MEMBERS = 'remove_project_members',
  
  // Team Management
  CREATE_TEAM = 'create_team',
  VIEW_TEAM = 'view_team',
  EDIT_TEAM = 'edit_team',
  DELETE_TEAM = 'delete_team',
  MANAGE_TEAM_MEMBERS = 'manage_team_members',
  ROTATE_TEAM_MEMBERS = 'rotate_team_members',
  
  // Task Management
  CREATE_TASK = 'create_task',
  VIEW_TASK = 'view_task',
  EDIT_TASK = 'edit_task',
  DELETE_TASK = 'delete_task',
  ASSIGN_TASK = 'assign_task',
  UPDATE_TASK_STATUS = 'update_task_status',
  
  // Member Actions
  JOIN_PROJECT = 'join_project',
  LEAVE_PROJECT = 'leave_project',
  
  // Evaluation
  EVALUATE_SUBMISSION = 'evaluate_submission',
  VIEW_EVALUATIONS = 'view_evaluations',
  PROVIDE_FEEDBACK = 'provide_feedback',
  PROVIDE_MENTORSHIP = 'provide_mentorship',
  PROVIDE_FEEDBACK = 'provide_feedback',
  
  // Admin Actions
  MANAGE_ALL_WORKSPACES = 'manage_all_workspaces',
  MANAGE_ALL_PROJECTS = 'manage_all_projects',
  MANAGE_ALL_USERS = 'manage_all_users',
  
  // Business Actions
  MANAGE_BUSINESS_PROFILE = 'manage_business_profile',
  MANAGE_OWN_WORKSPACES = 'manage_own_workspaces',
  MANAGE_OWN_PROJECTS = 'manage_own_projects',
  
  // Talent Actions
  VIEW_PUBLIC_PROJECTS = 'view_public_projects',
  APPLY_TO_PROJECTS = 'apply_to_projects',
}

/**
 * Resource Types
 * Defines all resources that can be acted upon
 */
export enum ResourceType {
  WORKSPACE = 'workspace',
  PROJECT = 'project',
  TEAM = 'team',
  TASK = 'task',
  USER = 'user',
  SUBMISSION = 'submission',
  BUSINESS = 'business',
}

/**
 * User Context for Permission Checks
 */
export interface UserContext {
  userId: string;
  userType: string;
  isAdmin: boolean;
  isBusiness: boolean;
  isTalent: boolean;
  isMentor: boolean;
  isSuper: boolean;
}

/**
 * Resource Context for Permission Checks
 */
export interface ResourceContext {
  resourceType: ResourceType;
  resourceId?: string;
  ownerId?: string;
  workspaceId?: string;
  projectId?: string;
  teamId?: string;
  teamId?: string;
  projectMemberRole?: string;
}
