import { FilterQuery } from "mongoose";
import Business from "./business.model";
import { IBusinessDoc } from "./business.interface";
import RepositoryService from "../../services/repository.service";
import { IResult, IPagination } from "../../utils/interfaces.util";

/**
 * Business Repository
 * Extends the generic repository with business-specific methods
 * Includes Redis caching and query middleware features
 */
class BusinessRepository extends RepositoryService<IBusinessDoc> {
  constructor() {
    // Enable caching with 5 minute default TTL
    super(Business, "Business", true, 300);
  }

  /**
   * @name findBusiness
   * @description Find a business by either MongoDB ObjectId or slug
   * @param input - The business ID (ObjectId or string) or slug
   * @param populate - Whether to populate related fields
   * @returns Promise<IResult>
   */
  public async findBusiness(
    input: string | number,
    populate = false
  ): Promise<IResult> {
    return this.findByIdOrSlug(input, populate);
  }

  /**
   * @name getBusinesses
   * @param filter - Optional filter query
   * @param options - Query options (select, sort, page, limit, populate, cache)
   * @returns {Promise<IResult & { pagination?: any; count?: number; total?: number }>}
   * @description Get all businesses with query middleware features (pagination, sorting, field selection)
   */
  public async getBusinesses(
    filter?: FilterQuery<IBusinessDoc>,
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
   * @name createBusiness
   * @param businessData
   * @returns {Promise<IResult>}
   * @description Create a new business
   */
  public async createBusiness(
    businessData: Partial<IBusinessDoc>
  ): Promise<IResult> {
    return this.create(businessData);
  }

  /**
   * @name updateBusiness
   * @param id
   * @param updateData
   * @returns {Promise<IResult>}
   * @description Update a business
   */
  public async updateBusiness(
    id: string,
    updateData: Partial<IBusinessDoc>
  ): Promise<IResult> {
    return this.update(id, updateData);
  }

  /**
   * @name deleteBusiness
   * @param id
   * @returns {Promise<IResult>}
   * @description Delete a business
   */
  public async deleteBusiness(id: string): Promise<IResult> {
    return this.delete(id);
  }
}

export default new BusinessRepository();

