import Team from "./team.model";
import { ITeamDoc } from "./team.interface";
import { BadRequestError, NotFoundError, ForbiddenError } from "../../utils/projectError.utils";
import teamRepository from "./team.repository";
import projectRepository from "../project/project.repository";
import { IResult } from "../../utils/interfaces.util";
import { genTeamCode } from "../../utils/code.util";
import { ProjectMemberRole } from "../../utils/enums.util";

export class TeamService {
  
  /**
   * @name createTeam
   * @description Creates a new team within a project
   */
  public async createTeam(
    projectId: string,
    teamData: { name: string; description?: string },
    userId: string,
    userRole: ProjectMemberRole
  ): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    // Authorization check: Only project owners and maintainers can create teams
    const projectResult = await projectRepository.findById(projectId);
    if (projectResult.error || !projectResult.data) {
      throw new NotFoundError("Project not found");
    }

    const project = projectResult.data as any;
    
    // Check if user is project owner or maintainer
    if (!this.canManageProject(userRole)) {
      throw new ForbiddenError("Only project owners and maintainers can create teams");
    }

    // Create team
    const newTeamData = {
      code: genTeamCode(),
      name: teamData.name.trim(),
      description: teamData.description || "",
      workspaceId: project.workspaceId,
      businessId: project.businessId,
      projectId: new (require('mongoose')).Types.ObjectId(projectId),
      members: [],
      tasks: [],
      createdBy: new (require('mongoose')).Types.ObjectId(userId),
    };

    const createResult = await teamRepository.createTeam(newTeamData);
    
    if (createResult.error) {
      result.error = true;
      result.code = createResult.code;
      result.message = createResult.message;
      return result;
    }

