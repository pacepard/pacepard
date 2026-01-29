import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from '../../../middlewares/async.mdw';
import ErrorResponse from '../../../utils/error.util';
import hackathonService from './hackathon.service';
import hackathonRepository from './hackathon.repository';
import {
    UpdateHackathonDTO,
    CreateHackathonDTO,
    InviteMemberDTO,
    AddMemberDTO,
    RemoveMemberDTO,
} from './hackathon.dto';
import redisWrapper from '../../../middlewares/redis.mdw';
import invitationService from '../../platform/Invitation/invitation.service';
import { InvitationType } from '../../platform/Invitation/invitation.interface';
import { InviteTokenDTO } from '../../platform/Invitation/invitation.dto';
import emailService from '../../../services/email.service';
import { EMAIL_CONFIG } from '../../../configs/email.config';
import userRepository from '../../users/user/user.repository';
import authService from '../../authentication/auth/auth.service';
import { GuestTypeEnum } from '../../users/guest/guest.interface';

/**
 * @name createHackathon
 * @description Creates a new hackathon
 * @route POST /hackathons
 * @access  Private
 */
export const createHackathon: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const data: CreateHackathonDTO = {
            ...req.body,
            createdBy: userId,
            user: (req as any).user,
        };

        const result = await hackathonService.createHackathon(data);

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
 * @name getHackathon
 * @description Retrieves hackathon information by ID
 * @route GET /hackathons/:id
 * @access  Private
 */
