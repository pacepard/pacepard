import slugify from "slugify";
import { ObjectId, Types } from "mongoose";
import teamRepository from "@/repositories/team.repository";
import {
  createTeamDto,
  TeamDTO,
  TeamMembersDTO,
  updatedDTO,
} from "@/dtos/team.dto";
import teamMapper from "@/mappers/team.mapper";

import { TeamRoles, TeamVisibilty } from "@/utils/enums.util";
import { IResult } from "@/utils/interfaces.util";
import userRepository from "@/repositories/user.repository";
import ErrorResponse from "@/utils/error.util";
import { ProjectRepository } from "@/repositories/project.repository";

/**
 * @name TeamService
 * @description Team formation module on how we interact with team
 */
class TeamService {
  /**
   * @description Create new team for a user with a project
   * @param userId ID of the user who wants to create a project
   * @param projectId ID of the project
   * @param teamData team data we're creating the team with
   * @returns returns a mapped team info instead of the whole team document from the model
   */
  public async createTeam(
    userId: string,
    projectId: string,
    teamData: createTeamDto
  ): Promise<IResult<TeamDTO>> {
    const result: IResult<TeamDTO> = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    // check if project exist
    const project = await ProjectRepository.findById(projectId);

    if (!project) {
      result.error = true;
      result.code = 409;
      result.message = "Project not found";
      return result;
    }

    // check if userID is owner of project
    if (project.createdBy !== userId) {
      result.error = true;
      result.code = 403;
      result.message = "Only project owner can create a team";
      return result;
    }

    //// Prevent duplicate team name later on

    /// Build initial team data
    const newTeam = {
      teamName: teamData.teamName,
      slug: slugify(teamData.teamName, { lower: true }),
      description: teamData.description || "",
      projectId: project._id,
      projectName: project.title,
      teamLead: userId,
      teamMembers: [
        {
          userId: new Types.ObjectId(userId) as any,
          role: TeamRoles.TEAM_LEADER,
          joinedAt: new Date(),
        },
      ],
      teamSize: teamData.teamSize,
      visibility: teamData.visibility === "private" ? TeamVisibilty.PRIVATE : TeamVisibilty.PUBLIC,
      isComplete: false,
      isDeactivated: false,
      competitions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: new Types.ObjectId(userId) as any,
    };

    try {
      // save team to database using repository
      const createdTeam = await teamRepository.createTeam(newTeam);

      result.code = 201;
      result.message = "Team created successsfully";
      result.data = teamMapper.teamMapped(createdTeam);
      return result;
    } catch (error) {
      console.log("create team failed", error);
      result.error = true;
      result.code = 500;
      result.message = "Failed to create team";
      return result;
    }
  }

  /**
   * @name validateTeamLead
   * @description Helps validate if team lead identity for team-lead restricted action
   * @param teamId The team
   * @param teamLeadId The suppose the team lead id
   * @returns if team lead is validated it returns the team
   *
   */
  private async validateTeamLead(teamId: string, teamLeadId: string) {
    const team = await teamRepository.findById(teamId);
    if (!team) {
      throw new ErrorResponse("Team not found", 404, [], []);
    }
    if (team.teamLead.toString() !== teamLeadId) {
      throw new ErrorResponse(
        "Only team lead perform this action",
        403,
        [],
        []
      );
    }
    return team;
  }

