import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/async.mdw';
import ErrorResponse from '../../utils/error.util';
import projectService from './project.service';
import projectRepository from './project.repository';
import { CreateProjectDTO, UpdateProjectDTO } from './project.dto';
import redisWrapper from '../../middlewares/redis.mdw';

/**
 * @name createProject
 * @description Creates a new project
 * @route POST /workspaces/:workspaceId/projects
 * @access Private
 */
export const createProject = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { workspaceId } = req.params;
        const data: CreateProjectDTO = {
            ...req.body,
            workspaceId,
            user: (req as any).user,
            createdBy: userId,
        };
        const result = await projectService.createProject(data);
        if (result.error) 
        return next(new ErrorResponse(result.message, result.code, []));

        res.status(201).json(result);
    },
);

/**
 * @name getProject
 * @description Retrieves project information by ID or slug
 * @route GET /projects/:id
 * @access Private
 */
export const getProject = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const cacheKey = `project:${id}`;
       
        const cached = await redisWrapper.fetchData<any>(cacheKey);

        if (cached) {
        return res.status(200).json({
                error: false,
                data: cached,
                message: 'Project retrieved successfully (cached).',
                status: 200,
            });
        }
        const result = await projectService.getProject(id);
        if (result.error) 
        return next(new ErrorResponse(result.message, result.code, []));
        await redisWrapper.keepData({ key: cacheKey, value: result.data }, 300);
        res.status(200).json(result);
    },
);

/**
 * @name getProjects
 * @description Retrieves all projects with filtering and pagination
 * @route GET /projects
 */
export const getProjects = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await projectService.getAllProjects(req.query);

      if (result.error) return next(new ErrorResponse(result.message, result.code, []));
        res.status(200).json(result);
    }
);

/**
 * @name getWorkspaceProjects
 * @description Retrieves all projects for a specific workspace
 * @route GET /workspaces/:workspaceId/projects
 * @access Private
 */
/**
 * @name getWorkspaceProjects
 * @description Retrieves all projects belonging to a specific workspace with caching.
 * @route GET /workspaces/:workspaceId/projects
 */
export const getWorkspaceProjects = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { workspaceId } = req.params;
        
        if (!workspaceId) {
            return next(new ErrorResponse('Workspace ID is required', 400, []));
        }

        const cacheKey = `workspace:${workspaceId}:projects`;
        const cacheTTL = 180;

        // 1. Check Cache
        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                data: cached,
                message: 'Projects retrieved successfully (cached).',
                status: 200,
            });
        }

        const result = await projectService.getProjectsByWorkspace(workspaceId);

        if (result.error) {
            return next(new ErrorResponse(result.message, result.code || 500, []));
        }

        // Update Cache for future requests
        await redisWrapper.keepData(
            { key: cacheKey, value: result.data },
            cacheTTL,
        );

        res.status(200).json(result);
    },
);

/**
 * @name updateProject
 * @description Updates project information
 * @route PUT /projects/:id
 * @access Private
 */
export const updateProject = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Project ID is required', 400, []));

        const data: UpdateProjectDTO = req.body;

        try {
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
                message: result.message || 'Project updated successfully.',
                status: 200,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to update project',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name deleteProject
 * @description Deletes a project
 * @route DELETE /projects/:id
 * @access Private
 */
export const deleteProject = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Project ID is required', 400, []));

        try {
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
                message: result.message || 'Project deleted successfully.',
                status: 200,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to delete project',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name addMember
 * @description Adds a member to a project
 * @route POST /projects/:id/members
 * @access Private
 */
export const addMember = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        const { userId: memberUserId, role } = req.body;

        if (!id)
            return next(new ErrorResponse('Project ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('User ID is required', 400, []));

        try {
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
                message: result.message || 'Member added successfully.',
                status: 200,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to add member',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name removeMember
 * @description Removes a member from a project
 * @route DELETE /projects/:id/members/:userId
 * @access Private
 */
export const removeMember = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id, userId: memberUserId } = req.params;

        if (!id)
            return next(new ErrorResponse('Project ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('User ID is required', 400, []));

        try {
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
                message: result.message || 'Member removed successfully.',
                status: 200,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to remove member',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name publishProject
 * @description Publishes a project
 * @route PATCH /projects/:id/publish
 * @access Private
 */
export const publishProject = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const result = await projectService.publishProject(id);
        if (result.error) return next(new ErrorResponse(result.message, result.code, []));
    },
);

/**
 * @name closeProject
 * @description Seals a project and clears cache
 * @route PATCH /projects/:id/close
 * @access Private
 */
export const closeProject = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const result = await projectService.closeProject(id);

        if (result.error) return next(new ErrorResponse(result.message, result.code, []));

        await redisWrapper.deleteData(`project:${id}`);
        res.status(200).json(result);
    },
);