export const getHackathon: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Hackathon ID is required', 400, []));

        const cacheKey = `hackathon:${id}`;
        const cacheTTL = 300; // 5 minutes

        // Check cache first
        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: cached,
                message: 'Hackathon retrieved successfully (cached).',
                status: 200,
            });
        }

        // Get hackathon from service
        const result = await hackathonService.getHackathon(id);

        if (result.error || !result.data) {
            return next(
                new ErrorResponse(
                    result.message || 'Hackathon not found',
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
 * @name getHackathons
 * @description Retrieves a paginated list of hackathons with filtering and sorting
 * @route GET /hackathons
 * @access  Private
 */
export const getHackathons: RequestHandler = asyncHandler(
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
        const cacheKey = `hackathons:list:${JSON.stringify({ page, limit, sort, select, filters })}`;
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
                message: 'Hackathons retrieved successfully (cached).',
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

        // Get hackathons from service
        const result = await hackathonService.getHackathons(
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
 * @name updateHackathon
 * @description Updates hackathon information
 * @route PUT /hackathons/:id
 * @access  Private
 */
export const updateHackathon: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Hackathon ID is required', 400, []));

        const data: UpdateHackathonDTO = {
            ...req.body,
            hackathonId: id,
            user: userId,
        };

        // Verify hackathon exists
        const hackathonResult = await hackathonRepository.findById(id);
        if (hackathonResult.error || !hackathonResult.data) {
            return next(new ErrorResponse('Hackathon not found', 404, []));
        }

        const result = await hackathonService.updateHackathon(data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`hackathon:${id}`);
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
 * @name deleteHackathon
 * @description Deletes a hackathon
 * @route DELETE /hackathons/:id
 * @access  Private
 */
export const deleteHackathon: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Hackathon ID is required', 400, []));

        // Verify hackathon exists
        const hackathonResult = await hackathonRepository.findById(id);
        if (hackathonResult.error || !hackathonResult.data) {
            return next(new ErrorResponse('Hackathon not found', 404, []));
        }

        const result = await hackathonService.deleteHackathon(id, userId);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`hackathon:${id}`);
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
 * @description Adds a member to a hackathon
 * @route POST /hackathons/:id/members
 * @access  Private
 */
export const addMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        const { userId: memberUserId, role } = req.body;

        if (!id)
            return next(new ErrorResponse('Hackathon ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('User ID is required', 400, []));

        const data: AddMemberDTO = {
            hackathonId: id,
            userId: memberUserId,
            role,
            invitedBy: userId,
            requestingUser: userId,
        };

        const result = await hackathonService.addMember(data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`hackathon:${id}`);
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
 * @description Removes a member from a hackathon
 * @route DELETE /hackathons/:id/members/:userId
 * @access  Private
 */
export const removeMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id, userId: memberUserId } = req.params;

        if (!id)
            return next(new ErrorResponse('Hackathon ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('User ID is required', 400, []));

        const data: RemoveMemberDTO = {
            hackathonId: id,
            userId: memberUserId,
            requestingUser: userId,
        };

        const result = await hackathonService.removeMember(data);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`hackathon:${id}`);
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
 * @description Invites a member to a hackathon
 * @route POST /hackathons/:id/invite
 * @access  Private
 */
export const inviteMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { email, hackathonId }: InviteMemberDTO = req.body;

        if (!hackathonId)
            return next(new ErrorResponse('Hackathon ID is required', 400, []));

        if (!email || email.trim().length === 0)
            return next(new ErrorResponse('Email is required', 400, []));

        // Email validation
        const mailCheck = await authService.checkEmail(email);
        if (!mailCheck) {
            return next(new ErrorResponse('Invalid email format', 400, []));
        }

        // Verify hackathon exists
        const hackathonResult = await hackathonRepository.findById(hackathonId);
        if (hackathonResult.error || !hackathonResult.data) {
            return next(new ErrorResponse('Hackathon not found', 404, []));
        }

        // Create invitation
        const invitationResult = await invitationService.newInvitation({
            invitedBy: userId,
            inviteeEmail: email.trim().toLowerCase(),
            inviteType: InvitationType.HACKATHON,
            resourceId: hackathonId,
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

        // Get the inviter's user details for email personalization
        const inviterResult = await userRepository.findById(userId);
        const inviter = inviterResult.data as any;

        // Extract token from invitation result
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

        // Construct invitation URL with token
        const invitationUrl = `${EMAIL_CONFIG.clientUrl}/hackathon/invite/accept?token=${token}&email=${encodeURIComponent(email.trim().toLowerCase())}`;

        // Create a minimal user object for the invitee
        const inviteeUser = {
            email: email.trim().toLowerCase(),
            firstName: email.split('@')[0] || 'Member',
            lastName: '',
        } as any;

        // Send invitation email
        const emailResult = await emailService.sendInvitationEmail(
            inviteeUser,
            inviter?.firstName || 'A team member',
            invitationUrl,
            'Hackathon Member',
        );

        if (emailResult.error) {
            console.error(
                'Failed to queue invitation email:',
                emailResult.message,
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`hackathon:${hackathonId}`);
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

/**
 * @name inviteMentor
 * @description Invites a mentor to a hackathon by email
 * @route POST /hackathons/:id/invite/mentor
 * @access  Private
 */
export const inviteMentor: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id: hackathonId } = req.params;
        const { email } = req.body;

        if (!hackathonId)
            return next(new ErrorResponse('Hackathon ID is required', 400, []));

        if (!email || email.trim().length === 0)
            return next(new ErrorResponse('Email is required', 400, []));

        // Email validation
        const mailCheck = await authService.checkEmail(email);
        if (!mailCheck) {
            return next(new ErrorResponse('Invalid email format', 400, []));
        }

        // Verify hackathon exists
        const hackathonResult = await hackathonRepository.findById(hackathonId);
        if (hackathonResult.error || !hackathonResult.data) {
            return next(new ErrorResponse('Hackathon not found', 404, []));
        }

        const invitationResult = await invitationService.newInvitation({
            invitedBy: userId,
            inviteeEmail: email.trim().toLowerCase(),
            inviteType: InvitationType.GUEST,
            resourceId: hackathonId,
            metadata: {
                guestType: GuestTypeEnum.MENTOR,
            },
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

        // Get the inviter's user details for email personalization
        const inviterResult = await userRepository.findById(userId);
        const inviter = inviterResult.data as any;

        // Extract token from invitation result
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

        // Construct invitation URL with token
        const invitationUrl = `${EMAIL_CONFIG.clientUrl}/hackathon/invite/mentor/accept?token=${token}&email=${encodeURIComponent(email.trim().toLowerCase())}`;

        // Create a minimal user object for the invitee
        const inviteeUser = {
            email: email.trim().toLowerCase(),
            firstName: email.split('@')[0] || 'Mentor',
            lastName: '',
        } as any;

        // Send invitation email
        const emailResult = await emailService.sendInvitationEmail(
            inviteeUser,
            inviter?.firstName || 'A team member',
            invitationUrl,
            'Hackathon Mentor',
        );

        if (emailResult.error) {
            console.error(
                'Failed to queue invitation email:',
                emailResult.message,
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`hackathon:${hackathonId}`);
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
                'Mentor invitation sent successfully.',
            status: 201,
        });
    },
);

/**
 * @name inviteJudge
 * @description Invites a judge to a hackathon by email
 * @route POST /hackathons/:id/invite/judge
 * @access  Private
 */
export const inviteJudge: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id: hackathonId } = req.params;
        const { email } = req.body;

        if (!hackathonId)
            return next(new ErrorResponse('Hackathon ID is required', 400, []));

        if (!email || email.trim().length === 0)
            return next(new ErrorResponse('Email is required', 400, []));

        // Email validation
        const mailCheck = await authService.checkEmail(email);
        if (!mailCheck) {
            return next(new ErrorResponse('Invalid email format', 400, []));
        }

        // Verify hackathon exists
        const hackathonResult = await hackathonRepository.findById(hackathonId);
        if (hackathonResult.error || !hackathonResult.data) {
            return next(new ErrorResponse('Hackathon not found', 404, []));
        }

        const invitationResult = await invitationService.newInvitation({
            invitedBy: userId,
            inviteeEmail: email.trim().toLowerCase(),
            inviteType: InvitationType.GUEST,
            resourceId: hackathonId,
            metadata: {
                guestType: GuestTypeEnum.JUDGE,
            },
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

        // Get the inviter's user details for email personalization
        const inviterResult = await userRepository.findById(userId);
        const inviter = inviterResult.data as any;

        // Extract token from invitation result
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

        // Construct invitation URL with token
        const invitationUrl = `${EMAIL_CONFIG.clientUrl}/hackathon/invite/judge/accept?token=${token}&email=${encodeURIComponent(email.trim().toLowerCase())}`;

        // Create a minimal user object for the invitee
        const inviteeUser = {
            email: email.trim().toLowerCase(),
            firstName: email.split('@')[0] || 'Judge',
            lastName: '',
        } as any;

        // Send invitation email
        const emailResult = await emailService.sendInvitationEmail(
            inviteeUser,
            inviter?.firstName || 'A team member',
            invitationUrl,
            'Hackathon Judge',
        );

        if (emailResult.error) {
            console.error(
                'Failed to queue invitation email:',
                emailResult.message,
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`hackathon:${hackathonId}`);
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
                'Judge invitation sent successfully.',
            status: 201,
        });
    },
);

/**
 * @name resendMentorInvite
 * @description Resends a mentor invitation to a hackathon
 * @route POST /hackathons/:id/invite/mentor/resend
 * @access  Private
 */
export const resendMentorInvite: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id: hackathonId } = req.params;
        const { token, email }: InviteTokenDTO = req.body;

        if (!hackathonId)
            return next(new ErrorResponse('Hackathon ID is required', 400, []));

        if (!token || !email) {
            return next(
                new ErrorResponse('Token and email are required', 400, []),
            );
        }

        // Resend invitation
        const resendResult = await invitationService.resendInvite({
            token,
            email: email.trim().toLowerCase(),
        });

        if (resendResult.error) {
            return next(
                new ErrorResponse(
                    resendResult.message,
                    resendResult.code,
                    [],
                ),
            );
        }

        // Get the inviter's user details for email personalization
        const inviterResult = await userRepository.findById(userId);
        const inviter = inviterResult.data as any;

        // Extract new token from result
        const newToken = (resendResult.data as any)?.newToken;
        if (!newToken) {
            return next(
                new ErrorResponse(
                    'Failed to generate new invitation token',
                    500,
                    [],
                ),
            );
        }

        // Construct invitation URL with new token
        const invitationUrl = `${EMAIL_CONFIG.clientUrl}/hackathon/invite/mentor/accept?token=${newToken}&email=${encodeURIComponent(email.trim().toLowerCase())}`;

        // Create a minimal user object for the invitee
        const inviteeUser = {
            email: email.trim().toLowerCase(),
            firstName: email.split('@')[0] || 'Mentor',
            lastName: '',
        } as any;

        // Send invitation email
        const emailResult = await emailService.sendInvitationEmail(
            inviteeUser,
            inviter?.firstName || 'A team member',
            invitationUrl,
            'Hackathon Mentor',
        );

        if (emailResult.error) {
            console.error(
                'Failed to queue invitation email:',
                emailResult.message,
            );
        }

        res.status(200).json({
            error: false,
            errors: [],
            data: {
                ...resendResult.data,
                emailQueued: !emailResult.error,
            },
            message: resendResult.message || 'Mentor invitation resent successfully.',
            status: 200,
        });
    },
);

/**
 * @name resendJudgeInvite
 * @description Resends a judge invitation to a hackathon
 * @route POST /hackathons/:id/invite/judge/resend
 * @access  Private
 */
export const resendJudgeInvite: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id: hackathonId } = req.params;
        const { token, email }: InviteTokenDTO = req.body;

        if (!hackathonId)
            return next(new ErrorResponse('Hackathon ID is required', 400, []));

        if (!token || !email) {
            return next(
                new ErrorResponse('Token and email are required', 400, []),
            );
        }

        // Resend invitation
        const resendResult = await invitationService.resendInvite({
            token,
            email: email.trim().toLowerCase(),
        });

        if (resendResult.error) {
            return next(
                new ErrorResponse(
                    resendResult.message,
                    resendResult.code,
                    [],
                ),
            );
        }

        // Get the inviter's user details for email personalization
        const inviterResult = await userRepository.findById(userId);
        const inviter = inviterResult.data as any;

        // Extract new token from result
        const newToken = (resendResult.data as any)?.newToken;
        if (!newToken) {
            return next(
                new ErrorResponse(
                    'Failed to generate new invitation token',
                    500,
                    [],
                ),
            );
        }

        // Construct invitation URL with new token
        const invitationUrl = `${EMAIL_CONFIG.clientUrl}/hackathon/invite/judge/accept?token=${newToken}&email=${encodeURIComponent(email.trim().toLowerCase())}`;

        // Create a minimal user object for the invitee
        const inviteeUser = {
            email: email.trim().toLowerCase(),
            firstName: email.split('@')[0] || 'Judge',
            lastName: '',
        } as any;

        // Send invitation email
        const emailResult = await emailService.sendInvitationEmail(
            inviteeUser,
            inviter?.firstName || 'A team member',
            invitationUrl,
            'Hackathon Judge',
        );

        if (emailResult.error) {
            console.error(
                'Failed to queue invitation email:',
                emailResult.message,
            );
        }

        res.status(200).json({
            error: false,
            errors: [],
            data: {
                ...resendResult.data,
                emailQueued: !emailResult.error,
            },
            message: resendResult.message || 'Judge invitation resent successfully.',
            status: 200,
        });
    },
);

/**
 * @name generateHackathonShareableLink
 * @description Generates a shareable link for a hackathon
 * @route POST /hackathons/:id/invite/shareable-link
 * @access  Private
 */
export const generateHackathonShareableLink: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Hackathon ID is required', 400, []));

        const { expiresInDays } = req.body;

        const result = await hackathonService.generateShareableLink(
            id,
            userId,
            expiresInDays || 7,
        );

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`hackathon:${id}`);
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