    result.data = createResult.data;
    result.message = "Team created successfully";
    return result;
  }

  /**
   * @name rotateMember
   * @description Rotates a talent between teams in the same project
   * This allows authorized users to reorganize teams during an ongoing project
   * 
   * @param projectId - The project ID
   * @param userId - The user ID being moved
   * @param targetTeamId - The destination team ID
   * @param actorId - The user ID performing the rotation
   * @param actorRole - The role of the actor (for authorization)
   */
  public async rotateMember(
    projectId: string,
    userId: string,
    targetTeamId: string,
    actorId: string,
    actorRole: ProjectMemberRole
  ): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    // 1. Authorization Check
    // Only project owners and maintainers can rotate members
    if (!this.canRotateMembers(actorRole)) {
      throw new ForbiddenError("Only project owners and maintainers can rotate team members");
    }

    // 2. Validate target team exists and belongs to the project
    const targetTeamCheck = await teamRepository.findTeam(targetTeamId);
    if (targetTeamCheck.error || !targetTeamCheck.data) {
      throw new NotFoundError("Target team not found");
    }

    const targetTeam = targetTeamCheck.data as ITeamDoc;
    
    // Verify team belongs to the project
    if (targetTeam.projectId.toString() !== projectId) {
      throw new BadRequestError("Target team does not belong to this project");
    }

    // 3. Validate project exists
    const projectCheck = await projectRepository.findById(projectId);
    if (projectCheck.error || !projectCheck.data) {
      throw new NotFoundError("Project not found");
    }

    // 4. Remove user from ALL teams they currently belong to within this project
    // This ensures a talent is only in ONE team per project at a time (Standard Rotation)
    const removeResult = await teamRepository.removeUserFromProjectTeams(projectId, userId);
    
    if (removeResult.error) {
      throw new Error("Failed to remove user from existing teams");
    }

    // 5. Add to the new team with the same role
    const memberRole = ProjectMemberRole.MEMBER; // Default role for rotated members
    
    const addResult = await teamRepository.addMember(
      targetTeamId,
      userId,
      memberRole
    );

    if (addResult.error) {
      result.error = true;
      result.code = addResult.code;
      result.message = addResult.message;
      return result;
    }

    result.data = {
      team: addResult.data,
      teamsAffected: (removeResult.data as any)?.teamsAffected || 0
    };
    result.message = "Member rotated successfully to target team";
    return result;
  }

  /**
   * @name addMember
   * @description Adds a member to a team
   */
  public async addMember(
    teamId: string,
    userId: string,
    role: ProjectMemberRole,
    actorRole: ProjectMemberRole
  ): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    // Authorization: Only project owners, maintainers, and team leads can add members
    if (!this.canManageTeamMembers(actorRole, role)) {
      throw new ForbiddenError("Insufficient permissions to add team members");
    }

    const teamCheck = await teamRepository.findTeam(teamId);
    if (teamCheck.error || !teamCheck.data) {
      throw new NotFoundError("Team not found");
    }

    const team = teamCheck.data as ITeamDoc;
    
    // Check if user is already a member
    const existingMember = team.members.find(
      m => m.user.toString() === userId
    );

    if (existingMember) {
      result.error = true;
      result.code = 400;
      result.message = "User is already a member of this team";
      return result;
    }

    const addResult = await teamRepository.addMember(teamId, userId, role);

    if (addResult.error) {
      result.error = true;
      result.code = addResult.code;
      result.message = addResult.message;
      return result;
    }

    result.data = addResult.data;
    result.message = "Member added to team successfully";
    return result;
  }

  /**
   * @name removeMember
   * @description Removes a member from a team
   */
  public async removeMember(
    teamId: string,
    userId: string,
    actorRole: ProjectMemberRole
  ): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    // Authorization: Only project owners, maintainers, and team leads can remove members
    if (!this.canManageTeamMembers(actorRole, ProjectMemberRole.MEMBER)) {
      throw new ForbiddenError("Insufficient permissions to remove team members");
    }

    const removeResult = await teamRepository.removeMember(teamId, userId);

    if (removeResult.error) {
      result.error = true;
      result.code = removeResult.code;
      result.message = removeResult.message;
      return result;
    }

    result.data = removeResult.data;
    result.message = "Member removed from team successfully";
    return result;
  }

  /**
   * @name updateMemberRole
   * @description Updates a team member's role
   */
  public async updateMemberRole(
    teamId: string,
    userId: string,
    newRole: ProjectMemberRole,
    actorRole: ProjectMemberRole
  ): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    // Authorization: Only project owners, maintainers, and team leads can update member roles
    if (!this.canManageTeamMembers(actorRole, ProjectMemberRole.MEMBER)) {
      throw new ForbiddenError("Insufficient permissions to update team member roles");
    }

    const updateResult = await teamRepository.updateMemberRole(teamId, userId, newRole);

    if (updateResult.error) {
      result.error = true;
      result.code = updateResult.code;
      result.message = updateResult.message;
      return result;
    }

    result.data = updateResult.data;
    result.message = "Team member role updated successfully";
    return result;
  }

  /**
   * @name getProjectTeams
   * @description Gets all teams for a project
   */
  public async getProjectTeams(projectId: string): Promise<IResult> {
    return await teamRepository.findByProject(projectId);
  }

  /**
   * @name getTeam
   * @description Gets a team by ID
   */
  public async getTeam(teamId: string): Promise<IResult> {
    const result = await teamRepository.findTeam(teamId, [
      { path: 'projectId' },
      { path: 'workspaceId' },
      { path: 'businessId' },
      { path: 'members.user' },
      { path: 'tasks' },
      { path: 'createdBy' },
    ]);

    return result;
  }

  /**
   * @name deleteTeam
   * @description Deletes a team
   */
  public async deleteTeam(
    teamId: string,
    actorRole: ProjectMemberRole
  ): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };

    // Authorization: Only project owners and maintainers can delete teams
    if (!this.canManageProject(actorRole)) {
      throw new ForbiddenError("Only project owners and maintainers can delete teams");
    }

    const deleteResult = await teamRepository.deleteTeam(teamId);

    if (deleteResult.error) {
      result.error = true;
      result.code = deleteResult.code;
      result.message = deleteResult.message;
      return result;
    }

    result.data = deleteResult.data;
    result.message = "Team deleted successfully";
    return result;
  }

  /**
   * @name canManageProject
   * Checks if user role can manage project
   */
  private canManageProject(role: ProjectMemberRole): boolean {
    return [
      ProjectMemberRole.LEAD,
      ProjectMemberRole.MAINTAINER
    ].includes(role);
  }

  /**
   * @name canRotateMembers
   * Checks if user role can rotate team members
   */
  private canRotateMembers(role: ProjectMemberRole): boolean {
    return [
      ProjectMemberRole.LEAD,
      ProjectMemberRole.MAINTAINER
    ].includes(role);
  }

  /**
   * @name canManageTeamMembers
   * Checks if user role can manage team members
   */
  private canManageTeamMembers(
    actorRole: ProjectMemberRole,
    targetRole: ProjectMemberRole
  ): boolean {
    // Team leads can manage team members
    if (actorRole === ProjectMemberRole.LEAD) {
      return true;
    }

    // Project owners and maintainers can manage all members
    return this.canManageProject(actorRole);
  }
}

export default new TeamService();
