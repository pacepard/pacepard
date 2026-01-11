import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from '../../middlewares/async.mdw';
import ErrorResponse from '../../utils/error.util';
import talentService from './talent.service';
import talentRepository from './talent.repository';
import { ITalentDoc } from './talent.interface';
import { UpdateTalentDTO } from './talent.dto';
import redisWrapper from '../../middlewares/redis.mdw';

/**
 * @name getTalent
 * @description Retrieves talent profile information
 * @route GET /talent
 * @access  Private
 */
export const getTalent: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const cacheKey = `talent:profile:${userId}`;
        const cacheTTL = 300; // 5 minutes for talent profile data

        // Check cache first
        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: cached,
                message: 'Talent profile retrieved successfully (cached).',
                status: 200,
            });
        }

        // Get talent profile from service
        const result = await talentService.getTalentProfile(String(userId));

        if (result.error || !result.data) {
            return next(
                new ErrorResponse(
                    result.message || 'Talent profile not found',
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
 * @name getTalents
 * @description Retrieves a paginated list of talents with filtering and sorting
 * @route GET /talents
 * @access  Private (Admin only - should add admin check)
 */
export const getTalents: RequestHandler = asyncHandler(
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
        const cacheKey = `talents:list:${JSON.stringify({ page, limit, sort, select, filters })}`;
        const cacheTTL = 180; // 3 minutes for talent lists

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
                message: 'Talents retrieved successfully (cached).',
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

        // Get talents from repository
        const result = await talentRepository.getTalents(
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
            count: result.pagination!.count,
            total: result.pagination!.total,
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
            count: result.pagination!.count,
            total: result.pagination!.total,
            message: result.message,
            status: 200,
        });
    },
);

/**
 * @name updateTalent
 * @description Updates talent profile information
 * @route PUT /talent
 * @access  Private
 */
export const updateTalent: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const data: UpdateTalentDTO = req.body;

        const result = await talentService.updateProfile(String(userId), data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`talent:profile:${userId}`);
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
 * @name updateInterests
 * @description Updates talent interests
 * @route PUT /talent/interests
 * @access  Private
 */
export const updateInterests: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { interests } = req.body;

        if (!interests || !Array.isArray(interests)) {
            return next(
                new ErrorResponse('Interests must be an array', 400, []),
            );
        }

        // Service uses 'intrests' (typo in service, keeping for consistency)
        const result = await talentService.updateInterests(
            String(userId),
            interests as string[],
        );

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`talent:profile:${userId}`);
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
 * @name addSkill
 * @description Adds a skill to talent profile
 * @route POST /talent/skills
 * @access  Private
 */
export const addSkill: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { skill } = req.body;

        if (!skill || typeof skill !== 'string') {
            return next(new ErrorResponse('Skill must be a string', 400, []));
        }

        const result = await talentService.addSkill(String(userId), skill);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`talent:profile:${userId}`);
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
 * @name removeSkill
 * @description Removes a skill from talent profile
 * @route DELETE /talent/skills/:skill
 * @access  Private
 */
export const removeSkill: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { skill } = req.params;

        if (!skill) {
            return next(new ErrorResponse('Skill is required', 400, []));
        }

        const result = await talentService.removeSkill(String(userId), skill);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`talent:profile:${userId}`);
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
