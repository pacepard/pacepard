import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from '../../../middlewares/async.mdw';
import ErrorResponse from '../../../utils/error.util';
import workspaceService from './workspace.service';
import workspaceRepository from './workspace.repository';
import {
    UpdateWorkspaceDTO,
    CreateWorkspaceDTO,
    InviteMemberDTO,
    BulkInviteMemberDTO,
    UpdateDomainAccessDTO,
    GenerateShareableLinkDTO,
    JoinWorkspaceByLinkDTO,
    AddMemberDTO,
    RemoveMemberDTO,
    AddMentorDTO,
    RemoveMentorDTO,
    AddJudgeDTO,
    RemoveJudgeDTO,
} from './workspace.dto';
import redisWrapper from '../../../middlewares/redis.mdw';
import invitationService from '../../platform/Invitation/invitation.service';
import { InvitationType } from '../../platform/Invitation/invitation.interface';
import { InviteTokenDTO } from '../../platform/Invitation/invitation.dto';
import { WorkspaceMemberRole } from './workspace.interface';
import emailService from '../../../services/email.service';
import { EMAIL_CONFIG } from '../../../configs/email.config';
import userRepository from '../../users/user/user.repository';
import authService from '../../authentication/auth/auth.service';
import { IFile } from '../../../utils/interfaces.util';
import { GuestTypeEnum } from '../../users/guest/guest.interface';

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

        // Extract icon file from req.files if present
        const files = (req as any).files as IFile[] | undefined;
        let iconFile: IFile | undefined;

        if (files && files.length > 0) {
            // Find the icon file (fieldname should be 'icon' based on frontend)
            iconFile = files.find((file) => file.fieldname === 'icon');
        }

        const data: CreateWorkspaceDTO = {
            ...req.body,
            createdBy: userId,
            icon: iconFile, // Pass the icon file to the service
        };

        const result = await workspaceService.createWorkspace(data);

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

        const data: UpdateWorkspaceDTO = {
            ...req.body,
            workspaceId: id,
            user: userId,
        };

        // Verify user has permission (optional: check if user is creator or member)
        const workspaceResult = await workspaceRepository.findById(id);
        if (workspaceResult.error || !workspaceResult.data) {
            return next(new ErrorResponse('Workspace not found', 404, []));
        }

        const result = await workspaceService.updateWorkspace(data);

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
 * @name updateDomainAccess
 * @description Updates domain-based access configuration for a workspace
 * @route PUT /workspace/:id/domain-access
 * @access  Private
 */
export const updateDomainAccess: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

        const { allowDomainAccess, domain } = req.body;

        if (allowDomainAccess === undefined) {
            return next(
                new ErrorResponse('allowDomainAccess is required', 400, []),
            );
        }

        // Verify workspace exists
        const workspaceResult = await workspaceRepository.findById(id);
        if (workspaceResult.error || !workspaceResult.data) {
            return next(new ErrorResponse('Workspace not found', 404, []));
        }

        const data: UpdateDomainAccessDTO = {
            workspaceId: id,
            allowDomainAccess: Boolean(allowDomainAccess),
            domain: domain,
            user: userId,
        };

        const result = await workspaceService.updateDomainAccess(data);

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

        const result = await workspaceService.deleteWorkspace(id, userId);

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
        const { userId: memberUserId, role } = req.body;

        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));
        if (!memberUserId)
            return next(new ErrorResponse('User ID is required', 400, []));

        const data: AddMemberDTO = {
            workspaceId: id,
            userId: memberUserId,
            role,
            invitedBy: userId,
            requestingUser: userId,
        };

        const result = await workspaceService.addMember(data);

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

        const data: RemoveMemberDTO = {
            workspaceId: id,
            userId: memberUserId,
            requestingUser: userId,
        };

        const result = await workspaceService.removeMember(data);

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
            inviteType: InvitationType.WORKSPACE,
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

/**
 * @name bulkInviteMembers
 * @description Invites multiple members to a workspace by email
 * @route POST /workspace/:id/invite/bulk
 * @access  Private
 */
