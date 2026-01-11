import mongoose from 'mongoose';
import { FilterQuery, UpdateQuery } from 'mongoose';
import Team from './team.model';
import { ITeamDoc } from './team.interface';
import RepositoryService from '../../services/repository.service';
import { IResult } from '../../utils/interfaces.util';

/**
 * Team Repository
 * Extends the generic repository with team-specific methods
 * Caching is handled at the service/controller layer, not here
 */
class TeamRepository extends RepositoryService<ITeamDoc> {
    constructor() {
        super(Team, 'Team');
    }

    /**
     * @name findTeam
     * @description Find a team by either MongoDB ObjectId or code
     * @param input - The team ID (ObjectId or string) or code
     * @param populate - Whether to populate related fields
     * @returns Promise<IResult>
     */
    public async findTeam(
        input: string | number,
        populate:
            | boolean
            | string
            | Array<{ path: string }>
            | undefined = undefined,
    ): Promise<IResult> {
        const result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        try {
            const inputStr = String(input);

            const isObjectId =
                mongoose.Types.ObjectId.isValid(inputStr) &&
                new mongoose.Types.ObjectId(inputStr).toString() === inputStr;

            let query = isObjectId
                ? this.model.findById(inputStr)
                : this.model.findOne({ code: inputStr } as FilterQuery<ITeamDoc>);

            if (populate) {
                const dataPop = Array.isArray(populate) ? populate : [];
                if (dataPop.length > 0) {
                    query = query.populate(dataPop);
                } else if (typeof populate === 'string') {
                    query = query.populate(populate);
                } else {
                    query = query.populate('');
                }
            }

            const document = await query.lean();

            if (!document) {
                result.error = true;
                result.code = 404;
                result.message = 'Team not found';
            } else {
                result.message = 'Team found';
                result.data = document;
            }
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = error.message;
        }

        return result;
    }

    /**
     * @name getTeams
     * @param filter - Optional filter query
     * @param options - Query options (select, sort, page, limit, populate)
     * @returns {Promise<IResult>}
     * @description Get all teams with query middleware features (pagination, sorting, field selection)
     */
    public async getTeams(
        filter?: FilterQuery<ITeamDoc>,
        options?: {
            select?: string;
            sort?: string;
            page?: number;
            limit?: number;
            populate?: string | any;
        },
    ): Promise<IResult> {
        if (options) {
            return this.findAll(filter || {}, options);
        }
        return this.findAll(filter);
    }

    /**
     * @name createTeam
     * @param teamData
     * @returns {Promise<IResult>}
     * @description Create a new team
     */
    public async createTeam(
        teamData: Partial<ITeamDoc>,
    ): Promise<IResult> {
        return this.create(teamData);
    }

    /**
     * @name updateTeam
     * @param id
     * @param updateData
     * @returns {Promise<IResult>}
     * @description Update a team
     */
    public async updateTeam(
        id: string,
        updateData:
            | UpdateQuery<ITeamDoc>
            | Partial<ITeamDoc>
            | mongoose.UpdateQuery<ITeamDoc>,
    ): Promise<IResult> {
        return this.update(id, updateData as any);
    }

    /**
     * @name deleteTeam
     * @param id
     * @returns {Promise<IResult>}
     * @description Delete a team
     */
    public async deleteTeam(id: string): Promise<IResult> {
        return this.delete(id);
    }

    /**
     * @name findByProject
     * @description Efficiently find all teams belonging to a project using the direct-reference index
     * @param projectId - Project ID
     * @returns Promise<IResult>
     */
    public async findByProject(projectId: string): Promise<IResult> {
        return this.findAll({
            project: new mongoose.Types.ObjectId(projectId),
        });
    }

    /**
     * @name addMember
     * @description Add a member to team using type-safe array operation
     * @param teamId - Team ID
     * @param userId - User ID to add
     * @param role - Role for the member
     * @returns Promise<IResult>
     */
    public async addMember(
        teamId: string,
        userId: string,
        role: string,
    ): Promise<IResult> {
        return this.pushToArray(teamId, 'members', {
            user: new mongoose.Types.ObjectId(userId),
            role: role,
            joinedAt: new Date(),
        });
    }

    /**
     * @name removeMember
     * @description Remove a member from team using type-safe array operation
     * @param teamId - Team ID
     * @param userId - User ID to remove
     * @returns Promise<IResult>
     */
    public async removeMember(
        teamId: string,
        userId: string,
    ): Promise<IResult> {
        return this.pullFromArray(teamId, 'members', {
            user: new mongoose.Types.ObjectId(userId),
        });
    }

    /**
     * @name removeUserFromProjectTeams
     * @description Atomic removal of a user from all teams in a project.
     * @param projectId - Project ID
     * @param userId - User ID to remove
     * @returns Promise<IResult>
     */
    public async removeUserFromProjectTeams(
        projectId: string,
        userId: string,
    ): Promise<IResult> {
        try {
            const updateResult = await this.model.updateMany(
                {
                    project: new mongoose.Types.ObjectId(projectId),
                    'members.user': new mongoose.Types.ObjectId(userId),
                },
                {
                    $pull: { members: { user: new mongoose.Types.ObjectId(userId) } },
                },
            );

            return {
                error: false,
                message: 'User successfully removed from project teams',
                code: 200,
                data: { teamsAffected: updateResult.modifiedCount },
            };
        } catch (error: any) {
            return { error: true, code: 500, message: error.message, data: {} };
        }
    }

    /**
     * @name updateMemberRole
     * @description Update a team member's role using type-safe array operation
     * @param teamId - Team ID
     * @param userId - User ID
     * @param newRole - New role for the member
     * @returns Promise<IResult>
     */
    public async updateMemberRole(
        teamId: string,
        userId: string,
        newRole: string,
    ): Promise<IResult> {
        return this.updateArrayElement(
            teamId,
            'members',
            { user: new mongoose.Types.ObjectId(userId) },
            { role: newRole },
        );
    }

    /**
     * @name deleteMany
     * @description Delete multiple teams matching the filter
     * @param filter - Filter query to match teams to delete
     * @returns Promise<IResult>
     */
    public async deleteMany(filter: any): Promise<IResult> {
        return super.deleteMany(filter);
    }
}

export default new TeamRepository();
