import { FilterQuery } from 'mongoose';
import Squad from './squad.model';
import { ISquadDoc } from './squad.interface';
import RepositoryService from '../../../services/repository.service';
import { IResult } from '../../../utils/interfaces.util';

/**
 * Squad Repository
 * Extends the generic repository with squad-specific methods
 */
class SquadRepository extends RepositoryService<ISquadDoc> {
    constructor() {
        super(Squad, 'Squad');
    }

    /**
     * @name findSquad
     * @description Find a squad by MongoDB ObjectId
     * @param input - The squad ID (ObjectId or string)
     * @param populate - Whether to populate related fields
     * @returns Promise<IResult>
     */
    public async findSquad(
        input: string | number,
        populate:
            | boolean
            | string
            | Array<{ path: string }>
            | undefined = undefined,
    ): Promise<IResult> {
        return this.findById(input, populate);
    }

    /**
     * @name getSquads
     * @param filter - Optional filter query
     * @param options - Query options (select, sort, page, limit, populate)
     * @returns {Promise<IResult>}
     * @description Get all squads with query middleware features
     */
    public async getSquads(
        filter?: FilterQuery<ISquadDoc>,
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
     * @name createSquad
     * @param squadData
     * @returns {Promise<IResult>}
     * @description Create a new squad
     */
    public async createSquad(squadData: Partial<ISquadDoc>): Promise<IResult> {
        return this.create(squadData);
    }

    /**
     * @name updateSquad
     * @param id
     * @param updateData
     * @returns {Promise<IResult>}
     * @description Update a squad
     */
    public async updateSquad(
        id: string,
        updateData: Partial<ISquadDoc>,
    ): Promise<IResult> {
        return this.update(id, updateData);
    }

    /**
     * @name deleteSquad
     * @param id
     * @returns {Promise<IResult>}
     * @description Delete a squad
     */
    public async deleteSquad(id: string): Promise<IResult> {
        return this.delete(id);
    }

    /**
     * @name findByHackathon
     * @description Efficiently find all squads belonging to a hackathon
     * @param hackathonId - Hackathon ID
     * @returns Promise<IResult>
     */
    public async findByHackathon(hackathonId: string): Promise<IResult> {
        return this.findAll({
            hackathon: hackathonId as any,
        });
    }
}

export default new SquadRepository();
