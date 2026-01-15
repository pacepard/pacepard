import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from '../../../middlewares/async.mdw';
import ErrorResponse from '../../../utils/error.util';
import judgeService from './judge.service';
import judgeRepository from './judge.repository';
import { createJudgeDTO } from './judge.dto';
import redisWrapper from '../../../middlewares/redis.mdw';
import userRepository from '../user/user.repository';
import { UserType } from '../user/user.interface';

/**
 * @name createJudge
 * @description Creates a new judge profile
 * @route POST /judge
 * @access  Private
 */
export const createJudge: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        // Prevent business users from creating judge profiles
        const userResult = await userRepository.findById(userId);
        if (userResult.error || !userResult.data) {
            return next(new ErrorResponse('User not found', 404, []));
        }
        const user = userResult.data as any;
        if (user.userType === UserType.BUSINESS) {
            return next(
                new ErrorResponse(
                    'Business users cannot be mentors or judges',
                    403,
                    [],
                ),
            );
        }

        const data: createJudgeDTO = {
            ...req.body,
            orgId: userId,
        };

        const result = await judgeService.createJudge(data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code, []),
            );
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
 * @name getJudge
 * @description Retrieves judge information by ID
 * @route GET /judge/:id
 * @access  Private
 */
export const getJudge: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Judge ID is required', 400, []));

        const cacheKey = `judge:${id}`;
        const cacheTTL = 300; // 5 minutes

        // Check cache first
        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: cached,
                message: 'Judge retrieved successfully (cached).',
                status: 200,
            });
        }

        // Get judge from service
        const result = await judgeService.getJudge(id);

        if (result.error || !result.data) {
            return next(
                new ErrorResponse(
                    result.message || 'Judge not found',
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
            message: result.message,
            status: 200,
        });
    },
);

/**
 * @name getJudges
 * @description Retrieves a paginated list of judges with filtering and sorting
 * @route GET /judges
 * @access  Private
 */
export const getJudges: RequestHandler = asyncHandler(
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
        const cacheKey = `judges:list:${JSON.stringify({ page, limit, sort, select, filters })}`;
        const cacheTTL = 180; // 3 minutes

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
                message: 'Judges retrieved successfully (cached).',
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

        // Get judges from service
        const result = await judgeService.getJudges(
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
            count: result.pagination?.count,
            total: result.pagination?.total,
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
            count: result.pagination?.count,
            total: result.pagination?.total,
            message: result.message,
            status: 200,
        });
    },
);

/**
 * @name updateJudge
 * @description Updates judge profile information
 * @route PUT /judge/:id
 * @access  Private
 */
export const updateJudge: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Judge ID is required', 400, []));

        const data: Partial<createJudgeDTO> = req.body;

        const result = await judgeService.updateJudge(id, data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`judge:${id}`);
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
 * @name deleteJudge
 * @description Deletes a judge profile
 * @route DELETE /judge/:id
 * @access  Private
 */
export const deleteJudge: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Judge ID is required', 400, []));

        const result = await judgeService.deleteJudge(id);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`judge:${id}`);
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
