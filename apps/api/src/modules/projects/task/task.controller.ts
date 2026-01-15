import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from '../../../middlewares/async.mdw';
import ErrorResponse from '../../../utils/error.util';
import taskService from './task.service';
import taskRepository from './task.repository';
import { CreateTaskDTO, UpdateTaskDTO } from './task.dto';
import redisWrapper from '../../../middlewares/redis.mdw';

/**
 * @name createTask
 * @description Creates a new task
 * @route POST /projects/:projectId/teams/:teamId/tasks
 * @access Private
 */
export const createTask: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { projectId, teamId } = req.params;
        const { workspaceId } = req.body;

        if (!projectId)
            return next(new ErrorResponse('Project ID is required', 400, []));
        if (!teamId)
            return next(new ErrorResponse('Team ID is required', 400, []));
        if (!workspaceId)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

        const data: CreateTaskDTO = {
            ...req.body,
            workspaceId,
            projectId,
            teamId,
            user: (req as any).user,
            createdBy: userId,
        };

        const result = await taskService.createTask(data);

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
 * @name getTask
 * @description Retrieves task information by ID
 * @route GET /tasks/:id
 * @access Private
 */
export const getTask: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id) return next(new ErrorResponse('Task ID is required', 400, []));

        const cacheKey = `task:${id}`;
        const cacheTTL = 300;

        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: cached,
                message: 'Task retrieved successfully (cached).',
                status: 200,
            });
        }

        const result = await taskService.getTask(id);

        if (result.error || !result.data) {
            return next(
                new ErrorResponse(
                    result.message || 'Task not found',
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
 * @name getProjectTasks
 * @description Retrieves all tasks for a specific project
 * @route GET /projects/:projectId/tasks
 * @access Private
 */
export const getProjectTasks: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { projectId } = req.params;
        if (!projectId)
            return next(new ErrorResponse('Project ID is required', 400, []));

        const cacheKey = `project:${projectId}:tasks`;
        const cacheTTL = 180;

        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: cached,
                message: 'Tasks retrieved successfully (cached).',
                status: 200,
            });
        }

        const result = await taskService.getTasksByProject(projectId);

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
 * @name getTeamTasks
 * @description Retrieves all tasks for a specific team
 * @route GET /teams/:teamId/tasks
 * @access Private
 */
export const getTeamTasks: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { teamId } = req.params;
        if (!teamId)
            return next(new ErrorResponse('Team ID is required', 400, []));

        const cacheKey = `team:${teamId}:tasks`;
        const cacheTTL = 180;

        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: cached,
                message: 'Tasks retrieved successfully (cached).',
                status: 200,
            });
        }

        const result = await taskService.getTasksByTeam(teamId);

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
 * @name getAssigneeTasks
 * @description Retrieves all tasks assigned to a user
 * @route GET /users/:userId/tasks
 * @access Private
 */
export const getAssigneeTasks: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId || (req as any).user?.id;
        if (!userId)
            return next(new ErrorResponse('User ID is required', 400, []));

        const result = await taskService.getTasksByAssignee(userId);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
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
 * @name updateTask
 * @description Updates task information
 * @route PUT /tasks/:id
 * @access Private
 */
export const updateTask: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id) return next(new ErrorResponse('Task ID is required', 400, []));

        const data: UpdateTaskDTO = req.body;

        const taskResult = await taskRepository.findTask(id);
        if (taskResult.error || !taskResult.data) {
            return next(new ErrorResponse('Task not found', 404, []));
        }

        const result = await taskService.updateTask(id, data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`task:${id}`);
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
 * @name deleteTask
 * @description Deletes a task
 * @route DELETE /tasks/:id
 * @access Private
 */
export const deleteTask: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id) return next(new ErrorResponse('Task ID is required', 400, []));

        const taskResult = await taskRepository.findTask(id);
        if (taskResult.error || !taskResult.data) {
            return next(new ErrorResponse('Task not found', 404, []));
        }

        const result = await taskService.deleteTask(id);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`task:${id}`);
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
 * @name assignTask
 * @description Assigns a task to users
 * @route POST /tasks/:id/assign
 * @access Private
 */
export const assignTask: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        const { userIds } = req.body;

        if (!id) return next(new ErrorResponse('Task ID is required', 400, []));
        if (!userIds || !Array.isArray(userIds))
            return next(
                new ErrorResponse('User IDs array is required', 400, []),
            );

        const result = await taskService.assignTask(id, userIds);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`task:${id}`);
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
