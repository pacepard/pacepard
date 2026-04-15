import { FilterQuery } from 'mongoose';
import Entry from './entry.model';
import { IEntryDoc } from './entry.interface';
import RepositoryService from '../../internals/repository.service';
import { IResult } from '../../../utils/interfaces.util';

/**
 * Entry Repository
 * Extends the generic repository with entry-specific methods
 */
class EntryRepository extends RepositoryService<IEntryDoc> {
    constructor() {
        super(Entry, 'Entry');
    }

    /**
     * @name findEntry
     * @description Find an entry by either MongoDB ObjectId or slug
     * @param input - The entry ID (ObjectId or string) or slug
     * @param populate - Whether to populate related fields
     * @returns Promise<IResult>
     */
    public async findEntry(
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
     * @name getEntries
     * @param filter - Optional filter query
     * @param options - Query options (select, sort, page, limit, populate)
     * @returns {Promise<IResult>}
     * @description Get all entries with query middleware features (pagination, sorting, field selection)
     */
    public async getEntries(
        filter?: FilterQuery<IEntryDoc>,
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
     * @name createEntry
     * @param entryData
     * @returns {Promise<IResult>}
     * @description Create a new entry
     */
    public async createEntry(entryData: Partial<IEntryDoc>): Promise<IResult> {
        return this.create(entryData);
    }

    /**
     * @name updateEntry
     * @param id
     * @param updateData
     * @returns {Promise<IResult>}
     * @description Update an entry
     */
    public async updateEntry(
        id: string,
        updateData: Partial<IEntryDoc>,
    ): Promise<IResult> {
        return this.update(id, updateData);
    }

    /**
     * @name deleteEntry
     * @param id
     * @returns {Promise<IResult>}
     * @description Delete an entry
     */
    public async deleteEntry(id: string): Promise<IResult> {
        return this.delete(id);
    }

    /**
     * @name findByHackathon
     * @description Efficiently find all entries belonging to a hackathon
     * @param hackathonId - Hackathon ID
     * @returns Promise<IResult>
     */
    public async findByHackathon(hackathonId: string): Promise<IResult> {
        return this.findAll({
            hackathon: hackathonId as any,
        });
    }
}

export default new EntryRepository();
