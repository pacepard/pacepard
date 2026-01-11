import { Types } from 'mongoose';
import { dateToday, IDateToday } from '@btffamily/pacitude';
import { ITeamDoc, TeamMemberRole } from './team.interface';
import { CreateTeamDTO, UpdateTeamDTO } from './team.dto';
import teamRepository from './team.repository';
import projectRepository from '../project/project.repository';
import workspaceRepository from '../workspace/workspace.repository';
import businessRepository from '../business/business.repository';
import { IResult } from '../../utils/interfaces.util';
import { genTeamCode } from '../../utils/code.util';
import taskRepository from '../task/task.repository';

class TeamService {
    public result: IResult;
    public today: IDateToday;

    constructor() {
        this.today = dateToday(new Date());
        this.result = { error: false, message: '', code: 200, data: {} };
    }

    /**
     * @name createTeam
     * @description Creates a new team within a project with strict lineage validation
     * @param data - CreateTeamDTO containing team details
     * @returns Promise<IResult>
     */
    public async createTeam(data: CreateTeamDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { user, projectId, name, description } = data;

        // Validate required fields
        if (!name || !projectId) {
            result.error = true;
            result.code = 400;
            result.message = 'Name and project ID are required';
            return result;
        }

        // Validate user
        if (!user) {
            result.error = true;
            result.code = 400;
            result.message = 'User information is required to create a team';
            return result;
        }

        // Validate project exists
        const projectCheck = await projectRepository.findById(projectId);
        if (projectCheck.error || !projectCheck.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Project not found';
            return result;
        }

        const project = projectCheck.data as any;

        // Get workspace and business from project
        const workspaceId =
            project.workspace?._id || project.workspace || project.workspaceId;
        const businessId =
            project.business?._id || project.business || project.businessId;

        // Validate workspace exists
        const workspaceCheck = await workspaceRepository.findById(
            String(workspaceId),
        );
        if (workspaceCheck.error || !workspaceCheck.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        // Validate business exists
        const businessCheck = await businessRepository.findById(
            String(businessId),
        );
        if (businessCheck.error || !businessCheck.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Business not found';
            return result;
        }

        // Check if user is a member of the project
        const projectMembers = project.members || [];
        const isProjectMember = projectMembers.some(
            (m: any) =>
                String(m.user?._id || m.user) === String(user.id || user._id),
        );

        if (!isProjectMember) {
            result.error = true;
            result.code = 403;
            result.message =
                'User must be a member of the project to create a team';
            return result;
        }

        // Check if team with same name already exists in project
        const existingTeamResult = await teamRepository.findAll({
            project: new Types.ObjectId(projectId),
            name: name.trim(),
        });
        if (
            existingTeamResult.error === false &&
            existingTeamResult.data &&
            Array.isArray(existingTeamResult.data) &&
            existingTeamResult.data.length > 0
        ) {
            result.error = true;
            result.code = 400;
            result.message =
                'Team with this name already exists in the project';
            return result;
        }

        // Prepare team data
        const teamCode = genTeamCode();
        const teamData: any = {
            code: teamCode,
            name: name.trim(),
            description: description || '',
            workspace: new Types.ObjectId(String(workspaceId)),
            business: new Types.ObjectId(String(businessId)),
            project: new Types.ObjectId(projectId),
            createdBy: new Types.ObjectId(String(user.id || user._id)),
            members: [
                {
                    user: new Types.ObjectId(String(user.id || user._id)),
                    role: TeamMemberRole.LEAD,
                    joinedAt: new Date(),
                },
            ],
            tasks: [],
        };

        const createResult = await teamRepository.createTeam(teamData);
        if (createResult.error) {
            result.error = true;
            result.code = createResult.code || 500;
            result.message = createResult.message;
            return result;
        }

        result.message = 'Team created successfully';
        result.code = 201;
        result.data = createResult.data;
        return result;
    }

    /**
     * @name getTeam
     * @description Retrieves a team by its ID or code
     * @param idOrCode - Team ID or code
     * @returns Promise<IResult>
     */
    public async getTeam(idOrCode: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const populatePaths = [
            {
                path: 'members.user',
                select: 'firstName lastName email profileImage',
            },
            { path: 'workspace', select: 'name' },
            { path: 'business', select: 'businessName code' },
            { path: 'project', select: 'title code' },
            { path: 'createdBy', select: 'firstName lastName email' },
        ];

        const findResult = await teamRepository.findTeam(
            idOrCode,
            populatePaths,
        );

        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = findResult.code || 404;
            result.message = findResult.message || 'Team not found';
            return result;
        }

        result.message = 'Team retrieved successfully';
        result.data = findResult.data;
        return result;
    }

