import { FilterQuery } from 'mongoose';
import Hackathon from './hackathon.model';
import { IHackathonDoc } from './hackathon.interface';
import RepositoryService from '../../internals/repository.service';
import { IResult } from '../../../utils/interfaces.util';

/**
 * Hackathon Repository
 * Extends the generic repository with hackathon-specific methods
 */
class HackathonRepository extends RepositoryService<IHackathonDoc> {
    constructor() {
        super(Hackathon, 'Hackathon');
    }

    /**
     * @name findHackathon
     * @description Find a hackathon by either MongoDB ObjectId or slug
     * @param input - The hackathon ID (ObjectId or string) or slug
     * @param populate - Whether to populate related fields
     * @returns Promise<IResult>
     */
    public async findHackathon(
        input: string | number,
        populate:
            | boolean
            | string
            | Array<{ path: string }>
            | undefined = undefined,
    ): Promise<IResult> {
        return this.findByIdOrSlug(input, populate);
    }

    /**
     * @name getHackathons
     * @param filter - Optional filter query
     * @param options - Query options (select, sort, page, limit, populate)
     * @returns {Promise<IResult>}
     * @description Get all hackathons with query middleware features (pagination, sorting, field selection)
     */
    public async getHackathons(
        filter?: FilterQuery<IHackathonDoc>,
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
     * @name createHackathon
     * @param hackathonData
     * @returns {Promise<IResult>}
     * @description Create a new hackathon
     */
    public async createHackathon(
        hackathonData: Partial<IHackathonDoc>,
    ): Promise<IResult> {
        return this.create(hackathonData);
    }

    /**
     * @name updateHackathon
     * @param id
     * @param updateData
     * @returns {Promise<IResult>}
     * @description Update a hackathon
     */
    public async updateHackathon(
        id: string,
        updateData: Partial<IHackathonDoc>,
    ): Promise<IResult> {
        return this.update(id, updateData);
    }

    /**
     * @name deleteHackathon
     * @param id
     * @returns {Promise<IResult>}
     * @description Delete a hackathon
     */
    public async deleteHackathon(id: string): Promise<IResult> {
        return this.delete(id);
    }

    /**
     * @name findByWorkspace
     * @description Efficiently find all hackathons belonging to a workspace
     * @param workspaceId - Workspace ID
     * @returns Promise<IResult>
     */
    public async findByWorkspace(workspaceId: string): Promise<IResult> {
        return this.findAll({
            workspace: workspaceId as any,
        });
    }
}

export default new HackathonRepository();
