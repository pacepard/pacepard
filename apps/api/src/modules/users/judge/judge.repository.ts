import { FilterQuery } from 'mongoose';
import mongoose from 'mongoose';
import Judge from './judge.model';
import { IJudgeDoc } from './judge.interface';
import RepositoryService from '../../../services/repository.service';
import { IResult } from '../../../utils/interfaces.util';

/**
 * Judge Repository
 * Extends the generic repository with judge-specific methods
 */
class JudgeRepository extends RepositoryService<IJudgeDoc> {
    constructor() {
        super(Judge, 'Judge');
    }

    /**
     * @name findJudge
     * @description Find a judge by either MongoDB ObjectId or slug
     * @param input - The judge ID (ObjectId or string) or slug
     * @param populate - Whether to populate related fields
     * @returns Promise<IResult>
     */
    public async findJudge(
        input: string | number,
        populate: boolean | Array<{ path: string }> = false,
    ): Promise<IResult> {
        return this.findByIdOrSlug(input, populate);
    }

    /**
     * @name getJudges
     * @param filter - Optional filter query
     * @param options - Query options (select, sort, page, limit, populate)
     * @returns {Promise<IResult>}
     * @description Get all judges with query middleware features (pagination, sorting, field selection)
     */
    public async getJudges(
        filter?: FilterQuery<IJudgeDoc>,
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
     * @name createJudge
     * @param judgeData
     * @returns {Promise<IResult>}
     * @description Create a new judge
     */
    public async createJudge(
        judgeData: Partial<IJudgeDoc>,
    ): Promise<IResult> {
        return this.create(judgeData);
    }

    /**
     * @name updateJudge
     * @param id
     * @param updateData
     * @returns {Promise<IResult>}
     * @description Update a judge
     */
    public async updateJudge(
        id: string,
        updateData: Partial<IJudgeDoc>,
    ): Promise<IResult> {
        return this.update(id, updateData);
    }

    /**
     * @name deleteJudge
     * @param id
     * @returns {Promise<IResult>}
     * @description Delete a judge
     */
    public async deleteJudge(id: string): Promise<IResult> {
        return this.delete(id);
    }
}

export default new JudgeRepository();
