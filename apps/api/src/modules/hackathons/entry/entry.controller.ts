import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from '../../../middlewares/async.mdw';
import ErrorResponse from '../../../utils/error.util';
import entryService from './entry.service';
import entryRepository from './entry.repository';
import {
    UpdateEntryDTO,
    CreateEntryDTO,
    InviteMemberDTO,
    AddMemberDTO,
    RemoveMemberDTO,
} from './entry.dto';
import redisWrapper from '../../../middlewares/redis.mdw';
import invitationService from '../../platform/Invitation/invitation.service';
import { InvitationType } from '../../platform/Invitation/invitation.interface';
import emailService from '../../internals/email.service';
import { EMAIL_CONFIG } from '../../../configs/email.config';
import userRepository from '../../users/user/user.repository';
import authService from '../../authentication/auth/auth.service';

/**
 * @name createEntry
 * @description Creates a new entry
 * @route POST /entries
 * @access  Private
 */
export const createEntry: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const data: CreateEntryDTO = {
            ...req.body,
            createdBy: userId,
            user: (req as any).user,
        };

        const result = await entryService.createEntry(data);

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
 * @name getEntry
 * @description Retrieves entry information by ID
 * @route GET /entries/:id
 * @access  Private
 */
export const getEntry: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Entry ID is required', 400, []));

        const cacheKey = `entry:${id}`;
        const cacheTTL = 300; // 5 minutes

        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: cached,
                message: 'Entry retrieved successfully (cached).',
                status: 200,
            });
        }

        const result = await entryService.getEntry(id);

        if (result.error || !result.data) {
            return next(
                new ErrorResponse(
                    result.message || 'Entry not found',
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
 * @name getEntries
 * @description Retrieves a paginated list of entries with filtering and sorting
 * @route GET /entries
 * @access  Private
 */
export const getEntries: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            page = 1,
            limit = 25,
            sort = '-createdAt',
            select,
            populate,
            ...filters
        } = req.query;

        const cacheKey = `entries:list:${JSON.stringify({ page, limit, sort, select, filters })}`;
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
                message: 'Entries retrieved successfully (cached).',
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

        const result = await entryService.getEntries(filters as any, options);

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
 * @name updateEntry
 * @description Updates entry information
 * @route PUT /entries/:id
 * @access  Private
 */
export const updateEntry: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Entry ID is required', 400, []));

        const entryResult = await entryRepository.findById(id);
        if (entryResult.error || !entryResult.data) {
            return next(new ErrorResponse('Entry not found', 404, []));
        }

        const data: UpdateEntryDTO = {
            ...req.body,
            entryId: id,
            user: userId,
        };

        const result = await entryService.updateEntry(data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`entry:${id}`);
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
 * @name deleteEntry
 * @description Deletes an entry
 * @route DELETE /entries/:id
 * @access  Private
 */
export const deleteEntry: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Entry ID is required', 400, []));

        const entryResult = await entryRepository.findById(id);
        if (entryResult.error || !entryResult.data) {
            return next(new ErrorResponse('Entry not found', 404, []));
        }

        const result = await entryService.deleteEntry(id, userId);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`entry:${id}`);
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
 * @description Adds a member to an entry
 * @route POST /entries/:id/members
 * @access  Private
 */
export const addMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        const { userId: memberUserId } = req.body;

        if (!id)
            return next(new ErrorResponse('Entry ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('User ID is required', 400, []));

        const data: AddMemberDTO = {
            entryId: id,
            userId: memberUserId,
            invitedBy: userId,
            requestingUser: userId,
        };

        const result = await entryService.addMember(data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`entry:${id}`);
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
 * @description Removes a member from an entry
 * @route DELETE /entries/:id/members/:userId
 * @access  Private
 */
export const removeMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id, userId: memberUserId } = req.params;

        if (!id)
            return next(new ErrorResponse('Entry ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('User ID is required', 400, []));

        const data: RemoveMemberDTO = {
            entryId: id,
            userId: memberUserId,
            requestingUser: userId,
        };

        const result = await entryService.removeMember(data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`entry:${id}`);
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
 * @name inviteMember
 * @description Invites a member to an entry
 * @route POST /entries/:id/invite
 * @access  Private
 */
export const inviteMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { email, entryId }: InviteMemberDTO = req.body;

        if (!entryId)
            return next(new ErrorResponse('Entry ID is required', 400, []));

        if (!email || email.trim().length === 0)
            return next(new ErrorResponse('Email is required', 400, []));

        const mailCheck = await authService.checkEmail(email);
        if (!mailCheck) {
            return next(new ErrorResponse('Invalid email format', 400, []));
        }

        const entryResult = await entryRepository.findById(entryId);
        if (entryResult.error || !entryResult.data) {
            return next(new ErrorResponse('Entry not found', 404, []));
        }

        const invitationResult = await invitationService.newInvitation({
            invitedBy: userId,
            inviteeEmail: email.trim().toLowerCase(),
            inviteType: InvitationType.ENTRY,
            resourceId: entryId,
        });

        if (invitationResult.error) {
            return next(
                new ErrorResponse(
                    invitationResult.message,
                    invitationResult.code,
                    [],
                ),
            );
        }

        const inviterResult = await userRepository.findById(userId);
        const inviter = inviterResult.data as any;

        const token = (invitationResult.data as any)?.token;
        if (!token) {
            return next(
                new ErrorResponse(
                    'Failed to generate invitation token',
                    500,
                    [],
                ),
            );
        }

        const invitationUrl = `${EMAIL_CONFIG.clientUrl}/entry/invite/accept?token=${token}&email=${encodeURIComponent(email.trim().toLowerCase())}`;

        const inviteeUser = {
            email: email.trim().toLowerCase(),
            firstName: email.split('@')[0] || 'Member',
            lastName: '',
        } as any;

        const emailResult = await emailService.sendInvitationEmail(
            inviteeUser,
            inviter?.firstName || 'A team member',
            invitationUrl,
            'Entry Member',
        );

        if (emailResult.error) {
            console.error(
                'Failed to queue invitation email:',
                emailResult.message,
            );
        }

        try {
            await redisWrapper.deleteData(`entry:${entryId}`);
        } catch (cacheError) {
            console.error('Cache invalidation failed:', cacheError);
        }

        res.status(201).json({
            error: false,
            errors: [],
            data: {
                ...invitationResult.data,
                emailQueued: !emailResult.error,
            },
            message:
                invitationResult.message ||
                'Member invitation sent successfully.',
            status: 201,
        });
    },
);
