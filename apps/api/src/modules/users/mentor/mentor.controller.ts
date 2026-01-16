import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from '../../../middlewares/async.mdw';
import ErrorResponse from '../../../utils/error.util';
import mentorService from './mentor.service';
import mentorRepository from './mentor.repository';
import { createMentorDTO } from './mentor.dto';
import redisWrapper from '../../../middlewares/redis.mdw';
import userRepository from '../user/user.repository';
import { UserType } from '../user/user.interface';

/**
 * @name createMentor
 * @description Creates a new mentor profile
 * @route POST /mentor
 * @access  Private
 */
export const createMentor: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        // Prevent business users from creating mentor profiles
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

        const data: createMentorDTO = {
            ...req.body,
            orgId: userId,
        };

        const result = await mentorService.createMentor(data);

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
 * @name getMentor
 * @description Retrieves mentor information by ID
 * @route GET /mentor/:id
 * @access  Private
 */
export const getMentor: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Mentor ID is required', 400, []));

        const cacheKey = `mentor:${id}`;
        const cacheTTL = 300; // 5 minutes

        // Check cache first
        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: cached,
                message: 'Mentor retrieved successfully (cached).',
                status: 200,
            });
        }

        // Get mentor from service
        const result = await mentorService.getMentor(id);

        if (result.error || !result.data) {
            return next(
                new ErrorResponse(
                    result.message || 'Mentor not found',
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
 * @name getMentors
 * @description Retrieves a paginated list of mentors with filtering and sorting
 * @route GET /mentors
 * @access  Private
 */
export const getMentors: RequestHandler = asyncHandler(
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
        const cacheKey = `mentors:list:${JSON.stringify({ page, limit, sort, select, filters })}`;
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
                message: 'Mentors retrieved successfully (cached).',
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

        // Get mentors from service
        const result = await mentorService.getMentors(
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
 * @name updateMentor
 * @description Updates mentor profile information
 * @route PUT /mentor/:id
 * @access  Private
 */
export const updateMentor: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Mentor ID is required', 400, []));

        const data: Partial<createMentorDTO> = req.body;

        const result = await mentorService.updateMentor(id, data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`mentor:${id}`);
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
 * @name deleteMentor
 * @description Deletes a mentor profile
 * @route DELETE /mentor/:id
 * @access  Private
 */
export const deleteMentor: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Mentor ID is required', 400, []));

        const result = await mentorService.deleteMentor(id);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`mentor:${id}`);
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