export const bulkInviteMembers: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { emails, workspaceId }: BulkInviteMemberDTO = req.body;

        if (!workspaceId)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

        if (!emails || !Array.isArray(emails) || emails.length === 0)
            return next(
                new ErrorResponse(
                    'Emails array is required and must not be empty',
                    400,
                    [],
                ),
            );

        // Verify workspace exists
        const workspaceResult = await workspaceRepository.findById(workspaceId);
        if (workspaceResult.error || !workspaceResult.data) {
            return next(new ErrorResponse('Workspace not found', 404, []));
        }

        // Get the inviter's user details for email personalization
        const inviterResult = await userRepository.findById(userId);
        const inviter = inviterResult.data as any;

        const results = {
            successful: [] as Array<{ email: string; token?: string }>,
            failed: [] as Array<{ email: string; error: string }>,
        };

        // Process each email
        for (const email of emails) {
            const trimmedEmail = email.trim().toLowerCase();

            // Skip empty emails
            if (!trimmedEmail) {
                results.failed.push({
                    email: email,
                    error: 'Empty email address',
                });
                continue;
            }

            // Email validation
            const mailCheck = await authService.checkEmail(trimmedEmail);
            if (!mailCheck) {
                results.failed.push({
                    email: trimmedEmail,
                    error: 'Invalid email format',
                });
                continue;
            }

            try {
                // Create invitation
                const invitationResult = await invitationService.newInvitation({
                    invitedBy: userId,
                    inviteeEmail: trimmedEmail,
                    inviteType: InvitationType.WORKSPACE,
                    resourceId: workspaceId,
                });

                if (invitationResult.error) {
                    results.failed.push({
                        email: trimmedEmail,
                        error: invitationResult.message,
                    });
                    continue;
                }

                // Extract token from invitation result
                const token = (invitationResult.data as any)?.token;
                if (!token) {
                    results.failed.push({
                        email: trimmedEmail,
                        error: 'Failed to generate invitation token',
                    });
                    continue;
                }

                // Construct invitation URL with token
                const invitationUrl = `${EMAIL_CONFIG.clientUrl}/workspace/invite/accept?token=${token}&email=${encodeURIComponent(trimmedEmail)}`;

                // Create a minimal user object for the invitee
                const inviteeUser = {
                    email: trimmedEmail,
                    firstName: trimmedEmail.split('@')[0] || 'Member',
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
                    // Log error but still count as successful since invitation was created
                    console.error(
                        `Failed to queue invitation email for ${trimmedEmail}:`,
                        emailResult.message,
                    );
                }

                results.successful.push({
                    email: trimmedEmail,
                    token: token,
                });
            } catch (error: any) {
                results.failed.push({
                    email: trimmedEmail,
                    error: error.message || 'Unknown error',
                });
            }
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
                successful: results.successful,
                failed: results.failed,
                total: emails.length,
                successfulCount: results.successful.length,
                failedCount: results.failed.length,
            },
            message: `Bulk invitation processed. ${results.successful.length} successful, ${results.failed.length} failed.`,
            status: 201,
        });
    },
);

/**
 * @name inviteMentor
 * @description Invites a mentor to a workspace by email
 * @route POST /workspace/:id/invite/mentor
 * @access  Private
 */
export const inviteMentor: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id: workspaceId } = req.params;
        const { email } = req.body;

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

        const invitationResult = await invitationService.newInvitation({
            invitedBy: userId,
            inviteeEmail: email.trim().toLowerCase(),
            inviteType: InvitationType.GUEST,
            resourceId: workspaceId,
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
        const invitationUrl = `${EMAIL_CONFIG.clientUrl}/workspace/invite/mentor/accept?token=${token}&email=${encodeURIComponent(email.trim().toLowerCase())}`;

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
            'Workspace Mentor',
        );

        if (emailResult.error) {
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
                'Mentor invitation sent successfully.',
            status: 201,
        });
    },
);

/**
 * @name inviteJudge
 * @description Invites a judge to a workspace by email
 * @route POST /workspace/:id/invite/judge
 * @access  Private
 */