    /**
     * @name getAllTeams
     * @description Retrieves all teams with pagination, filtering, and sorting
     * @param query - Query parameters for filtering, pagination, and sorting
     * @returns Promise<IResult>
     */
    public async getAllTeams(query: any): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const options = {
            populate: [
                { path: 'createdBy', select: 'firstName lastName' },
                { path: 'workspace', select: 'name' },
                { path: 'business', select: 'businessName code' },
                { path: 'project', select: 'title code' },
            ],
            ...query,
        };

        const filter = { ...query };

        const queryResult = await teamRepository.getTeams(filter, options);

        if (queryResult.error) {
            result.error = true;
            result.code = queryResult.code || 500;
            result.message = queryResult.message || 'Failed to retrieve teams';
            return result;
        }

        result.message = queryResult.message || 'Teams retrieved successfully';
        result.data = queryResult.data;
        result.pagination = queryResult.pagination;
        if (result.pagination) {
            result.pagination.total = queryResult.pagination!.total;
            result.pagination.count = queryResult.pagination!.count;
        }
        return result;
    }

    /**
     * @name getTeamsByProject
     * @description Retrieves all teams for a specific project
     * @param projectId - Project ID
     * @returns Promise<IResult>
     */
    public async getTeamsByProject(projectId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (!projectId) {
            result.error = true;
            result.code = 400;
            result.message = 'Project ID is required';
            return result;
        }

        const findResult = await teamRepository.findByProject(projectId);
        if (findResult.error) {
            result.error = true;
            result.code = findResult.code || 500;
            result.message =
                findResult.message || 'Failed to retrieve teams for project';
            return result;
        }

        result.message = 'Teams retrieved successfully';
        result.data = findResult.data;
        return result;
    }

    /**
     * @name updateTeam
     * @description Updates team information with whitelist validation
     * @param teamId - Team ID
     * @param updateData - UpdateTeamDTO containing fields to update
     * @returns Promise<IResult>
     */
    public async updateTeam(
        teamId: string,
        updateData: UpdateTeamDTO,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (!teamId) {
            result.error = true;
            result.code = 400;
            result.message = 'Team ID is required';
            return result;
        }

        const teamResult = await teamRepository.findById(teamId);
        if (teamResult.error || !teamResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Team not found';
            return result;
        }

        // Whitelist of allowed fields to update
        const allowed: (keyof ITeamDoc)[] = ['name', 'description'];

        const finalUpdate: Partial<ITeamDoc> = {};

        for (const key of allowed) {
            if (updateData[key] !== undefined) {
                const value = updateData[key];
                (finalUpdate as any)[key] =
                    typeof value === 'string' ? value.trim() : value;
            }
        }

        const updateResult = await teamRepository.updateTeam(
            teamId,
            finalUpdate,
        );

        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code || 500;
            result.message = updateResult.message || 'Failed to update team';
            return result;
        }

        result.message = 'Team updated successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name deleteTeam
     * @description Deletes a team and performs cascading delete of related entities
     * @param teamId - Team ID
     * @returns Promise<IResult>
     */
    public async deleteTeam(teamId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (!teamId) {
            result.error = true;
            result.code = 400;
            result.message = 'Team ID is required';
            return result;
        }

        const teamResult = await teamRepository.findById(teamId);
        if (teamResult.error || !teamResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Team not found';
            return result;
        }

        try {
            // Cascading delete: Unassign tasks from this team
            const team = teamResult.data as any;
            const taskIds = team.tasks || [];
            if (taskIds.length > 0) {
                await taskRepository.updateMany(
                    {
                        _id: { $in: taskIds },
                    },
                    { $unset: { teamId: '' } },
                );
            }

            // Delete the team itself
            const deleteResult = await teamRepository.deleteTeam(teamId);
            if (deleteResult.error) {
                result.error = true;
                result.code = deleteResult.code || 500;
                result.message =
                    deleteResult.message || 'Failed to delete team';
                return result;
            }

            result.message = 'Team deleted successfully';
            result.data = deleteResult.data;
            return result;
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = `Cascading delete failed: ${error.message}`;
            return result;
        }
    }

    /**
     * @name addMember
     * @description Adds a member to a team (only if they are already in the project)
     * @param teamId - Team ID
     * @param userId - User ID to add
     * @param role - Role for the member
     * @returns Promise<IResult>
     */
    public async addMember(
        teamId: string,
        userId: string,
        role: string,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (!teamId || !userId) {
            result.error = true;
            result.code = 400;
            result.message = 'Team ID and User ID are required';
            return result;
        }

        // Validate userId is a valid ObjectId
        if (!Types.ObjectId.isValid(userId)) {
            result.error = true;
            result.code = 400;
            result.message = 'Invalid user ID';
            return result;
        }

        const teamResult = await teamRepository.findById(teamId);
        if (teamResult.error || !teamResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Team not found';
            return result;
        }

        const team = teamResult.data as any;

        // Check if user is already a member
        const existingMember = team.members.find(
            (m: any) => String(m.user?._id || m.user) === userId,
        );
        if (existingMember) {
            result.error = true;
            result.code = 400;
            result.message = 'User is already a member of this team';
            return result;
        }

        // THE GATEKEEPER: Is this user actually in the Project?
        const projectId = String(
            team.project?._id || team.project || team.projectId,
        );
        const projectResult = await projectRepository.findById(projectId);
        if (projectResult.error || !projectResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Project not found';
            return result;
        }

        const project = projectResult.data as any;
        const projectMembers = project.members || [];
        const isProjectMember = projectMembers.some(
            (m: any) => String(m.user?._id || m.user) === userId,
        );

        if (!isProjectMember) {
            result.error = true;
            result.code = 403;
            result.message =
                'User must be invited to the Project before being assigned to a Team';
            return result;
        }

        // Validate member role enum
        const memberRole = role || TeamMemberRole.MEMBER;
        if (
            !Object.values(TeamMemberRole).includes(
                memberRole as TeamMemberRole,
            )
        ) {
            result.error = true;
            result.code = 400;
            result.message = 'Invalid member role';
            return result;
        }

        // Add member using idempotent operation
        const updateResult = await teamRepository.updateTeam(teamId, {
            $addToSet: {
                members: {
                    user: new Types.ObjectId(userId),
                    role: memberRole,
                    joinedAt: new Date(),
                },
            },
        } as any);

        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code || 500;
            result.message =
                updateResult.message || 'Failed to add member to team';
            return result;
        }

        result.message = 'Member added to team successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name removeMember
     * @description Removes a member from a team and performs cleanup
     * @param teamId - Team ID
     * @param userId - User ID to remove
     * @returns Promise<IResult>
     */
    public async removeMember(
        teamId: string,
        userId: string,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (!teamId || !userId) {
            result.error = true;
            result.code = 400;
            result.message = 'Team ID and User ID are required';
            return result;
        }

        // Validate userId is a valid ObjectId
        if (!Types.ObjectId.isValid(userId)) {
            result.error = true;
            result.code = 400;
            result.message = 'Invalid user ID';
            return result;
        }

        const teamResult = await teamRepository.findById(teamId);
        if (teamResult.error || !teamResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Team not found';
            return result;
        }

        try {
            // Remove from team members
            await teamRepository.removeMember(teamId, userId);

            // Unassign from all tasks in this team
            const team = teamResult.data as any;
            const taskIds = team.tasks || [];
            if (taskIds.length > 0) {
                await taskRepository.updateMany(
                    {
                        _id: { $in: taskIds },
                        assignedTo: new Types.ObjectId(userId),
                    },
                    { $set: { assignedTo: null } },
                );
            }

            result.message = 'Member removed from team successfully';
            result.data = { teamId, userId };
            return result;
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = `Failed to remove member: ${error.message}`;
            return result;
        }
    }

    /**
     * @name updateMemberRole
     * @description Updates a team member's role
     * @param teamId - Team ID
     * @param userId - User ID
     * @param newRole - New role for the member
     * @returns Promise<IResult>
     */
    public async updateMemberRole(
        teamId: string,
        userId: string,
        newRole: string,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (!teamId || !userId || !newRole) {
            result.error = true;
            result.code = 400;
            result.message = 'Team ID, User ID, and role are required';
            return result;
        }

        // Validate userId is a valid ObjectId
        if (!Types.ObjectId.isValid(userId)) {
            result.error = true;
            result.code = 400;
            result.message = 'Invalid user ID';
            return result;
        }

        // Validate member role enum
        if (
            !Object.values(TeamMemberRole).includes(newRole as TeamMemberRole)
        ) {
            result.error = true;
            result.code = 400;
            result.message = 'Invalid member role';
            return result;
        }

        const teamResult = await teamRepository.findById(teamId);
        if (teamResult.error || !teamResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Team not found';
            return result;
        }

        const updateResult = await teamRepository.updateMemberRole(
            teamId,
            userId,
            newRole,
        );

        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code || 500;
            result.message =
                updateResult.message || 'Failed to update member role';
            return result;
        }

        result.message = 'Team member role updated successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name rotateMember
     * @description Rotates a member between teams in the same project
     * @param projectId - Project ID
     * @param userId - User ID being moved
     * @param targetTeamId - The destination team ID
     * @returns Promise<IResult>
     */
    public async rotateMember(
        projectId: string,
        userId: string,
        targetTeamId: string,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (!projectId || !userId || !targetTeamId) {
            result.error = true;
            result.code = 400;
            result.message =
                'Project ID, User ID, and target team ID are required';
            return result;
        }

        // Validate userId is a valid ObjectId
        if (!Types.ObjectId.isValid(userId)) {
            result.error = true;
            result.code = 400;
            result.message = 'Invalid user ID';
            return result;
        }

        // Lineage Verification: Target team must belong to the project
        const targetTeamResult = await teamRepository.findById(targetTeamId);
        if (targetTeamResult.error || !targetTeamResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Target team not found';
            return result;
        }

        const targetTeam = targetTeamResult.data as any;
        const targetTeamProjectId = String(
            targetTeam.project?._id ||
                targetTeam.project ||
                targetTeam.projectId,
        );

        if (targetTeamProjectId !== projectId) {
            result.error = true;
            result.code = 400;
            result.message = 'Target team does not belong to this project';
            return result;
        }

        // Project Membership Check: Can't rotate someone who isn't in the project
        const projectResult = await projectRepository.findById(projectId);
        if (projectResult.error || !projectResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Project not found';
            return result;
        }

        const project = projectResult.data as any;
        const projectMembers = project.members || [];
        const isProjectMember = projectMembers.some(
            (m: any) => String(m.user?._id || m.user) === userId,
        );

        if (!isProjectMember) {
            result.error = true;
            result.code = 400;
            result.message = 'User is not a member of this project';
            return result;
        }

        try {
            // Atomic Swap: Remove from all teams, then Add to target
            await teamRepository.removeUserFromProjectTeams(projectId, userId);

            const addResult = await teamRepository.addMember(
                targetTeamId,
                userId,
                TeamMemberRole.MEMBER,
            );

            if (addResult.error) {
                result.error = true;
                result.code = addResult.code || 500;
                result.message =
                    addResult.message || 'Failed to add member to target team';
                return result;
            }

            result.message = 'Member rotated to target team successfully';
            result.data = addResult.data;
            return result;
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = `Failed to rotate member: ${error.message}`;
            return result;
        }
    }
}

export default new TeamService();
