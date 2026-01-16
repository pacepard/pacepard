import { Types } from 'mongoose';
import { WorkspaceMemberRole, IWorkspaceDoc, IWorkspaceMember } from '../../core/workspace/workspace.interface';
import { ProjectMemberRole, IProjectDoc, IProjectMember } from '../../projects/project/project.interface';
import { HackathonMemberRole, IHackathonDoc, IHackathonMember } from '../../hackathons/hackathon/hackathon.interface';
import { IUserDoc } from '../../users/user/user.interface';
import { IMentorDoc } from '../../users/mentor/mentor.interface';
import { IJudgeDoc } from '../../users/judge/judge.interface';

type ObjectId = Types.ObjectId;


/**
 * Workspace-level permission mapping
 */
export const workspaceMemberPermissionMap: Record<WorkspaceMemberRole, string[]> = {
    [WorkspaceMemberRole.OWNER]: ['*:*'], // Full access (BUSINESS userType)
    [WorkspaceMemberRole.MANAGER]: [
        'workspace:read',
        'workspace:update',
        'workspace:manage-members',
        'project:create',
        'project:read',
        'project:update',
        'project:delete',
        'project:manage-members',
        'hackathon:create',
        'hackathon:read',
        'hackathon:update',
        'hackathon:manage',
        'team:*',
    ],
};

/**
 * Project-level permission mapping (hierarchical)
 */
export const projectMemberPermissionMap: Record<ProjectMemberRole, string[]> = {
    [ProjectMemberRole.OWNER]: ['*:*'], // Full access
    [ProjectMemberRole.MAINTAINER]: [
        'project:read',
        'project:update',
        'project:delete',
        'project:manage-members',
        'project:publish',
        'project:close',
        'task:*',
        'team:*',
    ],
    [ProjectMemberRole.CONTRIBUTOR]: [
        'project:read',
        'project:update',
        'task:create',
        'task:read',
        'task:update',
        'task:update-status',
    ],
    [ProjectMemberRole.SUBSCRIBER]: ['project:read', 'task:read'], // Read-only
};

/**
 * Hackathon-level permission mapping
 */
export const hackathonMemberPermissionMap: Record<HackathonMemberRole, string[]> = {
    [HackathonMemberRole.OWNER]: ['*:*'], // Full access (can delete hackathon)
    [HackathonMemberRole.ORGANIZER]: [
        'hackathon:read',
        'hackathon:update',
        'hackathon:manage',
        'entry:read',
        'entry:update',
        'entry:delete',
        'submission:read',
        'submission:evaluate',
        'mentor:assign',
        'judge:assign',
    ],
};

/**
 * Functional role permission mapping (judges, mentors, participants)
 */
export const hackathonFunctionalRoleMap: Record<'JUDGE' | 'MENTOR' | 'PARTICIPANT', string[]> = {
    JUDGE: [
        'hackathon:read',
        'entry:read',
        'submission:read',
        'submission:evaluate',
    ],
    MENTOR: [
        'hackathon:read',
        'entry:read',
        'submission:read',
    ],
    PARTICIPANT: [
        'hackathon:read',
        'entry:create',
        'entry:read',
        'entry:update',
        'entry:submit',
        'submission:create',
        'submission:read',
        'submission:update',
    ],
};

/**
 * Project-level mentor permission mapping
 */
export const projectMentorPermissionMap: string[] = [
    'project:read',
    'project:mentor',
    'task:read',
    'task:mentor',
    'task:comment',
    'team:read',
];

/**
 * Project-level judge permission mapping
 */
export const projectJudgePermissionMap: string[] = [
    'project:read',
    'project:judge',
    'task:read',
    'task:evaluate',
    'team:read',
];

/**
 * Workspace-level mentor permission mapping
 */
export const workspaceMentorPermissionMap: string[] = [
    'workspace:read',
    'project:read',
    'project:mentor',
    'hackathon:read',
    'entry:read',
    'submission:read',
];

/**
 * Workspace-level judge permission mapping
 */
export const workspaceJudgePermissionMap: string[] = [
    'workspace:read',
    'project:read',
    'project:judge',
    'hackathon:read',
    'entry:read',
    'submission:read',
    'submission:evaluate',
];


/**
 * Get contextual permissions for a workspace member role
 */
