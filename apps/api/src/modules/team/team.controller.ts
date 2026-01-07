import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/async.mdw';
import ErrorResponse from '../../utils/error.util';
import teamService from './team.service';
import { ProjectMemberRole } from '../../utils/enums.util';
import redisWrapper from '../../middlewares/redis.mdw';

/**
 * @name createTeam
 * @description Creates a new team within a project
 * @route POST /projects/:projectId/teams
 * @access Private
 */
export const createTeam = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { projectId } = req.params;
        const { name, description } = req.body;
        
        if (!projectId)
            return next(new ErrorResponse('Project ID is required', 400, []));
        if (!name)
            return next(new ErrorResponse('Team name is required', 400, []));

        try {
            const userRole = (req as any).user?.projectMemberRole || ProjectMemberRole.LEAD;
            
            const result = await teamService.createTeam(
                projectId,
                { name, description },
                userId,
                userRole
            );

            if (result.error) {
                return next(
                    new ErrorResponse(result.message, result.code, []),
                );
            }

            res.status(201).json({
                error: false,
                errors: [],
                data: result.data,
                message: result.message || 'Team created successfully.',
                status: 201,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to create team',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name getProjectTeams
 * @description Gets all teams for a project
 * @route GET /projects/:projectId/teams
 * @access Private
 */
export const getProjectTeams = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { projectId } = req.params;
        if (!projectId)
            return next(new ErrorResponse('Project ID is required', 400, []));

        const cacheKey = `project:${projectId}:teams`;
        const cacheTTL = 180;

        try {
            const cached = await redisWrapper.fetchData<any>(cacheKey);
            if (cached) {
                return res.status(200).json({
                    error: false,
                    errors: [],
                    data: cached,
                    message: 'Teams retrieved successfully (cached).',
                    status: 200,
                });
            }

            const result = await teamService.getProjectTeams(projectId);

            if (result.error) {
                return next(
                    new ErrorResponse(result.message, result.code || 500, []),
                );
            }

            await redisWrapper.keepData(
                { key: cacheKey, value: result.data },
                cacheTTL,
            );

            res.status(200).json({
                error: false,
                errors: [],
                data: result.data,
                message: result.message || 'Teams retrieved successfully.',
                status: 200,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to retrieve teams',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name getTeam
 * @description Gets a team by ID
 * @route GET /teams/:id
 * @access Private
 */
export const getTeam = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Team ID is required', 400, []));

        const cacheKey = `team:${id}`;
        const cacheTTL = 300;

        try {
            const cached = await redisWrapper.fetchData<any>(cacheKey);
            if (cached) {
                return res.status(200).json({
                    error: false,
                    errors: [],
                    data: cached,
                    message: 'Team retrieved successfully (cached).',
                    status: 200,
                });
            }

            const result = await teamService.getTeam(id);

            if (result.error) {
                return next(
                    new ErrorResponse(
                        result.message || 'Team not found',
                        result.code || 404,
                        [],
                    ),
                );
            }

            await redisWrapper.keepData(
                { key: cacheKey, value: result.data },
                cacheTTL,
            );

            res.status(200).json({
                error: false,
                errors: [],
                data: result.data,
                message: result.message || 'Team retrieved successfully.',
                status: 200,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to retrieve team',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name addTeamMember
 * @description Adds a member to a team
 * @route POST /teams/:teamId/members
 * @access Private
 */
export const addTeamMember = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { teamId } = req.params;
        const { memberUserId, role } = req.body;

        if (!teamId)
            return next(new ErrorResponse('Team ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('Member user ID is required', 400, []));
        if (!role)
            return next(new ErrorResponse('Role is required', 400, []));

        try {
            const actorRole = (req as any).user?.projectMemberRole || ProjectMemberRole.MEMBER;
            
            const result = await teamService.addMember(
                teamId,
                memberUserId,
                role,
                actorRole
            );

            if (result.error) {
                return next(
                    new ErrorResponse(result.message, result.code || 500, []),
                );
            }

            try {
                await redisWrapper.deleteData(`team:${teamId}`);
            } catch (cacheError) {
                console.error('Cache invalidation failed:', cacheError);
            }

            res.status(200).json({
                error: false,
                errors: [],
                data: result.data,
                message: result.message || 'Member added to team successfully.',
                status: 200,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to add team member',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name removeTeamMember
 * @description Removes a member from a team
 * @route DELETE /teams/:teamId/members/:userId
 * @access Private
 */
export const removeTeamMember = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { teamId, userId: memberUserId } = req.params;

        if (!teamId)
            return next(new ErrorResponse('Team ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('Member user ID is required', 400, []));

        try {
            const actorRole = (req as any).user?.projectMemberRole || ProjectMemberRole.MEMBER;
            
            const result = await teamService.removeMember(teamId, memberUserId, actorRole);

            if (result.error) {
                return next(
                    new ErrorResponse(result.message, result.code || 500, []),
                );
            }

            try {
                await redisWrapper.deleteData(`team:${teamId}`);
            } catch (cacheError) {
                console.error('Cache invalidation failed:', cacheError);
            }

            res.status(200).json({
                error: false,
                errors: [],
                data: result.data,
                message: result.message || 'Member removed from team successfully.',
                status: 200,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to remove team member',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name updateTeamMemberRole
 * @description Updates a team member's role
 * @route PUT /teams/:teamId/members/:userId/role
 * @access Private
 */
export const updateTeamMemberRole = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { teamId, userId: memberUserId } = req.params;
        const { role } = req.body;

        if (!teamId)
            return next(new ErrorResponse('Team ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('Member user ID is required', 400, []));
        if (!role)
            return next(new ErrorResponse('Role is required', 400, []));

        try {
            const actorRole = (req as any).user?.projectMemberRole || ProjectMemberRole.MEMBER;
            
            const result = await teamService.updateMemberRole(
                teamId,
                memberUserId,
                role,
                actorRole
            );

            if (result.error) {
                return next(
                    new ErrorResponse(result.message, result.code || 500, []),
                );
            }

            try {
                await redisWrapper.deleteData(`team:${teamId}`);
            } catch (cacheError) {
                console.error('Cache invalidation failed:', cacheError);
            }

            res.status(200).json({
                error: false,
                errors: [],
                data: result.data,
                message: result.message || 'Team member role updated successfully.',
                status: 200,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to update team member role',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name rotateMember
 * @description Rotates a talent between teams in the same project
 * @route POST /projects/:projectId/teams/rotate
 * @access Private
 * 
 * This allows authorized users (project owners and maintainers) to reorganize 
 * team membership during an ongoing project. Members can be moved between
 * teams based on project prerogative.
 */
export const rotateMember = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { projectId } = req.params;
        const { memberUserId, targetTeamId } = req.body;

        if (!projectId)
            return next(new ErrorResponse('Project ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('Member user ID is required', 400, []));
        if (!targetTeamId)
            return next(new ErrorResponse('Target team ID is required', 400, []));

        try {
            const actorRole = (req as any).user?.projectMemberRole || ProjectMemberRole.MEMBER;
            
            const result = await teamService.rotateMember(
                projectId,
                memberUserId,
                targetTeamId,
                userId,
                actorRole
            );

            if (result.error) {
                return next(
                    new ErrorResponse(result.message, result.code || 500, []),
                );
            }

            // Invalidate cache for the project's teams
            try {
                await redisWrapper.deleteData(`project:${projectId}:teams`);
                await redisWrapper.deleteData(`team:${targetTeamId}`);
            } catch (cacheError) {
                console.error('Cache invalidation failed:', cacheError);
            }

            res.status(200).json({
                error: false,
                errors: [],
                data: result.data,
                message: result.message || 'Member rotated successfully.',
                status: 200,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to rotate member',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name deleteTeam
 * @description Deletes a team
 * @route DELETE /teams/:id
 * @access Private
 */
export const deleteTeam = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;

        if (!id)
            return next(new ErrorResponse('Team ID is required', 400, []));

        try {
            const actorRole = (req as any).user?.projectMemberRole || ProjectMemberRole.MEMBER;
            
            const result = await teamService.deleteTeam(id, actorRole);

            if (result.error) {
                return next(
                    new ErrorResponse(result.message, result.code || 500, []),
                );
            }

            try {
                await redisWrapper.deleteData(`team:${id}`);
            } catch (cacheError) {
                console.error('Cache invalidation failed:', cacheError);
            }

            res.status(200).json({
                error: false,
                errors: [],
                data: result.data,
                message: result.message || 'Team deleted successfully.',
                status: 200,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to delete team',
                    500,
                    [],
                ),
            );
        }
    },
);
