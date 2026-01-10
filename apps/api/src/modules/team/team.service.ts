import Team from "./team.model";
import { ITeamDoc } from "./team.interface";
import { BadRequestError, NotFoundError, ForbiddenError } from "../../utils/projectError.utils";
import teamRepository from "./team.repository";
import projectRepository from "../project/project.repository";
import { IResult } from "../../utils/interfaces.util";
import { genTeamCode } from "../../utils/code.util";
import { ProjectMemberRole } from "../../utils/enums.util";
import Role from "../role/role.model";
import { Types } from "mongoose";

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
    if (!this.canManageProject(userRole)) {
      throw new ForbiddenError("Only project owners and maintainers can create teams");
    }

    const projectResult = await projectRepository.findById(projectId);
    if (projectResult.error || !projectResult.data) {
      throw new NotFoundError("Project not found");
    }
    const project = projectResult.data as any;

    const newTeamData = {
      code: genTeamCode(),
      name: teamData.name.trim(),
      description: teamData.description || "",
      workspaceId: project.workspaceId,
      businessId: project.businessId,
      projectId: new Types.ObjectId(projectId),
      createdBy: new Types.ObjectId(userId),
      
      // We auto-initialize with the creator as the Team LEAD
      members: [{ 
        user: new Types.ObjectId(userId), 
        role: ProjectMemberRole.LEAD, 
        joinedAt: new Date() 
      } as any],
      tasks: [],
    };

    // 3. Persistence
    const createResult = await teamRepository.createTeam(newTeamData);
    
    // Add the missing 'data: {}' to satisfy the IResult interface on errors
    if (createResult.error) {
      return { 
        error: true, 
        code: createResult.code, 
        message: createResult.message, 
        data: {} 
      };
    }

    return {
      error: false,
      message: "Team created and Lead assigned successfully",
      code: 201,
      data: createResult.data
    };
  }

  /**
   * @name addMember
   * @description Adds a member to a team ONLY if they are already in the project.
   */
  public async addMember(
    teamId: string,
    userId: string,
    role: ProjectMemberRole,
    actorRole: ProjectMemberRole
  ): Promise<IResult> {
    // 1. Authorization: CASL/Role check
    if (!this.canManageTeamMembers(actorRole, role)) {
      throw new ForbiddenError("Insufficient permissions to add team members");
    }

    // 2. Fetch Team and Parent Project
    const teamCheck = await teamRepository.findTeam(teamId);
    if (teamCheck.error || !teamCheck.data) throw new NotFoundError("Team not found");
    const team = teamCheck.data as ITeamDoc;

    // 3. THE GATEKEEPER: Is this user actually in the Project?
    const projectResult = await projectRepository.findById(team.projectId.toString());
    const projectMembers = projectResult.data?.members || [];
    const isProjectMember = projectMembers.some((m: { user: { toString: () => string; }; }) => m.user.toString() === userId);

    if (!isProjectMember) {
      return { 
        error: true, 
        code: 403, 
        message: "User must be invited to the Project before being assigned to a Team" ,
        data: {}
      };
    }

    // 4. Duplicate Check
    if (team.members.some(m => m.user.toString() === userId)) {
      return { error: true, code: 400, message: "User is already in this team", data: {} };
    }

    return await teamRepository.addMember(teamId, userId, role);
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
    actorRole: ProjectMemberRole
  ): Promise<IResult> {
    
    if (!this.canRotateMembers(actorRole)) {
      throw new ForbiddenError("Only project owners and maintainers can rotate members");
    }

    // 1. Lineage Verification
    const targetTeam = await teamRepository.findTeam(targetTeamId);
    if (!targetTeam.data || targetTeam.data.projectId.toString() !== projectId) {
      throw new BadRequestError("Target team does not belong to this project");
    }

    // 2. Project Membership Check (Can't rotate someone who isn't in the project)
    const project = await projectRepository.findById(projectId);
    if (!project.data?.members.some((m: { user: { toString: () => string; }; }) => m.user.toString() === userId)) {
      throw new BadRequestError("User is not a member of this project");
    }

    // 3. Atomic Swap: Remove from all teams, then Add to target
    await teamRepository.removeUserFromProjectTeams(projectId, userId);
    
    return await teamRepository.addMember(targetTeamId, userId, ProjectMemberRole.MEMBER);
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
 * @method assignToTeam
 * @description Assigns an EXISTING project member to a sub-team.
 */
public async assignToTeam(projectId: string, teamId: string, userId: string): Promise<IResult> {
  // 1. Lineage Check: Is the user actually a member of the parent project?
  const project = await projectRepository.findById(projectId);
  const isProjectMember = project.data.members.some((m: { user: any; }) => String(m.user) === userId);

  if (!isProjectMember) {
    return { error: true, message: "User must be a Project Member before joining a Team", code: 403, data: {} };
  }

  // 2. Persistence: Add to the Team collection
  return await teamRepository.addMember(teamId, userId, Role);
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