export function getWorkspaceMemberPermissions(role: WorkspaceMemberRole): string[] {
    return workspaceMemberPermissionMap[role] || [];
}

/**
 * Get contextual permissions for a project member role
 */
export function getProjectMemberPermissions(role: ProjectMemberRole): string[] {
    return projectMemberPermissionMap[role] || [];
}

/**
 * Get contextual permissions for a hackathon member role
 */
export function getHackathonMemberPermissions(role: HackathonMemberRole): string[] {
    return hackathonMemberPermissionMap[role] || [];
}

/**
 * Get contextual permissions for a hackathon functional role
 */
export function getHackathonFunctionalPermissions(role: 'JUDGE' | 'MENTOR' | 'PARTICIPANT'): string[] {
    return hackathonFunctionalRoleMap[role] || [];
}

/**
 * Extract user ID from various user input types (string, ObjectId, or IUserDoc)
 * @param user - User identifier (string ID, ObjectId, or user document)
 * @returns Normalized user ID as string
 */
function extractUserId(user: IUserDoc | ObjectId | string): string {
    if (typeof user === 'string') {
        return user;
    }
    return (user as any)._id?.toString() || (user as any).toString();
}

/**
 * Extract user ID from a member/user field (handles ObjectId, string, or populated user object)
 * @param userField - User field from a member object
 * @returns Normalized user ID as string, or null if invalid
 */
function extractUserIdFromField(userField: any): string | null {
    if (!userField) return null;
    return (userField as any)?._id?.toString() || (userField as any)?.toString() || userField?.toString() || null;
}

/**
 * Find a member in an array by matching user ID
 * @param members - Array of member objects with user field
 * @param userId - User ID to search for
 * @returns Member object if found, undefined otherwise
 */
function findMemberInArray<T extends { user: any }>(
    members: T[],
    userId: string
): T | undefined {
    return members.find((member) => {
        const memberUserId = extractUserIdFromField(member.user);
        return memberUserId === userId;
    });
}


/**
 * Get member role from a workspace resource
 */
export function getWorkspaceMemberRole(
    user: IUserDoc | ObjectId | string,
    workspace: IWorkspaceDoc | any
): WorkspaceMemberRole | null {
    if (!workspace?.members || !Array.isArray(workspace.members)) return null;

    const userId = extractUserId(user);
    const member = findMemberInArray<IWorkspaceMember>(workspace.members, userId);

    return member?.role || null;
}

/**
 * Get member role from a project resource
 */
export function getProjectMemberRole(
    user: IUserDoc | ObjectId | string,
    project: IProjectDoc | any
): ProjectMemberRole | null {
    if (!project?.members || !Array.isArray(project.members)) return null;

    const userId = extractUserId(user);
    const member = findMemberInArray<IProjectMember>(project.members, userId);

    return member?.role || null;
}

/**
 * Get member role from a hackathon resource
 */
export function getHackathonMemberRole(
    user: IUserDoc | ObjectId | string,
    hackathon: IHackathonDoc | any
): HackathonMemberRole | null {
    if (!hackathon?.members || !Array.isArray(hackathon.members)) return null;

    const userId = extractUserId(user);
    const member = findMemberInArray<IHackathonMember>(hackathon.members, userId);

    return member?.role || null;
}

/**
 * Check if user is a judge in a hackathon
 */
export function isHackathonJudge(
    user: IUserDoc | ObjectId | string,
    hackathon: IHackathonDoc | any
): boolean {
    if (!hackathon?.judges || !Array.isArray(hackathon.judges)) return false;

    const userId = extractUserId(user);

    return hackathon.judges.some((judge: any) => {
        const judgeUserId = extractUserIdFromField(judge.user);
        return judgeUserId === userId && judge.status !== 'inactive';
    });
}

/**
 * Check if user is a mentor in a hackathon
 */
export function isHackathonMentor(
    user: IUserDoc | ObjectId | string,
    hackathon: IHackathonDoc | any
): boolean {
    if (!hackathon?.mentors || !Array.isArray(hackathon.mentors)) return false;

    const userId = extractUserId(user);

    return hackathon.mentors.some((mentor: any) => {
        const mentorUserId = extractUserIdFromField(mentor.user);
        return mentorUserId === userId && mentor.status !== 'inactive';
    });
}

/**
 * Check if user is a mentor for a project
 * Checks if user has a mentor profile that includes this project
 */
