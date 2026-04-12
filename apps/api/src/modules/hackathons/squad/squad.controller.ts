import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from '../../../middlewares/async.mdw';
import ErrorResponse from '../../../utils/error.util';
import squadService from './squad.service';
import squadRepository from './squad.repository';
import {
    UpdateSquadDTO,
    CreateSquadDTO,
    InviteMemberDTO,
    AddMemberDTO,
    RemoveMemberDTO,
} from './squad.dto';
import redisWrapper from '../../../middlewares/redis.mdw';
import invitationService from '../../platform/Invitation/invitation.service';
import { InvitationType } from '../../platform/Invitation/invitation.interface';
import emailService from '../../../services/email.service';
import { EMAIL_CONFIG } from '../../../configs/email.config';
import userRepository from '../../users/user/user.repository';
import authService from '../../authentication/auth/auth.service';

/**
 * @name createSquad
 * @description Creates a new squad
 * @route POST /squads
 * @access  Private
 */
export const createSquad: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const data: CreateSquadDTO = {
            ...req.body,
            createdBy: userId,
            user: (req as any).user,
        };

        const result = await squadService.createSquad(data);

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
 * @name getSquad
 * @description Retrieves squad information by ID
 * @route GET /squads/:id
 * @access  Private
 */
export const getSquad: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Squad ID is required', 400, []));

        const cacheKey = `squad:${id}`;
        const cacheTTL = 300; // 5 minutes

        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: cached,
                message: 'Squad retrieved successfully (cached).',
                status: 200,
            });
        }

        const result = await squadService.getSquad(id);

        if (result.error || !result.data) {
            return next(
                new ErrorResponse(
                    result.message || 'Squad not found',
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
 * @name getSquads
 * @description Retrieves a paginated list of squads with filtering and sorting
 * @route GET /squads
 * @access  Private
 */
export const getSquads: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            page = 1,
            limit = 25,
            sort = '-createdAt',
            select,
            populate,
            ...filters
        } = req.query;

        const cacheKey = `squads:list:${JSON.stringify({ page, limit, sort, select, filters })}`;
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
                message: 'Squads retrieved successfully (cached).',
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

        const result = await squadService.getSquads(filters as any, options);

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
 * @name updateSquad
 * @description Updates squad information
 * @route PUT /squads/:id
 * @access  Private
 */
export const updateSquad: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Squad ID is required', 400, []));

        const squadResult = await squadRepository.findById(id);
        if (squadResult.error || !squadResult.data) {
            return next(new ErrorResponse('Squad not found', 404, []));
        }

        const data: UpdateSquadDTO = {
            ...req.body,
            squadId: id,
            user: userId,
        };

        const result = await squadService.updateSquad(data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`squad:${id}`);
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
 * @name deleteSquad
 * @description Deletes a squad
 * @route DELETE /squads/:id
 * @access  Private
 */
export const deleteSquad: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Squad ID is required', 400, []));

        const squadResult = await squadRepository.findById(id);
        if (squadResult.error || !squadResult.data) {
            return next(new ErrorResponse('Squad not found', 404, []));
        }

        const result = await squadService.deleteSquad(id, userId);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`squad:${id}`);
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
 * @description Adds a member to a squad
 * @route POST /squads/:id/members
 * @access  Private
 */
export const addMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        const { userId: memberUserId, role } = req.body;

        if (!id)
            return next(new ErrorResponse('Squad ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('User ID is required', 400, []));

        const data: AddMemberDTO = {
            squadId: id,
            userId: memberUserId,
            role,
            invitedBy: userId,
            requestingUser: userId,
        };

        const result = await squadService.addMember(data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`squad:${id}`);
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
 * @description Removes a member from a squad
 * @route DELETE /squads/:id/members/:userId
 * @access  Private
 */
export const removeMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id, userId: memberUserId } = req.params;

        if (!id)
            return next(new ErrorResponse('Squad ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('User ID is required', 400, []));

        const data: RemoveMemberDTO = {
            squadId: id,
            userId: memberUserId,
            requestingUser: userId,
        };

        const result = await squadService.removeMember(data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        try {
            await redisWrapper.deleteData(`squad:${id}`);
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
 * @description Invites a member to a squad
 * @route POST /squads/:id/invite
 * @access  Private
 */
export const inviteMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { email, squadId }: InviteMemberDTO = req.body;

        if (!squadId)
            return next(new ErrorResponse('Squad ID is required', 400, []));

        if (!email || email.trim().length === 0)
            return next(new ErrorResponse('Email is required', 400, []));

        const mailCheck = await authService.checkEmail(email);
        if (!mailCheck) {
            return next(new ErrorResponse('Invalid email format', 400, []));
        }

        const squadResult = await squadRepository.findById(squadId);
        if (squadResult.error || !squadResult.data) {
            return next(new ErrorResponse('Squad not found', 404, []));
        }

        const invitationResult = await invitationService.newInvitation({
            invitedBy: userId,
            inviteeEmail: email.trim().toLowerCase(),
            inviteType: InvitationType.SQUAD,
            resourceId: squadId,
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

        const invitationUrl = `${EMAIL_CONFIG.clientUrl}/squad/invite/accept?token=${token}&email=${encodeURIComponent(email.trim().toLowerCase())}`;

        const inviteeUser = {
            email: email.trim().toLowerCase(),
            firstName: email.split('@')[0] || 'Member',
            lastName: '',
        } as any;

        const emailResult = await emailService.sendInvitationEmail(
            inviteeUser,
            inviter?.firstName || 'A team member',
            invitationUrl,
            'Squad Member',
        );

        if (emailResult.error) {
            console.error(
                'Failed to queue invitation email:',
                emailResult.message,
            );
        }

        try {
            await redisWrapper.deleteData(`squad:${squadId}`);
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
