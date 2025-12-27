import { IInvitationDoc, IResult } from '../../utils/interfaces.util';
import { InvitationStatus, InvitationType } from '../../utils/eums.util';
import { CreateInvitationDTO, inviteTokenDTO } from './invitation.dto';
import invitationRepository from './invitation.repository';
import Invites from './invitation.model';
import { Random } from '@btffamily/pacitude';
import systemService from '../../services/system.service';

/**
 *@name InvitationService
 * @description Manages the lifecycle and validation of invitations across multiple domains
 * without embedding domain-specific business logic. Handles token security,
 * status transitions, and expiration.
 */

class InvitationService {
    /**
     * @name createNewInvitation
     * @description Creates a new invitation.
     * @param {CreateInvitationDTO} dto - Data required to create an invitation.
     * @returns {Promise<{ invitationId: ObjectId; token: string }>}
     *          The ID of the created invitation and the raw token.
     */
    public async createNewInvitation(
        dto: CreateInvitationDTO,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const {
            invitedBy,
            inviteeEmail,
            inviteeUserId,
            inviteType,
            resourceId,
        } = dto;

        if (!invitedBy && !inviteeEmail) {
            result.error = true;
            result.message =
                'InvitedBy and InviteeEmail must exist and cannot be empty';
            return result;
        }

        if (!resourceId) {
            result.error = true;
            result.message =
                'Please provide a specific resource id the invitation belongs to';
            return result;
        }

        if (!Object.values(InvitationType).includes(inviteType)) {
            result.error = true;
            result.message = 'Invitation type must be part of enum!';
            return result;
        }

        // check to see invite exist
        const existingInvite = await Invites.findOne({
            'invitee.email': inviteeEmail.toLowerCase(),
            resourceId, // particular resource
            inviteStatus: InvitationStatus.PENDING,
        });

        if (existingInvite) {
            result.error = true;
            result.message = `A Pending invite exist for this email to ${resourceId} `;
            return result;
        }

        const token = await this.generateInviteToken();

        // encrypt token
        const encryptToken = await systemService.encryptData({
            password: token,
            payload: inviteeEmail,
            separator: '-',
        });

        const saveInvite = await invitationRepository.createInvite({
            inviteType,
            invitedBy,
            inviteeEmail,
            inviteeUserId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            inviteStatus: InvitationStatus.PENDING,
            inviteToken: encryptToken,
        });

        if (saveInvite.error) {
            result.error = true;
            result.code = saveInvite.code;
            result.message = saveInvite.message;
            return result;
        }

        result.message = 'invite created Successfully';
        result.data = { token };
        return result;
    }

    private async generateInviteToken(): Promise<string> {
        const gencode = Random.randomCode(29, true);
        return gencode.toString();
    }

    /**
     * @name validateToken
     * @description Validates an invitation token.
     * @param {inviteTokenDTO}  - Raw invitation object containing token and email to validate.
     * @returns {Promise<{ valid: boolean }>}
     *          Whether the token corresponds to a valid, pending, and unexpired invitation.
     */

    public async validateInvite(dto: inviteTokenDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { email, token } = dto;
        if (!token) {
            result.error = true;
            result.message = 'Please provide token to validate!';
            return result;
        }
        if (!email) {
            result.error = true;
            result.message = 'Please provide invitee Email!';
            return result;
        }

        const encryptToken = systemService.encryptData({
            password: token,
            payload: email,
            separator: '-',
        });

        const invite = await Invites.findOne({
            inviteToken: encryptToken,
            inviteStatus: InvitationStatus.PENDING,
        });

        if (!invite) {
            result.error = true;
            result.message = 'No invite found by the provided token and email';
            return result;
        }

        // check for expiration even though its pending
        const today = new Date();

        const expiresAt = invite.expiresAt;

        if (today > expiresAt) {
            result.error = true;
            result.message = 'Invitation expired';
            return result;
        }

        invite.inviteStatus = InvitationStatus.ACCEPTED;
        await invite.save();

        result.message = 'Invitation Validated and marked as Accecpted';
        result.data = {
            invitedBy: invite.invitedBy,
        };
        return result;
    }

    /**
     * @revokeInvitation
     * @description Revokes an existing invitation.
     * @param {inviteTokenDTO} - An object containing the email and token of the invitation to revoke.
     * @returns {Promise<IResult>}
     *          Success status; idempotent if already accepted or revoked. successfully revoked invitation
     */
    public async revokeInvitation(dto: inviteTokenDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { email, token } = dto;
        if (!token) {
            result.error = true;
            result.message = 'Please provide token to validate!';
            return result;
        }
        if (!email) {
            result.error = true;
            result.message = 'Please provide invitee Email!';
            return result;
        }

        const encryptToken = systemService.encryptData({
            password: token,
            payload: email,
            separator: '-',
        });

        const invite = await Invites.findOne({
            inviteToken: encryptToken,
            inviteStatus: InvitationStatus.PENDING,
        });

        if (!invite) {
            result.error = true;
            result.message = 'No invite found by the provided token and email';
            return result;
        }

        invite.inviteStatus = InvitationStatus.REVOKED;

        await invite.save();

        result.message = 'Invitation revoked successfully';
        return result;
    }

    /**
     * @name resendInvitation
     * @descripton Resends an invitation by generating a new token.
     * @param {inviteTokenDTO} - An object containing the email and token of the invitation to resend.
     * @returns {Promise<IResult>} the new token
     *
     */
    public async resendInvitation(dto: inviteTokenDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { email, token } = dto;
        if (!token) {
            result.error = true;
            result.message = 'Please provide token to validate!';
            return result;
        }
        if (!email) {
            result.error = true;
            result.message = 'Please provide invitee Email!';
            return result;
        }

        const encryptToken = systemService.encryptData({
            password: token,
            payload: email,
            separator: '-',
        });

        const invite = await Invites.findOne({
            inviteToken: encryptToken,
        });

        if (!invite) {
            result.error = true;
            result.message = 'No invite found by the provided token and email';
            return result;
        }

        if (
            invite.inviteStatus === InvitationStatus.ACCEPTED ||
            invite.inviteStatus === InvitationStatus.REVOKED
        ) {
            result.error = true;
            result.message =
                'Blocked state. Cannot resend accepted or revoked invitation';
        }

        const newToken = await this.generateInviteToken();

        // encrypt token
        const encryptNewToken = await systemService.encryptData({
            password: newToken,
            payload: email,
            separator: '-',
        });

        // update invite state
        invite.inviteToken = encryptNewToken;
        invite.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        invite.inviteStatus = InvitationStatus.PENDING;

        await invite.save();

        result.message = 'invite created Successfully';
        result.data = { newToken };
        return result;
    }
}

//$ pnpm swagger-cli bundle "C:\Users\Infinitystudio\pacepard\apps\docs\api-reference\openApi\root.yaml" --outfile "C:\Users\Infinitystudio\pacepard\apps\docs\api-reference\openApi\output.yaml" --type yaml --dereference
