import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../middlewares/async.mdw";
import ErrorResponse from '../../utils/error.util';
import businessService from './business.service';
import businessRepository from './business.repository';
import { IBusinessDoc } from './business.interface';
import { UpdateBusinessDTO } from './business.dto';
import redisWrapper from "../../middlewares/redis.mdw";

/**
 * @name getBusiness
 * @description Retrieves business profile information
 * @route GET /business
 * @access  Private
 */
export const getBusiness = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) return next(new ErrorResponse("Unauthorized", 401, []));

    const cacheKey = `business:profile:${userId}`;
    const cacheTTL = 300; // 5 minutes for business profile data

    try {
      // Check cache first
      const cached = await redisWrapper.fetchData<any>(cacheKey);
      if (cached) {
        return res.status(200).json({
          error: false,
          errors: [],
          data: cached,
          message: "Business profile retrieved successfully (cached).",
          status: 200,
        });
      }

      // Get business profile from service
      const result = await businessService.getBusinessProfile(String(userId));
      
      if (result.error || !result.data) {
        return next(new ErrorResponse(result.message || "Business profile not found", result.code || 404, []));
      }

      // Cache the result
      await redisWrapper.keepData(
        { key: cacheKey, value: result.data },
        cacheTTL
      );

      res.status(200).json({
        error: false,
        errors: [],
        data: result.data,
        message: result.message || "Business profile retrieved successfully.",
        status: 200,
      });
    } catch (error: any) {
      return next(new ErrorResponse(error.message || "Failed to retrieve business profile", 500, []));
    }
  }
);

/**
 * @name getBusinesses
 * @description Retrieves a paginated list of businesses with filtering and sorting
 * @route GET /businesses
 * @access  Private (Admin only - should add admin check)
 */
export const getBusinesses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      page = 1,
      limit = 25,
      sort = "-createdAt",
      select,
      populate,
      ...filters
    } = req.query;

    // Build cache key from query parameters
    const cacheKey = `businesses:list:${JSON.stringify({ page, limit, sort, select, filters })}`;
    const cacheTTL = 180; // 3 minutes for business lists

    try {
      // Check cache first
      const cached = await redisWrapper.fetchData<any>(cacheKey);
      if (cached) {
        return res.status(200).json({
          error: false,
          errors: [],
          data: cached.data,
          pagination: cached.pagination,
          count: cached.count,
          total: cached.total,
          message: "Businesses retrieved successfully (cached).",
          status: 200,
        });
      }

      // Build query options
      const options: any = {
        page: parseInt(String(page), 10),
        limit: parseInt(String(limit), 10),
        sort: String(sort),
      };

      if (select) {
        options.select = String(select);
      }

      if (populate) {
        options.populate = String(populate);
      }

      // Get businesses from repository
      const result = await businessRepository.getBusinesses(filters as any, options);

      if (result.error) {
        return next(new ErrorResponse(result.message, result.code || 500, []));
      }

      // Prepare response data
      const responseData = {
        data: result.data,
        pagination: result.pagination,
        count: result.count,
        total: result.total,
      };

      // Cache the result
      await redisWrapper.keepData(
        { key: cacheKey, value: responseData },
        cacheTTL
      );

      res.status(200).json({
        error: false,
        errors: [],
        data: result.data,
        pagination: result.pagination,
        count: result.count,
        total: result.total,
        message: result.message || "Businesses retrieved successfully.",
        status: 200,
      });
    } catch (error: any) {
      return next(new ErrorResponse(error.message || "Failed to retrieve businesses", 500, []));
    }
  }
);

/**
 * @name updateBusiness
 * @description Updates business profile information
 * @route PUT /business
 * @access  Private
 */
export const updateBusiness = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) return next(new ErrorResponse("Unauthorized", 401, []));

    const data: UpdateBusinessDTO = req.body;

    try {
      const result = await businessService.updateProfile(String(userId), data);

      if (result.error) {
        return next(new ErrorResponse(result.message, result.code || 500, []));
      }

      // Invalidate cache
      try {
        await redisWrapper.deleteData(`business:profile:${userId}`);
      } catch (cacheError) {
        console.error("Cache invalidation failed:", cacheError);
      }

      res.status(200).json({
        error: false,
        errors: [],
        data: result.data,
        message: result.message || "Business profile updated successfully.",
        status: 200,
      });
    } catch (error: any) {
      return next(new ErrorResponse(error.message || "Failed to update business profile", 500, []));
    }
  }
);

/**
 * @name updateTags
 * @description Updates business tags
 * @route PUT /business/tags
 * @access  Private
 */
export const updateTags = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) return next(new ErrorResponse("Unauthorized", 401, []));

    const { tags } = req.body;

    if (!tags || !Array.isArray(tags)) {
      return next(new ErrorResponse("Tags must be an array", 400, []));
    }

    try {
      const result = await businessService.updateTags(String(userId), tags);

      if (result.error) {
        return next(new ErrorResponse(result.message, result.code || 500, []));
      }

      // Invalidate cache
      try {
        await redisWrapper.deleteData(`business:profile:${userId}`);
      } catch (cacheError) {
        console.error("Cache invalidation failed:", cacheError);
      }

      res.status(200).json({
        error: false,
        errors: [],
        data: result.data,
        message: result.message || "Tags updated successfully.",
        status: 200,
      });
    } catch (error: any) {
      return next(new ErrorResponse(error.message || "Failed to update tags", 500, []));
    }
  }
);

/**
 * @name addTag
 * @description Adds a tag to business profile
 * @route POST /business/tags
 * @access  Private
 */
export const addTag = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) return next(new ErrorResponse("Unauthorized", 401, []));

    const { tag } = req.body;

    if (!tag || typeof tag !== 'string') {
      return next(new ErrorResponse("Tag must be a string", 400, []));
    }

    try {
      const result = await businessService.addTag(String(userId), tag);

      if (result.error) {
        return next(new ErrorResponse(result.message, result.code || 500, []));
      }

      // Invalidate cache
      try {
        await redisWrapper.deleteData(`business:profile:${userId}`);
      } catch (cacheError) {
        console.error("Cache invalidation failed:", cacheError);
      }

      res.status(200).json({
        error: false,
        errors: [],
        data: result.data,
        message: result.message || "Tag added successfully.",
        status: 200,
      });
    } catch (error: any) {
      return next(new ErrorResponse(error.message || "Failed to add tag", 500, []));
    }
  }
);

/**
 * @name removeTag
 * @description Removes a tag from business profile
 * @route DELETE /business/tags/:tag
 * @access  Private
 */
export const removeTag = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) return next(new ErrorResponse("Unauthorized", 401, []));

    const { tag } = req.params;

    if (!tag) {
      return next(new ErrorResponse("Tag is required", 400, []));
    }

    try {
      const result = await businessService.removeTag(String(userId), tag);

      if (result.error) {
        return next(new ErrorResponse(result.message, result.code || 500, []));
      }

      // Invalidate cache
      try {
        await redisWrapper.deleteData(`business:profile:${userId}`);
      } catch (cacheError) {
        console.error("Cache invalidation failed:", cacheError);
      }

      res.status(200).json({
        error: false,
        errors: [],
        data: result.data,
        message: result.message || "Tag removed successfully.",
        status: 200,
      });
    } catch (error: any) {
      return next(new ErrorResponse(error.message || "Failed to remove tag", 500, []));
    }
  }
);

