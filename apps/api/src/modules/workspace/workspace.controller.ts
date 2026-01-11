import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from '../../middlewares/async.mdw';
import ErrorResponse from '../../utils/error.util';
import workspaceService from './workspace.service';
import workspaceRepository from './workspace.repository';
import { UpdateWorkspaceDTO, CreateWorkspaceDTO, InviteMemberDTO } from './workspace.dto';
import redisWrapper from '../../middlewares/redis.mdw';
import invitationService from '../Invitation/invitation.service';
import { InvitationType } from '../Invitation/invitation.interface';
import emailService from '../../services/email.service';
import { EMAIL_CONFIG } from '../../configs/email.config';
import userRepository from '../user/user.repository';
import authService from '../auth/auth.service';

/**
 * @name createWorkspace
 * @description Creates a new workspace
 * @route POST /workspace
 * @access  Private
 */
export const createWorkspace: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const data: CreateWorkspaceDTO = {
            ...req.body,
            createdBy: userId,
        };

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
            message: result.message,
            status: 201,
        });
    },
);

/**
 * @name getWorkspace
 * @description Retrieves workspace information by ID
 * @route GET /workspace/:id
 * @access  Private
 */
export const getWorkspace: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

        const cacheKey = `workspace:${id}`;
        const cacheTTL = 300; // 5 minutes

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
            message: result.message,
            status: 200,
        });
    },
);

/**
 * @name getWorkspaces
 * @description Retrieves a paginated list of workspaces with filtering and sorting
 * @route GET /workspaces
 * @access  Private
 */
export const getWorkspaces: RequestHandler = asyncHandler(
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
 * @name updateWorkspace
 * @description Updates workspace information
 * @route PUT /workspace/:id
 * @access  Private
 */
export const updateWorkspace: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

        const data: UpdateWorkspaceDTO = req.body;

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
            message: result.message,
            status: 200,
        });
    },
);

/**
 * @name deleteWorkspace
 * @description Deletes a workspace
 * @route DELETE /workspace/:id
 * @access  Private
 */
export const deleteWorkspace: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

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
            message: result.message,
            status: 200,
        });
    },
);

/**
 * @name addMember
 * @description Adds a member to a workspace
 * @route POST /workspace/:id/members
 * @access  Private
 */
export const addMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        const { userId: memberUserId } = req.body;

        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('User ID is required', 400, []));

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
            message: result.message,
            status: 200,
        });
    },
);

/**
 * @name removeMember
 * @description Removes a member from a workspace
 * @route DELETE /workspace/:id/members/:userId
 * @access  Private
 */
export const removeMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id, userId: memberUserId } = req.params;

        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('User ID is required', 400, []));

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
            message: result.message,
            status: 200,
        });
    },
);
/**
 * @name inviteMember
 * @description Invites a member to a workspace
 * @route POST /workspace/:id/invite
 * @access  Private
 */
export const inviteMember: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { email, workspaceId }: InviteMemberDTO = req.body;

        if (!workspaceId)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

        if (!email || email.trim().length === 0)
            return next(new ErrorResponse('Email is required', 400, []));

        // Email validation
        const mailCheck = await authService.checkEmail(email);
        if (!mailCheck) {
            return next(new ErrorResponse('Invalid email format', 400, []));
        }

        // Verify workspace exists
        const workspaceResult = await workspaceRepository.findById(workspaceId);
        if (workspaceResult.error || !workspaceResult.data) {
            return next(new ErrorResponse('Workspace not found', 404, []));
        }

        // Create required invitation fields
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // e.g., invitations expire in 7 days

        const invitationResult = await invitationService.newInvitation({
            invitedBy: userId,
            inviteeEmail: email.trim().toLowerCase(),
            inviteType: InvitationType.PROJECT,
            resourceId: workspaceId,
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
        const invitationUrl = `${EMAIL_CONFIG.clientUrl}/workspace/invite/accept?token=${token}&email=${encodeURIComponent(email.trim().toLowerCase())}`;

        // Create a minimal user object for the invitee (they might not be a user yet)
        const inviteeUser = {
            email: email.trim().toLowerCase(),
            firstName: email.split('@')[0] || 'Member', // Use email prefix as fallback
            lastName: '',
        } as any;

        // Send invitation email
        const emailResult = await emailService.sendInvitationEmail(
            inviteeUser,
            inviter?.firstName || 'A team member',
            invitationUrl,
            'Workspace Member',
        );

        if (emailResult.error) {
            // Log error but don't fail the request since invitation was created
            console.error(
                'Failed to queue invitation email:',
                emailResult.message,
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`workspace:${workspaceId}`);
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
