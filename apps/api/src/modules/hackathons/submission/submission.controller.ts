import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from '../../../middlewares/async.mdw';
import ErrorResponse from '../../../utils/error.util';
import submissionService from './submission.service';
import submissionRepository from './submission.repository';
import { UpdateSubmissionDTO, CreateSubmissionDTO } from './submission.dto';
import redisWrapper from '../../../middlewares/redis.mdw';

/**
 * @name createSubmission
 * @description Creates a new submission
 * @route POST /submissions
 * @access  Private
 */
export const createSubmission: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const data: CreateSubmissionDTO = {
            ...req.body,
            user: (req as any).user,
        };

        const result = await submissionService.createSubmission(data);

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
 * @name getSubmission
 * @description Retrieves submission information by ID
 * @route GET /submissions/:id
 * @access  Private
 */
export const getSubmission: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Submission ID is required', 400, []));

        const cacheKey = `submission:${id}`;
        const cacheTTL = 300; // 5 minutes

        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: cached,
                message: 'Submission retrieved successfully (cached).',
                status: 200,
            });
        }

        const result = await submissionService.getSubmission(id);

        if (result.error || !result.data) {
            return next(
                new ErrorResponse(
                    result.message || 'Submission not found',
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
 * @name getSubmissions
 * @description Retrieves a paginated list of submissions with filtering and sorting
 * @route GET /submissions
 * @access  Private
 */
export const getSubmissions: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            page = 1,
            limit = 25,
            sort = '-createdAt',
            select,
            populate,
            ...filters
        } = req.query;

        const cacheKey = `submissions:list:${JSON.stringify({ page, limit, sort, select, filters })}`;
        const cacheTTL = 180; // 3 minutes

        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: cached.data,
                pagination: cached.pagination,
                count: cached.count,
                total: cached.total,
                message: 'Submissions retrieved successfully (cached).',
                status: 200,
            });
        }

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

        const result = await submissionService.getSubmissions(
            filters as any,
            options,
        );

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        const responseData = {
            data: result.data,
            pagination: result.pagination,
            count: result.pagination?.count,
            total: result.pagination?.total,
        };

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
 * @name updateSubmission
 * @description Updates submission information
 * @route PUT /submissions/:id
 * @access  Private
 */
export const updateSubmission: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(
                new ErrorResponse('Submission ID is required', 400, []),
            );

        const submissionResult = await submissionRepository.findById(id);
        if (submissionResult.error || !submissionResult.data) {
            return next(new ErrorResponse('Submission not found', 404, []));
        }

        const data: UpdateSubmissionDTO = {
            ...req.body,
            submissionId: id,
            user: userId,
        };

        const result = await submissionService.updateSubmission(data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`submission:${id}`);
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
 * @name deleteSubmission
 * @description Deletes a submission
 * @route DELETE /submissions/:id
 * @access  Private
 */
export const deleteSubmission: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(
                new ErrorResponse('Submission ID is required', 400, []),
            );

        const submissionResult = await submissionRepository.findById(id);
        if (submissionResult.error || !submissionResult.data) {
            return next(new ErrorResponse('Submission not found', 404, []));
        }

        const result = await submissionService.deleteSubmission(id, userId);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`submission:${id}`);
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
