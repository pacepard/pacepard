import Team from "./team.model";
import { ITeamDoc } from "./team.interface";
import RepositoryService from "../../services/repository.service";
import { IResult } from "../../utils/interfaces.util";
import mongoose from "mongoose";

class TeamRepository extends RepositoryService<ITeamDoc> {
  constructor() {
    super(Team, "Team");
  }

/**
   * @name findTeam
   * @description Find a team by ID with flexible population
   */
  public async findTeam(
    teamId: string,
    populate: boolean | any[] = false 
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
   * @description Using $addToSet instead of $push to prevent duplicates at the DB level
   */
  public async addMember(
    teamId: string,
    userId: string,
    role: any
  ): Promise<IResult> {
    try {
      const result = await this.model.updateOne(
        { _id: new mongoose.Types.ObjectId(teamId) },
        { 
          $addToSet: { 
            members: { 
              user: new mongoose.Types.ObjectId(userId), 
              role, 
              joinedAt: new Date() 
            } 
          } 
        }
      );
      return { error: false, message: "Member added", code: 200, data: result };
    } catch (error: any) {
      return { error: true, code: 500, message: error.message, data: {} };
    }
  }

  /**
   * @name removeMember
   * @description Remove a member from a team using type-safe array operation
   */
  public async removeMember(
    teamId: string,
    userId: string
  ): Promise<IResult> {
    return this.pullFromArray(teamId, 'members', {
      user: new mongoose.Types.ObjectId(userId)
    });
  }

  /**
   * @name updateMemberRole
   * @description Update a team member's role using type-safe array operation
   */
  public async updateMemberRole(
    teamId: string,
    userId: string,
    newRole: any
  ): Promise<IResult> {
    return this.updateArrayElement(
      teamId,
      'members',
      { user: new mongoose.Types.ObjectId(userId) },
      newRole
    );
  }

/**
   * @name removeUserFromProjectTeams
   * @description Atomic removal of a user from all teams in a project.
   * Efficiently uses updateMany to ensure the user is out before being rotated.
   */
  public async removeUserFromProjectTeams(
    projectId: string,
    userId: string
  ): Promise<IResult> {
    try {
      // One operation to clear the user out of every team container in this project
      const updateResult = await this.model.updateMany(
        { 
          projectId: new mongoose.Types.ObjectId(projectId),
          "members.user": new mongoose.Types.ObjectId(userId) 
        },
        { 
          $pull: { members: { user: new mongoose.Types.ObjectId(userId) } } 
        }
      );

      return {
        error: false,
        message: "User successfully removed from project teams",
        code: 200,
        data: { teamsAffected: updateResult.modifiedCount }
      };
    } catch (error: any) {
      return { error: true, code: 500, message: error.message, data: {} };
    }
  }
}

export default new TeamRepository();