export function isProjectMentor(
    user: IUserDoc | ObjectId | string,
    project: IProjectDoc | any
): boolean {
    if (!project?._id) return false;

    const userId = extractUserId(user);
    const projectId = (project._id as any)?.toString() || project._id?.toString() || String(project._id);

    // Check if user has a mentor profile with this project
    // This assumes mentor profiles are populated or we need to query them
    // For now, we'll check if the project is in the mentor's projects array
    // In practice, you'd query: Mentor.findOne({ user: userId, projects: projectId, status: 'active' })
    // For now, return false and let the permission service handle the actual check
    return false; // Will be implemented via database query in permission service
}

/**
 * Check if user is a judge for a project
 * Checks if user has a judge profile that includes this project
 */
export function isProjectJudge(
    user: IUserDoc | ObjectId | string,
    project: IProjectDoc | any
): boolean {
    if (!project?._id) return false;

    const userId = extractUserId(user);
    const projectId = (project._id as any)?.toString() || project._id?.toString() || String(project._id);

    // Check if user has a judge profile with this project
    // This assumes judge profiles are populated or we need to query them
    // In practice, you'd query: Judge.findOne({ user: userId, projects: projectId, status: 'active' })
    // For now, return false and let the permission service handle the actual check
    return false; // Will be implemented via database query in permission service
}

/**
 * Check if user is a mentor in a workspace
 */
export function isWorkspaceMentor(
    user: IUserDoc | ObjectId | string,
    workspace: IWorkspaceDoc | any
): boolean {
    if (!workspace?.mentors || !Array.isArray(workspace.mentors)) return false;

    const userId = extractUserId(user);

    return workspace.mentors.some((mentor: any) => {
        const mentorUserId = extractUserIdFromField(mentor);
        return mentorUserId === userId;
    });
}

/**
 * Check if user is a judge in a workspace
 */
export function isWorkspaceJudge(
    user: IUserDoc | ObjectId | string,
    workspace: IWorkspaceDoc | any
): boolean {
    if (!workspace?.judges || !Array.isArray(workspace.judges)) return false;

    const userId = extractUserId(user);

    return workspace.judges.some((judge: any) => {
        const judgeUserId = extractUserIdFromField(judge);
        return judgeUserId === userId;
    });
}

/**
 * Get mentor permissions for a project
 */
export function getProjectMentorPermissions(): string[] {
    return projectMentorPermissionMap;
}

/**
 * Get judge permissions for a project
 */
export function getProjectJudgePermissions(): string[] {
    return projectJudgePermissionMap;
}

/**
 * Get mentor permissions for a workspace
 */
export function getWorkspaceMentorPermissions(): string[] {
    return workspaceMentorPermissionMap;
}

/**
 * Get judge permissions for a workspace
 */
export function getWorkspaceJudgePermissions(): string[] {
    return workspaceJudgePermissionMap;
}

/**
 * Get contextual permissions for a resource member role
 * This is the main function that routes to appropriate permission maps
 */
export function getContextualPermissions(
    resourceType: 'workspace' | 'project' | 'hackathon',
    memberRole: WorkspaceMemberRole | ProjectMemberRole | HackathonMemberRole | null
): string[] {
    if (!memberRole) return [];

    switch (resourceType) {
        case 'workspace':
            return getWorkspaceMemberPermissions(memberRole as WorkspaceMemberRole);
        case 'project':
            return getProjectMemberPermissions(memberRole as ProjectMemberRole);
        case 'hackathon':
            return getHackathonMemberPermissions(memberRole as HackathonMemberRole);
        default:
            return [];
    }
}

/**
 * Check if a permission matches any of the permissions in the set
 * Supports wildcard matching (entity:* or *:action)
 */
export function matchPermission(requested: string, perms: Set<string> | string[]): boolean {
    const permSet = perms instanceof Set ? perms : new Set(perms.map(p => p.toLowerCase()));
    requested = requested.toLowerCase();

    if (permSet.has('*:*')) return true; // global wildcard
    if (permSet.has(requested)) return true;

    // wildcard checks: entity:* or *:action
    const [entity, action] = requested.split(':');
    if (entity && permSet.has(`${entity}:*`)) return true;
    if (action && permSet.has(`*:${action}`)) return true;

    return false;
}
