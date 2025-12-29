import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/async.mdw';
import ErrorResponse from '../../utils/error.util';
import { InviteAdminDTO } from './admin.dto';
import invitationService from '../Invitation/invitation.service';
import { InvitationType } from '../Invitation/invitation.interface';
import { Types } from 'mongoose';

// System-level resource ID for admin invitations
// This represents the admin system as a whole
const SYSTEM_ADMIN_RESOURCE_ID = new Types.ObjectId('000000000000000000000000');

/**
 * @name inviteAdmin
 * @description Invites an admin to the system
 * @route POST /admin/invite
 * @access  Private (Admin only)
 */
export const inviteAdmin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.id;
        if (!userId) return next(new ErrorResponse('Unauthorized', 401, []));

        const { email }: InviteAdminDTO = req.body;

        if (!email || email.trim().length === 0)
            return next(new ErrorResponse('Email is required', 400, []));

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return next(new ErrorResponse('Invalid email format', 400, []));
        }

        try {
            // Convert user ID to ObjectId
            const userObjectId = new Types.ObjectId(userId);

            // Create invitation
            const invitationResult = await invitationService.createNewInvitation({
                invitedBy: userObjectId,
                inviteeEmail: email.trim().toLowerCase(),
                inviteType: InvitationType.ADMIN,
                resourceId: SYSTEM_ADMIN_RESOURCE_ID,
            });

            if (invitationResult.error) {
                return next(
                    new ErrorResponse(
                        invitationResult.message,
                        invitationResult.code || 500,
                        [],
                    ),
                );
            }

            res.status(201).json({
                error: false,
                errors: [],
                data: invitationResult.data,
                message: invitationResult.message || 'Admin invitation sent successfully.',
                status: 201,
            });
        } catch (error: any) {
            return next(
                new ErrorResponse(
                    error.message || 'Failed to invite admin',
                    500,
                    [],
                ),
            );
        }
    },
);
