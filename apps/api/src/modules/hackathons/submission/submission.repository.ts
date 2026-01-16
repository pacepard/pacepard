import { FilterQuery } from 'mongoose';
import Submission from './submission.model';
import { ISubmissionDoc } from './submission.interface';
import RepositoryService from '../../../services/repository.service';
import { IResult } from '../../../utils/interfaces.util';

/**
 * Submission Repository
 * Extends the generic repository with submission-specific methods
 */
class SubmissionRepository extends RepositoryService<ISubmissionDoc> {
    constructor() {
        super(Submission, 'Submission');
    }

    /**
     * @name findSubmission
     * @description Find a submission by MongoDB ObjectId
     * @param input - The submission ID (ObjectId or string)
     * @param populate - Whether to populate related fields
     * @returns Promise<IResult>
     */
    public async findSubmission(
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
     * @name getSubmissions
     * @param filter - Optional filter query
     * @param options - Query options (select, sort, page, limit, populate)
     * @returns {Promise<IResult>}
     * @description Get all submissions with query middleware features
     */
    public async getSubmissions(
        filter?: FilterQuery<ISubmissionDoc>,
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
     * @name createSubmission
     * @param submissionData
     * @returns {Promise<IResult>}
     * @description Create a new submission
     */
    public async createSubmission(
        submissionData: Partial<ISubmissionDoc>,
    ): Promise<IResult> {
        return this.create(submissionData);
    }

    /**
     * @name updateSubmission
     * @param id
     * @param updateData
     * @returns {Promise<IResult>}
     * @description Update a submission
     */
    public async updateSubmission(
        id: string,
        updateData: Partial<ISubmissionDoc>,
    ): Promise<IResult> {
        return this.update(id, updateData);
    }

    /**
     * @name deleteSubmission
     * @param id
     * @returns {Promise<IResult>}
     * @description Delete a submission
     */
    public async deleteSubmission(id: string): Promise<IResult> {
        return this.delete(id);
    }

    /**
     * @name findByHackathon
     * @description Efficiently find all submissions belonging to a hackathon
     * @param hackathonId - Hackathon ID
     * @returns Promise<IResult>
     */
    public async findByHackathon(hackathonId: string): Promise<IResult> {
        return this.findAll({
            hackathon: hackathonId as any,
        });
    }

    /**
     * @name findByEntry
     * @description Efficiently find all submissions belonging to an entry
     * @param entryId - Entry ID
     * @returns Promise<IResult>
     */
    public async findByEntry(entryId: string): Promise<IResult> {
        return this.findAll({
            entry: entryId as any,
        });
    }
}

export default new SubmissionRepository();
