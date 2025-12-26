import { FilterQuery } from "mongoose";
import Talent from "./talent.model";
import { ITalentDoc } from "./talent.interface";
import RepositoryService from "../../services/repository.service";
import { IResult, IPagination } from "../../utils/interfaces.util";

/**
 * Talent Repository
 * Extends the generic repository with talent-specific methods
 * Includes Redis caching and query middleware features
 */
class TalentRepository extends RepositoryService<ITalentDoc> {
  constructor() {
    // Enable caching with 5 minute default TTL
    super(Talent, "Talent", true, 300);
  }

  /**
   * @name findTalent
   * @description Find a talent by either MongoDB ObjectId or slug
   * @param input - The talent ID (ObjectId or string) or slug
   * @param populate - Whether to populate related fields
   * @returns Promise<IResult>
   */
  public async findTalent(
    input: string | number,
    populate = false
  ): Promise<IResult> {
    return this.findByIdOrSlug(input, populate);
  }

  /**
   * @name getTalents
   * @param filter - Optional filter query
   * @param options - Query options (select, sort, page, limit, populate, cache)
   * @returns {Promise<IResult & { pagination?: any; count?: number; total?: number }>}
   * @description Get all talents with query middleware features (pagination, sorting, field selection)
   */
  public async getTalents(
    filter?: FilterQuery<ITalentDoc>,
    options?: {
      select?: string;
      sort?: string;
      page?: number;
      limit?: number;
      populate?: string | any;
      cache?: boolean;
    }
  ): Promise<IResult & { pagination?: any; count?: number; total?: number }> {
    if (options) {
      return this.findAll(filter || {}, options) as any;
    }
    return this.findAll(filter);
  }

  /**
   * @name createTalent
   * @param talentData
   * @returns {Promise<IResult>}
   * @description Create a new talent
   */
  public async createTalent(talentData: Partial<ITalentDoc>): Promise<IResult> {
    return this.create(talentData);
  }

  /**
   * @name updateTalent
   * @param id
   * @param updateData
   * @returns {Promise<IResult>}
   * @description Update a talent
   */
  public async updateTalent(
    id: string,
    updateData: Partial<ITalentDoc>
  ): Promise<IResult> {
    return this.update(id, updateData);
  }

  /**
   * @name deleteTalent
   * @param id
   * @returns {Promise<IResult>}
   * @description Delete a talent
   */
  public async deleteTalent(id: string): Promise<IResult> {
    return this.delete(id);
  }
}

export default new TalentRepository();

