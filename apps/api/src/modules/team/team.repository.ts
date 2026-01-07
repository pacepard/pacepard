import Team from "./team.model";
import { ITeamDoc } from "./team.interface";
import RepositoryService from "../../services/repository.service";
import { IResult } from "../../utils/interfaces.util";

class TeamRepository extends RepositoryService<ITeamDoc> {
  constructor() {
    super(Team, "Team");
  }

  /**
   * @name findTeam
   * @description Find a team by ID
   */
  public async findTeam(
    teamId: string,
    populate = false
  ): Promise<IResult> {
    return this.findById(teamId, populate);
  }

  /**
   * @name findByProject
   * @description Find all teams belonging to a project
   */
  public async findByProject(projectId: string): Promise<IResult> {
    return this.findAll({ 
      projectId: new mongoose.Types.ObjectId(projectId) 
    });
  }

  /**
   * @name findTeamMember
   * @description Check if a user is a member of a specific team
   */
  public async findTeamMember(teamId: string, userId: string): Promise<IResult> {
    return this.findOne({
      _id: new mongoose.Types.ObjectId(teamId),
      "members.user": new mongoose.Types.ObjectId(userId)
    });
  }

  /**
   * @name createTeam
   * @description Create a new team
   */
  public async createTeam(
    teamData: Partial<ITeamDoc>
  ): Promise<IResult> {
    return this.create(teamData);
  }

  /**
   * @name updateTeam
   * @description Update a team
   */
  public async updateTeam(
    teamId: string,
    updateData: any
  ): Promise<IResult> {
    return this.update(teamId, updateData);
  }

  /**
   * @name deleteTeam
   * @description Delete a team
   */
  public async deleteTeam(teamId: string): Promise<IResult> {
    return this.delete(teamId);
  }

  /**
   * @name addMember
   * @description Add a member to a team
   */
  public async addMember(
    teamId: string,
    userId: string,
    role: any
  ): Promise<IResult> {
    return this.update(teamId, {
      $push: { 
        members: { 
          user: new mongoose.Types.ObjectId(userId),
          role: role,
          joinedAt: new Date()
        } 
      } as any
    } as any);
  }

  /**
   * @name removeMember
   * @description Remove a member from a team
   */
  public async removeMember(
    teamId: string,
    userId: string
  ): Promise<IResult> {
    return this.update(teamId, {
      $pull: { 
        members: { 
          user: new mongoose.Types.ObjectId(userId) 
        } 
      } as any
    } as any);
  }

  /**
   * @name updateMemberRole
   * @description Update a team member's role
   */
  public async updateMemberRole(
    teamId: string,
    userId: string,
    newRole: any
  ): Promise<IResult> {
    return this.update(teamId, {
      $set: { "members.$.role": newRole } as any
    } as any, {
      arrayFilters: [{ "members.user": new mongoose.Types.ObjectId(userId) }]
    } as any
    );
  }

  /**
   * @name removeUserFromProjectTeams
   * @description Remove a user from all teams in a project
   * Used during team rotation
   */
  public async removeUserFromProjectTeams(
    projectId: string,
    userId: string
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };
    
    try {
      const teams = await this.findAll({
        projectId: new mongoose.Types.ObjectId(projectId),
        "members.user": new mongoose.Types.ObjectId(userId)
      });

      if (teams.error || !teams.data) {
        result.error = false; // Not finding teams is OK
        result.message = "User removed from project teams (no teams found)";
        return result;
      }

      const teamList = teams.data as any[];
      
      // Remove user from each team
      for (const team of teamList) {
        await this.removeMember(team._id.toString(), userId);
      }

      result.message = "User removed from all project teams";
      result.data = { teamsAffected: teamList.length };
    } catch (error: any) {
      result.error = true;
      result.code = 500;
      result.message = error.message;
    }

    return result;
  }
}

export default new TeamRepository();
