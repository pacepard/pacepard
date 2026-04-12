import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from '../../../middlewares/async.mdw';
import ErrorResponse from '../../../utils/error.util';
import teamService from './team.service';
import { CreateTeamDTO, UpdateTeamDTO } from './team.dto';
import redisWrapper from '../../../middlewares/redis.mdw';

/**
 * @name createTeam
 * @description Creates a new team within a project
 * @route POST /projects/:projectId/teams
 * @access Private
 */
export const createTeam: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { projectId } = req.params;
        const { name, description } = req.body;

        if (!projectId)
            return next(new ErrorResponse('Project ID is required', 400, []));
        if (!name)
            return next(new ErrorResponse('Team name is required', 400, []));

        const data: CreateTeamDTO = {
            user: (req as any).user,
            projectId,
            name,
            description,
            createdBy: userId,
        };

        const result = await teamService.createTeam(data);

        if (result.error) {
            return next(new ErrorResponse(result.message, result.code, []));
        }

        res.status(201).json({
            error: false,
            errors: [],
            data: result.data,
            message: result.message,
            status: 201,
        });
    },
);

/**
 * @name getProjectTeams
 * @description Gets all teams for a project
 * @route GET /projects/:projectId/teams
 * @access Private
 */
export const getProjectTeams: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { projectId } = req.params;
        if (!projectId)
            return next(new ErrorResponse('Project ID is required', 400, []));

        const cacheKey = `project:${projectId}:teams`;
        const cacheTTL = 180;

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

        const result = await teamService.getTeamsByProject(projectId);

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
            message: result.message,
            status: 200,
        });
    },
);

/**
 * @name generateTeamShareableLink
 * @description Generates a shareable link for a team
 * @route POST /teams/:id/invite/shareable-link
 * @access  Private
 */
export const generateTeamShareableLink: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id) return next(new ErrorResponse('Team ID is required', 400, []));

        const { expiresInDays } = req.body;

        const result = await teamService.generateShareableLink(
            id,
            userId,
            expiresInDays || 7,
        );

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`team:${id}`);
        } catch (cacheError) {
            console.error('Cache invalidation failed:', cacheError);
        }

        res.status(200).json({
            error: false,
            errors: [],
            data: result.data,
            message: result.message,
            status: 200,
        });
    },
);

/**
 * @name getTeam
 * @description Gets a team by ID
 * @route GET /teams/:id
 * @access Private
 */
export const getTeam: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id) return next(new ErrorResponse('Team ID is required', 400, []));

        const cacheKey = `team:${id}`;
        const cacheTTL = 300;

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
            message: result.message,
            status: 200,
        });
    },
);

/**
 * @name updateTeam
 * @description Updates team information
 * @route PUT /teams/:id
 * @access Private
 */
export const updateTeam: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id) return next(new ErrorResponse('Team ID is required', 400, []));

        const data: UpdateTeamDTO = req.body;

        const result = await teamService.updateTeam(id, data);

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
            message: result.message,
            status: 200,
        });
    },
);

/**
 * @name addTeamMember
 * @description Adds a member to a team
 * @route POST /teams/:teamId/members
 * @access Private
 */
export const addTeamMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { teamId } = req.params;
        const { memberUserId, role } = req.body;

        if (!teamId)
            return next(new ErrorResponse('Team ID is required', 400, []));
        if (!memberUserId)
            return next(
                new ErrorResponse('Member user ID is required', 400, []),
            );
        if (!role) return next(new ErrorResponse('Role is required', 400, []));

        const result = await teamService.addMember(teamId, memberUserId, role);

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
            message: result.message,
            status: 200,
        });
    },
);

/**
 * @name removeTeamMember
 * @description Removes a member from a team
 * @route DELETE /teams/:teamId/members/:userId
 * @access Private
 */
export const removeTeamMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { teamId, userId: memberUserId } = req.params;

        if (!teamId)
            return next(new ErrorResponse('Team ID is required', 400, []));
        if (!memberUserId)
            return next(
                new ErrorResponse('Member user ID is required', 400, []),
            );

        const result = await teamService.removeMember(teamId, memberUserId);

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
            message: result.message,
            status: 200,
        });
    },
);

/**
 * @name updateTeamMemberRole
 * @description Updates a team member's role
 * @route PUT /teams/:teamId/members/:userId/role
 * @access Private
 */
export const updateTeamMemberRole: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { teamId, userId: memberUserId } = req.params;
        const { role } = req.body;

        if (!teamId)
            return next(new ErrorResponse('Team ID is required', 400, []));
        if (!memberUserId)
            return next(
                new ErrorResponse('Member user ID is required', 400, []),
            );
        if (!role) return next(new ErrorResponse('Role is required', 400, []));

        const result = await teamService.updateMemberRole(
            teamId,
            memberUserId,
            role,
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
            message: result.message,
            status: 200,
        });
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
export const rotateMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { projectId } = req.params;
        const { memberUserId, targetTeamId } = req.body;

        if (!projectId)
            return next(new ErrorResponse('Project ID is required', 400, []));
        if (!memberUserId)
            return next(
                new ErrorResponse('Member user ID is required', 400, []),
            );
        if (!targetTeamId)
            return next(
                new ErrorResponse('Target team ID is required', 400, []),
            );

        const result = await teamService.rotateMember(
            projectId,
            memberUserId,
            targetTeamId,
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
            message: result.message,
            status: 200,
        });
    },
);

/**
 * @name deleteTeam
 * @description Deletes a team
 * @route DELETE /teams/:id
 * @access Private
 */
export const deleteTeam: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;

        if (!id) return next(new ErrorResponse('Team ID is required', 400, []));

        const result = await teamService.deleteTeam(id);

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
            message: result.message,
            status: 200,
        });
    },
);