export const inviteJudge: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id: workspaceId } = req.params;
        const { email } = req.body;

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

        const invitationResult = await invitationService.newInvitation({
            invitedBy: userId,
            inviteeEmail: email.trim().toLowerCase(),
            inviteType: InvitationType.GUEST,
            resourceId: workspaceId,
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
        const invitationUrl = `${EMAIL_CONFIG.clientUrl}/workspace/invite/judge/accept?token=${token}&email=${encodeURIComponent(email.trim().toLowerCase())}`;

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
            'Workspace Judge',
        );

        if (emailResult.error) {
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
                'Judge invitation sent successfully.',
            status: 201,
        });
    },
);

/**
 * @name resendMentorInvite
 * @description Resends a mentor invitation to a workspace
 * @route POST /workspace/:id/invite/mentor/resend
 * @access  Private
 */
export const resendMentorInvite: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id: workspaceId } = req.params;
        const { token, email }: InviteTokenDTO = req.body;

        if (!workspaceId)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

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
                new ErrorResponse(resendResult.message, resendResult.code, []),
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
        const invitationUrl = `${EMAIL_CONFIG.clientUrl}/workspace/invite/mentor/accept?token=${newToken}&email=${encodeURIComponent(email.trim().toLowerCase())}`;

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
            'Workspace Mentor',
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
            message:
                resendResult.message ||
                'Mentor invitation resent successfully.',
            status: 200,
        });
    },
);

/**
 * @name resendJudgeInvite
 * @description Resends a judge invitation to a workspace
 * @route POST /workspace/:id/invite/judge/resend
 * @access  Private
 */
export const resendJudgeInvite: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id: workspaceId } = req.params;
        const { token, email }: InviteTokenDTO = req.body;

        if (!workspaceId)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

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
                new ErrorResponse(resendResult.message, resendResult.code, []),
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
        const invitationUrl = `${EMAIL_CONFIG.clientUrl}/workspace/invite/judge/accept?token=${newToken}&email=${encodeURIComponent(email.trim().toLowerCase())}`;

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
            'Workspace Judge',
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
            message:
                resendResult.message || 'Judge invitation resent successfully.',
            status: 200,
        });
    },
);

/**
 * @name addMentor
 * @description Adds a mentor to a workspace
 * @route POST /workspace/:id/mentors
 * @access  Private
 */
export const addMentor: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        const { mentorId } = req.body;

        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));
        if (!mentorId)
            return next(new ErrorResponse('Mentor ID is required', 400, []));

        const data: AddMentorDTO = {
            workspaceId: id,
            mentorId,
            requestingUser: userId,
        };

        const result = await workspaceService.addMentor(data);

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
 * @name removeMentor
 * @description Removes a mentor from a workspace
 * @route DELETE /workspace/:id/mentors/:mentorId
 * @access  Private
 */
export const removeMentor: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id, mentorId } = req.params;

        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));
        if (!mentorId)
            return next(new ErrorResponse('Mentor ID is required', 400, []));

        const data: RemoveMentorDTO = {
            workspaceId: id,
            mentorId,
            requestingUser: userId,
        };

        const result = await workspaceService.removeMentor(data);

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
 * @name getMentors
 * @description Gets all mentors in a workspace
 * @route GET /workspace/:id/mentors
 * @access  Private
 */
export const getMentors: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

        const cacheKey = `workspace:${id}:mentors`;
        const cacheTTL = 300; // 5 minutes

        // Check cache first
        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: cached,
                message: 'Mentors retrieved successfully (cached).',
                status: 200,
            });
        }

        const result = await workspaceService.getMentors(id);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
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
 * @name addJudge
 * @description Adds a judge to a workspace
 * @route POST /workspace/:id/judges
 * @access  Private
 */
export const addJudge: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        const { judgeId } = req.body;

        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));
        if (!judgeId)
            return next(new ErrorResponse('Judge ID is required', 400, []));

        const data: AddJudgeDTO = {
            workspaceId: id,
            judgeId,
            requestingUser: userId,
        };

        const result = await workspaceService.addJudge(data);

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
 * @name removeJudge
 * @description Removes a judge from a workspace
 * @route DELETE /workspace/:id/judges/:judgeId
 * @access  Private
 */