  /**
   * Edit/Update a Team's information
   * @param userId user who's updating
   * @param teamId the team getting updated
   * @param updatedData the updated team details
   * @returns updated team details mapped
   */
  public async editTeam(
    teamLeadId: string,
    teamId: string,
    updatedData: Partial<updatedDTO>
  ): Promise<IResult<TeamDTO>> {
    const result: IResult<TeamDTO> = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    const team = await this.validateTeamLead(teamId, teamLeadId);

    // Apply updates
    if (updatedData.teamName) {
      team.teamName = updatedData.teamName;
      team.slug = slugify(updatedData.teamName, { lower: true });
    }
    if (updatedData.description !== undefined) {
      team.description = updatedData.description;
    }
    if (updatedData.teamSize !== undefined) {
      team.teamSize = updatedData.teamSize;
    }
    if (updatedData.visibility !== undefined) {
      team.visibility = updatedData.visibility as TeamVisibilty;
    }
    team.updatedAt = new Date();
    team.updatedBy = new Types.ObjectId(teamLeadId) as any;

    try {
      // save updates to db
      const updatedTeam = await teamRepository.updateTeam(teamId, team);

      result.message = "Team updated successfully";
      result.data = teamMapper.teamMapped(updatedTeam!);
      return result;
    } catch (error) {
      console.log(error);
      result.error = true;
      result.code = 500;
      result.message = "Edit not saved";
      return result;
    }
  }

  /**
   * @name addTeamMember
   * @param teamId Team that wants to add member to its team
   * @param teamLeadId Team leader id
   * @param userToAdd
   * @returns list of team members with new member added
   */
  private async addTeamMember(
    teamId: string,
    teamLeadId: string,
    userToAdd: string
  ): Promise<IResult<TeamMembersDTO>> {
    const result: IResult<TeamDTO> = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    const team = await this.validateTeamLead(teamId, teamLeadId);

    // ensure user exist
    const newTeamMember = await userRepository.findById(userToAdd);
    if (!newTeamMember) {
      result.error = true;
      result.code = 404;
      result.message = "User not found";
      return result;
    }

    // check if new team member is not a member
    const alreadyMember = team.teamMembers.some(
      (m) => m.userId.toString() === newTeamMember._id.toString()
    );
    if (alreadyMember) {
      result.error = true;
      result.code = 406;
      result.message = "User is already a member of the team";
      return result;
    }

    //check is complete
    if (team.isComplete) {
      result.error = true;
      result.code = 400;
      result.message = "Team is already full, kindly change team size";
      return result;
    }

    // set is complete state

    // save update
    try {
      // we can now add member
      const newTeam = await teamRepository.addMember(
        teamId,
        newTeamMember._id.toString()
      );

      result.message = "Member added successfully";
      result.data = teamMapper.teamMembersMapped(newTeam!);
      return result;
    } catch (error) {
      console.log(error);
      result.error = true;
      result.code = 500;
      result.message = "Couldn't add member";
      return result;
    }
  }

  /**
   * @name approveJoinRequest
   * @param teamId The team
   * @param teamLeadId the team leader id approving the join request
   * @param newTeamMember new team member
   * @returns {Promise<IResult<TeamMembersDTO>>}
   */
  public async approveJoinRequest(
    teamId: string,
    teamLeadId: string,
    newTeamMember: string
  ): Promise<IResult<TeamMembersDTO>> {
    const result: IResult<TeamMembersDTO> = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    await this.validateTeamLead(teamId, teamLeadId);

    return this.addTeamMember(teamId, teamLeadId, newTeamMember);
  }

  /**
   *@name joinTeam allows a user to join a team or not
   * @param teamId team user wants to join
   * @param requestingUserId user requesting to join a team
   * @returns
   */
  public async joinTeam(
    teamId: string,
    requestingUserId: string
  ): Promise<IResult> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    // ensure user exist
    const joinRequestUser = await userRepository.findById(requestingUserId);

    if (!joinRequestUser) {
      result.error = true;
      result.code = 404;
      result.message = "User not found";
      return result;
    }

    // Get Team
    const team = await teamRepository.findById(teamId);
    if (!team) {
      result.error = true;
      result.code = 404;
      result.message = "Team not found";
      return result;
    }

    // check if team is private
    if (team.visibility === TeamVisibilty.PRIVATE) {
      result.error = true;
      result.code = 403;
      result.message = "This team is private, invite required";
      return result;
    }

    // Check if team is already full
    if (team.isComplete) {
      result.error = true;
      result.code = 400;
      result.message = "Team is already full";
      return result;
    }

