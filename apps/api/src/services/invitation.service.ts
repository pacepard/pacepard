import { IInvitationDoc, IResult } from "@/utils/interfaces.util";
import {
  InvitationStatus,
  InvitationType,
  InvitedTo,
  OtpType,
} from "@/utils/enums.util";
import { Random } from "@btffamily/pacitude";
import {
  BulkInviteMentorDTO,
  BulkInviteToTeamDTO,
  InviteMentorDTO,
  InviteToTeamDTO,
  OnboardingTeamInviteDTO,
} from "@/dtos/invite.dto";
import inviteRepository from "@/repositories/invite.repository";
import User from "@/models/User.model";
import { Types, ObjectId } from "mongoose";

class InvitationService {
  /**
   * @name singleMentorInvite
   * @description Invites a mentor to an hackathon
   * @param invitePayload The invite payload
   * @param type
   * @returns
   */
  public async singleMentorInvite(
    invitePayload: InviteMentorDTO,
    type: OtpType
  ): Promise<IResult> {
    return this.singleInvite(invitePayload, type);
  }

  /**
   * @name singleTeamInvite
   * @description Invites a mentor to an hackathon
   * @param invitePayload The invite payload
   * @param type
   * @returns
   */
  public async singleTeamInvite(
    invitePayload: InviteToTeamDTO,
    type: OtpType
  ): Promise<IResult> {
    return this.singleInvite(invitePayload, type);
  }

  /**
   * @name bulkTeamInvite
   * @description Invites a mentor to an hackathon
   * @param invitePayload The invite payload
   * @param type
   * @returns
   */
  public async bulkTeamInvite(
    invitePayload: BulkInviteToTeamDTO,
    type: OtpType
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    const { emails, inviteType, invitedBy, invitedToId, invitedToType } =
      invitePayload;

    // to save results from repo
    const invitationResults: { email: string; error: boolean; data?: any }[] =
      [];

    for (const email of emails) {
      const res = await this.singleInvite(
        { email, inviteType, invitedBy, invitedToId, invitedToType },
        type
      );

      invitationResults.push({ email, error: res.error, data: res.data });
    }

    result.message = "Bulk Invitation Results";
    result.data = invitationResults;
    return result;
  }

  /**
   * @name singleInvite
   * @description sends and save a single invitaion
   * @param invitePayload
   * @param type
   * @returns
   */
  private async singleInvite(
    invitePayload: InviteMentorDTO | InviteToTeamDTO,
    type: OtpType
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    // build object
    const invited = await this.buildInvite(invitePayload, type);

    // generate and attached token
    const token = await this.generateInviteToken();

    invited.inviteToken = token;
    invited.tokenExpiry = Date.now() + 14 * 24 * 60 * 60 * 1000;

    // save to db
    const { error, data } = await inviteRepository.createInvite(invited);

    if (error) {
      result.code = 500;
      result.message = "Saving invite Token failed";
      return result;
    }

    result.message = "Invitation created successfully";
    return result;
  }

  /**
   * @name bulkMentorInvite
   * @description Invites a list mentor's email to an hackathon
   * @param invitePayload The invite payload
   * @param type
   * @returns
   */
  public async bulkMentorInvite(
    invitePayload: BulkInviteMentorDTO,
    type: OtpType
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    const { emails, inviteType, invitedBy, invitedToId, invitedToType } =
      invitePayload;

    // to save results from repository
    const invitationResults: { email: string; error: boolean; data?: any }[] =
      [];

    for (const email of emails) {
      const res = await this.singleInvite(
        { email, inviteType, invitedBy, invitedToId, invitedToType },
        type
      );

      invitationResults.push({ email, error: res.error, data: res.data });
    }

    result.message = "Bulk Invitation Results";
    result.data = invitationResults;
    return result;
  }

  /**
   * @name onboardingTeamInvite
   * @description Send team invitation during onboarding process
   * @param invitePayload OnboardingTeamInviteDTO
   * @returns IResult
   */
  public async onboardingTeamInvite(
    invitePayload: OnboardingTeamInviteDTO
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    // Check if user already exists
    const existingUser = await User.findOne({ email: invitePayload.email.toLowerCase() });
    
    // Get the inviting user's details
    const invitingUser = await User.findById(invitePayload.invitedBy);
    if (!invitingUser) {
      result.error = true;
      result.message = "Inviting user not found";
      result.code = 404;
      return result;
    }

    // Get hackathon details
    const hackathonService = await import("./hackathon.service");
    const hackathonResult = await hackathonService.default.getHackathon(invitePayload.hackathonId);
    if (hackathonResult.error) {
      result.error = true;
      result.message = "Hackathon not found";
      result.code = 404;
      return result;
    }

    // Get project details
    const projectService = await import("./project.service");
    const projectResult = await projectService.default.getProjectById(invitePayload.projectId);
    if (projectResult.error) {
      result.error = true;
      result.message = "Project not found";
      result.code = 404;
      return result;
    }

    // Create a temporary user object for email service
    const tempUser = {
      id: invitePayload.email,
      email: invitePayload.email,
      firstName: invitePayload.email.split('@')[0], // Use email prefix as first name
      lastName: '',
    } as any;

    if (existingUser) {
      // User exists, send login invitation
    }

    return result;
  }

  private async generateTeamInviteOTP(): Promise<string> {
    const gencode = Random.randomCode(30, true);
    return gencode.toString();
  }

  private async generateInviteToken(): Promise<string> {
    const gencode = Random.randomCode(30, true);
    return gencode.toString();
  }

  public async findExistingInvite(
    email: string
  ): Promise<IInvitationDoc | null> {
    // For now, we'll use a direct query since the method might not be implemented yet
    // This should be replaced with the proper repository method when available
    const invite = await inviteRepository.findInviteByEmail(email);
    return invite;
  }

  public async verifyInviteToken(token: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const invited = await inviteRepository.findInvite(token);
    if (!invited) {
      return {
        error: true,
        message: "Invalid token code",
        code: 400,
        data: {},
      };
    }

    const now = Date.now();
    if (invited.tokenExpiry && invited.tokenExpiry < now) {
      invited.inviteToken = "";
      invited.tokenExpiry = 0;
      await invited.save();
      return {
        error: true,
        message: "Token expired. Please request a new one",
        code: 400,
        data: {},
      };
    }

    // Valid token
    invited.inviteToken = "";
    invited.tokenExpiry = 0;
    await invited.save();

    result.message = "Token verified successfully";
    result.data = invited;
    return result;
  }

  /**
   * @name buildInvite
   * @description an helper function to build invite object before saving to db
   * @param invitePayload data to build object with
   * @param type Otptype Mentor invite or team invite
   * @returns the object built and ready for saviing
   */
  private async buildInvite(
    invitePayload: InviteMentorDTO | InviteToTeamDTO,
    type: OtpType
  ): Promise<Partial<IInvitationDoc>> {
    const invited: Partial<IInvitationDoc> = {
      invitee: invitePayload.email,
      invitedBy: new Types.ObjectId(invitePayload.invitedBy) as any,
      invitedAt: new Date(),
      inviteType:
        type === OtpType.MENTOR_INVITE
          ? InvitationType.AS_MENTOR
          : InvitationType.AS_TEAM_MEMBER,
      inviteToken: null,
      inviteStatus: InvitationStatus.PENDING,
      invitedToType: invitePayload.invitedToType,
      //invitedToId: invitePayload.invitedToId,
    };

    return invited;
  }
}

export default new InvitationService();
