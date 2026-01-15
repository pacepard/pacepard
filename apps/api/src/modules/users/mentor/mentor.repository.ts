import { FilterQuery } from 'mongoose';
import mongoose from 'mongoose';
import Mentor from './mentor.model';
import { IMentorDoc } from './mentor.interface';
import RepositoryService from '../../../services/repository.service';
import { IResult } from '../../../utils/interfaces.util';

/**
 * Mentor Repository
 * Extends the generic repository with mentor-specific methods
 */
class MentorRepository extends RepositoryService<IMentorDoc> {
    constructor() {
        super(Mentor, 'Mentor');
    }

    /**
     * @name findMentor
     * @description Find a mentor by either MongoDB ObjectId or slug
     * @param input - The mentor ID (ObjectId or string) or slug
     * @param populate - Whether to populate related fields
     * @returns Promise<IResult>
     */
    public async findMentor(
        input: string | number,
        populate: boolean | Array<{ path: string }> = false,
    ): Promise<IResult> {
        return this.findByIdOrSlug(input, populate);
    }

    /**
     * @name getMentors
     * @param filter - Optional filter query
     * @param options - Query options (select, sort, page, limit, populate)
     * @returns {Promise<IResult>}
     * @description Get all mentors with query middleware features (pagination, sorting, field selection)
     */
    public async getMentors(
        filter?: FilterQuery<IMentorDoc>,
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
     * @name createMentor
     * @param mentorData
     * @returns {Promise<IResult>}
     * @description Create a new mentor
     */
    public async createMentor(
        mentorData: Partial<IMentorDoc>,
    ): Promise<IResult> {
        return this.create(mentorData);
    }

    /**
     * @name updateMentor
     * @param id
     * @param updateData
     * @returns {Promise<IResult>}
     * @description Update a mentor
     */
    public async updateMentor(
        id: string,
        updateData: Partial<IMentorDoc>,
    ): Promise<IResult> {
        return this.update(id, updateData);
    }

    /**
     * @name deleteMentor
     * @param id
     * @returns {Promise<IResult>}
     * @description Delete a mentor
     */
    public async deleteMentor(id: string): Promise<IResult> {
        return this.delete(id);
    }
}

export default new MentorRepository();