    // add to pending rquest, notifies teamLead in app
    return this.pendingRequest(teamId, joinRequestUser._id.toString());
  }

  /**
   * @name pendingRequest
   * @param teamId the team
   * @param requestId user that want's to get added to a team's pending request
   * @returns when a request is successfully added
   */
  private async pendingRequest(
    teamId: string,
    requestId: string
  ): Promise<IResult> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    try {
      const team = await teamRepository.addToPendingRequest(teamId, requestId);
      //send's notification
      result.code = 202;
      result.message = "Request Pending, contact teamlead";
      return result;
    } catch (error) {
      console.log(error);
      result.error = true;
      result.code = 500;
      result.message = "Couldn't join request";
      return result;
    }
  }

  /**
   *@name removeTeamMember
   * @param teamId the team
   * @param teamLeadId
   * @param memberId the member we want to remove
   * @returns team's members list without team member
   */
  public async removeTeamMember(
    teamId: string,
    teamLeadId: string,
    memberId: string
  ): Promise<IResult<TeamMembersDTO>> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    const team = await this.validateTeamLead(teamId, teamLeadId);

    // make sure team can't remove themselves
    if (team.teamLead.toString() === memberId) {
      result.error = true;
      result.code = 400;
      result.message = "Team lead cannot be removed from the team";
      return result;
    }

    // check if user is in the team
    const memberExists = team.teamMembers.some(
      (m) => m.userId.toString() === memberId
    );

    if (!memberExists) {
      result.error = true;
      result.code = 404;
      result.message = "Member not found in team";
      return result;
    }

    try {
      const updatedTeam = await teamRepository.removeMember(teamId, memberId);

      result.code = 202;
      result.message = "Team member removed successfully";
      result.data = teamMapper.teamMembersMapped(updatedTeam!);
      return result;
    } catch (error) {
      console.log(error);

      result.error = true;
      result.code = 500;
      result.message = "Couldn't add remove member";
      return result;
    }
  }

  /**
   * @name deactivateTeam
   * @description deactivates a team
   * @param teamId
   * @param teamLeadId
   * @returns team deactivated
   */
  public async deactivateTeam(
    teamId: string,
    teamLeadId: string
  ): Promise<IResult<TeamDTO>> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };
    const team = await this.validateTeamLead(teamId, teamLeadId);

    /// check if team is already not deactivated
    if (team.isDeactivated) {
      result.error = true;
      result.code = 400;
      result.message = "Team is already deactivated";
      return result;
    }

    try {
      const deactivatedTeam = await teamRepository.deactivate(teamId);

      result.message = "Team deactivated successfully";
      result.data = teamMapper.teamMapped(deactivatedTeam!);
      return result;
    } catch (error) {
      console.log(error);
      result.error = true;
      result.code = 500;
      result.message = "Couldn't Deactivate Team";
      return result;
    }
  }

  /**
   * @name activateTeam
   * @description activates a team
   * @param teamId
   * @param teamLeadId
   * @returns team activated
   */
  public async activateTeam(
    teamId: string,
    teamLeadId: string
  ): Promise<IResult<TeamDTO>> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    const team = await this.validateTeamLead(teamId, teamLeadId);

    /// check if team is already not activated
    if (!team.isDeactivated) {
      result.error = true;
      result.code = 400;
      result.message = "Team is already active";
      return result;
    }

    try {
      const activatedTeam = await teamRepository.activate(teamId);
      result.message = "Team activated successfully";
      result.data = teamMapper.teamMapped(activatedTeam!);
      return result;
    } catch (error) {
      console.log(error);

      result.error = true;
      result.code = 500;
      result.message = "Couldn't activate Team";
      return result;
    }
  }

  /**
   * @name findTeam
   * @description find a team
   * @param teamId team to find
   * @returns {Promise<IResult<TeamDTO>>}an object with data set to team
   */
  public async findTeam(teamId: string): Promise<IResult<TeamDTO>> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    const team = await teamRepository.findById(teamId);
    if (team) {
      console.log("found and given to mapper services");
      result.message = "Team found";
      result.data = teamMapper.teamMapped(team);
      return result;
    } else {
      result.error = true;
      result.code = 404;
      result.message = "Team not found";
      return result;
    }
  }

  /**
   * @name getFilterTeams
   * @description Filter teams by visiblity
   * @param visibility kinds of teams we want e.g "public", "private"
   * @returns an array of filtered teams
   */
  public async getFilterTeams(visibility: string): Promise<IResult> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    const filter: any = {};
    filter.visibility = visibility;
    try {
      const filteredTeams = await teamRepository.findByFilter(filter);
      if (filteredTeams.length > 0) {
        const mapFilteredTeams = filteredTeams.map((team) => {
          return teamMapper.teamMapped(team);
        });

        result.message = `${visibility} teams filtered`;
        result.data = mapFilteredTeams;
        return result;
      } else {
        result.message = `No ${visibility} teams at the moment`;
        return result;
      }
    } catch (error) {
      console.log(error);
      result.error = true;
      result.code = 500;
      result.message = "Couldn't find Teams";
      return result;
    }
  }

  /**
   * @name sendInvite
   * @description Allow us to send invites to a user to join a team
   * @param teamLeadId Team leader id
   * @param teamId Team ID
   * @param userId user we want to invite
   * @returns
   */
  public async sendInvite(
    teamLeadId: string,
    teamId: string,
    userId: string
  ): Promise<IResult> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    // ensure user exist
    const invitedUser = await userRepository.findById(userId);
    if (!invitedUser) {
      result.error = true;
      result.code = 404;
      result.message = "User not found";
      return result;
    }

    const team = await this.validateTeamLead(teamId, teamLeadId);

    // Check if user is already a member
    const alreadyMember = team.teamMembers.some(
      (m) => m.userId.toString() === userId.toString()
    );
    if (alreadyMember) {
      result.error = true;
      result.code = 409;
      result.message = "User is already a member of the team";
      return result;
    }

    //send in app notification to user and email notification

    result.message = "Invite sent successfully, waiting to accept";
    return result;
  }

  /**
   * @name getTeamMembers
   * @description Allow us to fetch members of a team
   * @param teamId Team we want to get it members
   * @returns the current team members of a team
   */
  public async getTeamMembers(
    teamId: string
  ): Promise<IResult<TeamMembersDTO>> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    try {
      const team = await teamRepository.findById(teamId);
      if (team) {
        result.message = "Team Members fetched Sucessfully";
        result.data = teamMapper.teamMembersMapped(team);
        return result;
      } else {
        result.error = true;
        result.code = 404;
        result.message = "Team not found";
        return result;
      }
    } catch (error) {
      console.log(error);
      result.error = true;
      result.code = 500;
      result.message = "Couldn't fetch Team members";
      return result;
    }
  }

  /**
   * @name updateRole
   * @description Allow us updates a team members role
   * @param teamId The team ID
   * @param teamLeadId Team leader ID
   * @param teamMemberId team member ID we want to update role
   * @param role the role
   * @returns team members list with updated roles
   */
  public async updateRole(
    teamId: string,
    teamLeadId: string,
    teamMemberId: string,
    role: string
  ): Promise<IResult<TeamMembersDTO>> {
    const result: IResult = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    // Get Team
    const team = await this.validateTeamLead(teamId, teamLeadId);

    ///make sure member if part of team
    // check if user is in the team
    const memberExists = team.teamMembers.some(
      (m) => m.userId.toString() === teamMemberId
    );

    if (!memberExists) {
      result.error = true;
      result.code = 400;
      result.message = "Member not found in team";
      return result;
    }
    try {
      const updatedTeam = await teamRepository.updateTeamMemberRole(
        teamId,
        teamMemberId,
        role
      );

      result.message = "Team Member role updated Sucessfully";
      result.data = teamMapper.teamMembersMapped(updatedTeam!);
      return result;
    } catch (error) {
      console.log(error);
      result.error = true;
      result.code = 500;
      result.message = "Couldn't update memeber role";
      return result;
    }
  }
}

export default new TeamService();