export const removeJudge: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id, judgeId } = req.params;

        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));
        if (!judgeId)
            return next(new ErrorResponse('Judge ID is required', 400, []));

        const data: RemoveJudgeDTO = {
            workspaceId: id,
            judgeId,
            requestingUser: userId,
        };

        const result = await workspaceService.removeJudge(data);

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
 * @name getJudges
 * @description Gets all judges in a workspace
 * @route GET /workspace/:id/judges
 * @access  Private
 */
export const getJudges: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

        const cacheKey = `workspace:${id}:judges`;
        const cacheTTL = 300; // 5 minutes

        // Check cache first
        const cached = await redisWrapper.fetchData<any>(cacheKey);
        if (cached) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: cached,
                message: 'Judges retrieved successfully (cached).',
                status: 200,
            });
        }

        const result = await workspaceService.getJudges(id);

        if (result.error) {
            return next(
                new ErrorResponse(result.message, result.code || 500, []),
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
 * @name generateShareableLink
 * @description Generates a shareable link for a workspace
 * @route POST /workspace/:id/invite/shareable-link
 * @access  Private
 */
export const generateShareableLink: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { id } = req.params;
        if (!id)
            return next(new ErrorResponse('Workspace ID is required', 400, []));

        const { expiresInDays } = req.body;

        // Verify workspace exists
        const workspaceResult = await workspaceRepository.findById(id);
        if (workspaceResult.error || !workspaceResult.data) {
            return next(new ErrorResponse('Workspace not found', 404, []));
        }

        const data: GenerateShareableLinkDTO = {
            workspaceId: id,
            expiresInDays: expiresInDays || 7,
            user: userId,
        };

        const result = await workspaceService.generateShareableLink(data);

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
 * @name joinWorkspaceByLink
 * @description Allows a user to join a workspace using a shareable link token
 * @route POST /workspace/invite/join
 * @access  Private (user must be authenticated)
 */
export const joinWorkspaceByLink: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { token, workspaceId, userEmail } = req.body;

        if (!token || !workspaceId) {
            return next(
                new ErrorResponse(
                    'Token and workspace ID are required',
                    400,
                    [],
                ),
            );
        }

        // Get user email if not provided
        let email = userEmail;
        if (!email) {
            const userResult = await userRepository.findById(userId);
            if (userResult.error || !userResult.data) {
                return next(new ErrorResponse('User not found', 404, []));
            }
            email = (userResult.data as any).email;
        }

        // Validate the shareable link
        const validateResult = await workspaceService.joinWorkspaceByLink({
            token,
            workspaceId,
            userEmail: email,
        });

        if (validateResult.error) {
            return next(
                new ErrorResponse(
                    validateResult.message,
                    validateResult.code || 400,
                    [],
                ),
            );
        }

        // Check if user is already a member
        const workspaceResult = await workspaceRepository.findById(workspaceId);
        if (workspaceResult.error || !workspaceResult.data) {
            return next(new ErrorResponse('Workspace not found', 404, []));
        }

        const workspace = workspaceResult.data as any;
        const isMember = workspace.members?.some(
            (member: any) =>
                String(member.user) === String(userId) ||
                String(member.user?._id) === String(userId),
        );

        if (isMember) {
            return res.status(200).json({
                error: false,
                errors: [],
                data: {
                    workspaceId: workspaceId,
                    message: 'You are already a member of this workspace',
                },
                message: 'You are already a member of this workspace',
                status: 200,
            });
        }

        // Add user to workspace as a member
        const addMemberData: AddMemberDTO = {
            workspaceId: workspaceId,
            userId: userId,
            role: WorkspaceMemberRole.MANAGER, // Default role for shareable link joins
            requestingUser: userId,
        };

        const addMemberResult = await workspaceService.addMember(addMemberData);

        if (addMemberResult.error) {
            return next(
                new ErrorResponse(
                    addMemberResult.message,
                    addMemberResult.code || 500,
                    [],
                ),
            );
        }

        // Invalidate cache
        try {
            await redisWrapper.deleteData(`workspace:${workspaceId}`);
        } catch (cacheError) {
            console.error('Cache invalidation failed:', cacheError);
        }

        res.status(200).json({
            error: false,
            errors: [],
            data: {
                workspaceId: workspaceId,
                workspaceName: workspace.name,
                ...addMemberResult.data,
            },
            message: 'Successfully joined workspace',
            status: 200,
        });
    },
);
