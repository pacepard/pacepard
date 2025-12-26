import { FilterQuery } from "mongoose";
import Admin from "./admin.model";
import { IAdminDoc } from "./admin.interface";
import RepositoryService from "../../services/repository.service";
import { IResult, IPagination } from "../../utils/interfaces.util";

/**
 * Admin Repository
 * Extends the generic repository with admin-specific methods
 * Includes Redis caching and query middleware features
 */
class AdminRepository extends RepositoryService<IAdminDoc> {
  constructor() {
    // Enable caching with 5 minute default TTL
    super(Admin, "Admin", true, 300);
  }

  /**
   * @name findAdmin
   * @description Find an admin by either MongoDB ObjectId or slug
   * @param input - The admin ID (ObjectId or string) or slug
   * @param populate - Whether to populate related fields
   * @returns Promise<IResult>
   */
  public async findAdmin(
    input: string | number,
    populate = false
  ): Promise<IResult> {
    return this.findByIdOrSlug(input, populate);
  }

  /**
   * @name getAdmins
   * @param filter - Optional filter query
   * @param options - Query options (select, sort, page, limit, populate, cache)
   * @returns {Promise<IResult & { pagination?: any; count?: number; total?: number }>}
   * @description Get all admins with query middleware features (pagination, sorting, field selection)
   */
  public async getAdmins(
    filter?: FilterQuery<IAdminDoc>,
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
   * @name createAdmin
   * @param adminData
   * @returns {Promise<IResult>}
   * @description Create a new admin
   */
  public async createAdmin(adminData: Partial<IAdminDoc>): Promise<IResult> {
    return this.create(adminData);
  }

  /**
   * @name updateAdmin
   * @param id
   * @param updateData
   * @returns {Promise<IResult>}
   * @description Update an admin
   */
  public async updateAdmin(
    id: string,
    updateData: Partial<IAdminDoc>
  ): Promise<IResult> {
    return this.update(id, updateData);
  }

  /**
   * @name deleteAdmin
   * @param id
   * @returns {Promise<IResult>}
   * @description Delete an admin
   */
  public async deleteAdmin(id: string): Promise<IResult> {
    return this.delete(id);
  }
}

export default new AdminRepository();

