import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from '../../../middlewares/async.mdw';
import ErrorResponse from '../../../utils/error.util';
import projectService from './project.service';
import projectRepository from './project.repository';
import { CreateProjectDTO, UpdateProjectDTO } from './project.dto';
import redisWrapper from '../../../middlewares/redis.mdw';

/**
 * @name createProject
 * @description Creates a new project
 * @route POST /workspaces/:workspaceId/projects
 * @access Private
 */
export const createProject: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { workspaceId } = req.params;
        if (!workspaceId)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

        const data: CreateProjectDTO = {
            ...req.body,
            workspaceId,
            user: (req as any).user,
            createdBy: userId,
        };

        const result = await projectService.createProject(data);

        if (result.error) {
            return next(new ErrorResponse(result.message, result.code, []));
        }

        res.status(201).json({
            error: false,
            errors: [],
            data: result.data,
            status: 201,
        });
    },
);

/**
 * @name getProject
 * @description Retrieves project information by ID or slug
 * @route GET /projects/:id
 * @access Private
 */
export const getProject: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Project ID is required', 400, []));

        const cacheKey = `project:${id}`;
        const cacheTTL = 300;

        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: cached,
                message: 'Project retrieved successfully (cached).',
                status: 200,
            });
        }

        const result = await projectService.getProject(id);

        if (result.error || !result.data) {
            return next(
                new ErrorResponse(result.message, result.code || 404, []),
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
 * @name getWorkspaceProjects
 * @description Retrieves all projects for a specific workspace
 * @route GET /workspaces/:workspaceId/projects
 * @access Private
 */
export const getWorkspaceProjects: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { workspaceId } = req.params;
        if (!workspaceId)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

        const cacheKey = `workspace:${workspaceId}:projects`;
        const cacheTTL = 180;

        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: cached,
                message: 'Projects retrieved successfully (cached).',
                status: 200,
            });
        }

        const result = await projectService.getProjectsByWorkspace(workspaceId);

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
 * @name updateProject
 * @description Updates project information
 * @route PUT /projects/:id
 * @access Private
 */
export const updateProject: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Project ID is required', 400, []));

        const data: UpdateProjectDTO = req.body;

        const projectResult = await projectRepository.findById(id);
        if (projectResult.error || !projectResult.data) {
            return next(new ErrorResponse('Project not found', 404, []));
        }

        const result = await projectService.updateProject(id, data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`project:${id}`);
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
 * @name deleteProject
 * @description Deletes a project
 * @route DELETE /projects/:id
 * @access Private
 */
export const deleteProject: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Project ID is required', 400, []));

        const projectResult = await projectRepository.findById(id);
        if (projectResult.error || !projectResult.data) {
            return next(new ErrorResponse('Project not found', 404, []));
        }

        const result = await projectService.deleteProject(id);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`project:${id}`);
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
 * @name addMember
 * @description Adds a member to a project
 * @route POST /projects/:id/members
 * @access Private
 */
export const addMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        const { userId: memberUserId, role } = req.body;

        if (!id)
            return next(new ErrorResponse('Project ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('User ID is required', 400, []));

        const result = await projectService.addMember(id, memberUserId, role);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`project:${id}`);
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
 * @name removeMember
 * @description Removes a member from a project
 * @route DELETE /projects/:id/members/:userId
 * @access Private
 */
export const removeMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id, userId: memberUserId } = req.params;

        if (!id)
            return next(new ErrorResponse('Project ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('User ID is required', 400, []));

        const result = await projectService.removeMember(id, memberUserId);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`project:${id}`);
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
 * @name publishProject
 * @description Publishes a project
 * @route POST /projects/:id/publish
 * @access Private
 */
export const publishProject: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Project ID is required', 400, []));

        const result = await projectService.publishProject(id);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`project:${id}`);
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
 * @name closeProject
 * @description Closes a project
 * @route POST /projects/:id/close
 * @access Private
 */
export const closeProject: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Project ID is required', 400, []));

        const result = await projectService.closeProject(id);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`project:${id}`);
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
