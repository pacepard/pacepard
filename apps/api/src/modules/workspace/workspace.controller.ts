import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/async.mdw';
import ErrorResponse from '../../utils/error.util';
import workspaceService from './workspace.service';
import workspaceRepository from './workspace.repository';
import { UpdateWorkspaceDTO, CreateWorkspaceDTO } from './workspace.dto';
import redisWrapper from '../../middlewares/redis.mdw';

/**
 * @name createWorkspace
 * @description Creates a new workspace
 * @route POST /workspace
 * @access  Private
 */
export const createWorkspace = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const data: CreateWorkspaceDTO = {
            ...req.body,
            createdBy: userId,
        };

        try {
            const result = await workspaceService.createWorkspace(data);

            if (result.error) {
                return next(
                    new ErrorResponse(result.message, result.code, []),
                );
            }

            res.status(201).json({
                error: false,
                errors: [],
                data: result.data,
                message: result.message || 'Workspace created successfully.',
                status: 201,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to create workspace',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name getWorkspace
 * @description Retrieves workspace information by ID
 * @route GET /workspace/:id
 * @access  Private
 */
export const getWorkspace = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

        const cacheKey = `workspace:${id}`;
        const cacheTTL = 300; // 5 minutes

        try {
            // Check cache first
            const cached = await redisWrapper.fetchData<any>(cacheKey);
            if (cached) {
                return res.status(200).json({
                    error: false,
                    errors: [],
                    data: cached,
                    message: 'Workspace retrieved successfully (cached).',
                    status: 200,
                });
            }

            // Get workspace from service
            const result = await workspaceService.getWorkspace(id);

            if (result.error || !result.data) {
                return next(
                    new ErrorResponse(
                        result.message || 'Workspace not found',
                        result.code || 404,
                        [],
                    ),
                );
            }

            // Cache the result
            await redisWrapper.keepData(
                { key: cacheKey, value: result.data },
                cacheTTL,
            );

            res.status(200).json({
                error: false,
                errors: [],
                data: result.data,
                message: result.message || 'Workspace retrieved successfully.',
                status: 200,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to retrieve workspace',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name getWorkspaces
 * @description Retrieves a paginated list of workspaces with filtering and sorting
 * @route GET /workspaces
 * @access  Private
 */
export const getWorkspaces = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            page = 1,
            limit = 25,
            sort = '-createdAt',
            select,
            populate,
            ...filters
        } = req.query;

        // Build cache key from query parameters
        const cacheKey = `workspaces:list:${JSON.stringify({ page, limit, sort, select, filters })}`;
        const cacheTTL = 180; // 3 minutes

        try {
            // Check cache first
            const cached = await redisWrapper.fetchData<any>(cacheKey);
            if (cached) {
                return res.status(200).json({
                    error: false,
                    errors: [],
                    data: cached.data,
                    pagination: cached.pagination,
                    count: cached.count,
                    total: cached.total,
                    message: 'Workspaces retrieved successfully (cached).',
                    status: 200,
                });
            }

            // Build query options
            const options: any = {
                page: parseInt(String(page), 10),
                limit: parseInt(String(limit), 10),
                sort: String(sort),
            };

            if (select) {
                options.select = String(select);
            }

            if (populate) {
                options.populate = String(populate);
            }

            // Get workspaces from service
            const result = await workspaceService.getWorkspaces(
                filters as any,
                options,
            );

            if (result.error) {
                return next(
                    new ErrorResponse(result.message, result.code || 500, []),
                );
            }

            // Prepare response data
            const responseData = {
                data: result.data,
                pagination: result.pagination,
                count: result.count,
                total: result.total,
            };

            // Cache the result
            await redisWrapper.keepData(
                { key: cacheKey, value: responseData },
                cacheTTL,
            );

            res.status(200).json({
                error: false,
                errors: [],
                data: result.data,
                pagination: result.pagination,
                count: result.count,
                total: result.total,
                message: result.message || 'Workspaces retrieved successfully.',
                status: 200,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to retrieve workspaces',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name updateWorkspace
 * @description Updates workspace information
 * @route PUT /workspace/:id
 * @access  Private
 */
export const updateWorkspace = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

        const data: UpdateWorkspaceDTO = req.body;

        try {
            // Verify user has permission (optional: check if user is creator or member)
            const workspaceResult = await workspaceRepository.findById(id);
            if (workspaceResult.error || !workspaceResult.data) {
                return next(new ErrorResponse('Workspace not found', 404, []));
            }

            const result = await workspaceService.updateWorkspace(id, data);

            if (result.error) {
                return next(
                    new ErrorResponse(result.message, result.code || 500, []),
                );
            }

            // Invalidate cache
            try {
                await redisWrapper.deleteData(`workspace:${id}`);
            } catch (cacheError) {
                console.error('Cache invalidation failed:', cacheError);
            }

            res.status(200).json({
                error: false,
                errors: [],
                data: result.data,
                message: result.message || 'Workspace updated successfully.',
                status: 200,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to update workspace',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name deleteWorkspace
 * @description Deletes a workspace
 * @route DELETE /workspace/:id
 * @access  Private
 */
export const deleteWorkspace = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

        try {
            // Verify user has permission (optional: check if user is creator)
            const workspaceResult = await workspaceRepository.findById(id);
            if (workspaceResult.error || !workspaceResult.data) {
                return next(new ErrorResponse('Workspace not found', 404, []));
            }

            const result = await workspaceService.deleteWorkspace(id);

            if (result.error) {
                return next(
                    new ErrorResponse(result.message, result.code || 500, []),
                );
            }

            // Invalidate cache
            try {
                await redisWrapper.deleteData(`workspace:${id}`);
            } catch (cacheError) {
                console.error('Cache invalidation failed:', cacheError);
            }

            res.status(200).json({
                error: false,
                errors: [],
                data: result.data,
                message: result.message || 'Workspace deleted successfully.',
                status: 200,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to delete workspace',
                    500,
                    [],
                ),
            );
        }
    },
);

/**
 * @name addMember
 * @description Adds a member to a workspace
 * @route POST /workspace/:id/members
 * @access  Private
 */
export const addMember = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        const { userId: memberUserId } = req.body;

        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('User ID is required', 400, []));

        try {
            const result = await workspaceService.addMember(id, memberUserId);

            if (result.error) {
                return next(
                    new ErrorResponse(result.message, result.code || 500, []),
                );
            }

            // Invalidate cache
            try {
                await redisWrapper.deleteData(`workspace:${id}`);
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
 * @description Removes a member from a workspace
 * @route DELETE /workspace/:id/members/:userId
 * @access  Private
 */
export const removeMember = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id, userId: memberUserId } = req.params;

        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('User ID is required', 400, []));

        try {
            const result = await workspaceService.removeMember(
                id,
                memberUserId,
            );

            if (result.error) {
                return next(
                    new ErrorResponse(result.message, result.code || 500, []),
                );
            }

            // Invalidate cache
            try {
                await redisWrapper.deleteData(`workspace:${id}`);
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
