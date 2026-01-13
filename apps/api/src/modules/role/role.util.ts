import { Types } from 'mongoose';
import { WorkspaceMemberRole, IWorkspaceDoc, IWorkspaceMember } from '../workspace/workspace.interface';
import { ProjectMemberRole, IProjectDoc, IProjectMember } from '../project/project.interface';
import { HackathonMemberRole, IHackathonDoc, IHackathonMember } from '../hackathon/hackathon.interface';
import { IUserDoc } from '../user/user.interface';

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
