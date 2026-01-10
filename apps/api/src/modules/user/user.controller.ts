import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../middlewares/async.mdw";
import ErrorResponse from '../../utils/error.util'
import authMapper from "../auth/auth.mapper";
import userService from '../../modules/user/user.service';
import userRepository from './user.repository';
import { IUserDoc } from './user.interface';
import {
  OnboardStep1DTO,
  OnboardStep2DTO,
  OnboardStep3TalentDTO,
  OnboardStep3BusinessDTO,
} from "../auth/auth.dto";
import redisWrapper from "../../middlewares/redis.mdw";



/**
 * @name getUser
 * @description Retrieves user information excluding email, password, and permission settings
 * @route GET /user
 * @access  Private
 */
export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {

    const userId = (req as any).user?.id;
    if (!userId) return next(new ErrorResponse("Unauthorized", 401, []));

    const cacheKey = `user:profile:${userId}`;
    const cacheTTL = 300; // 5 minutes for user profile data

      // Check cache first
      const cached = await redisWrapper.fetchData<any>(cacheKey);
      if (cached) {
        return res.status(200).json({
          error: false,
          errors: [],
          data: cached,
          message: "User information retrieved successfully (cached).",
          status: 200,
        });
      }

      // Find the user by ID using repository
      const userResult = await userRepository.findById(String(userId), false);
      if (userResult.error || !userResult.data) {
        return next(new ErrorResponse("User not found", 404, []));
      }

      const user = userResult.data as IUserDoc;

      // Map the user information to include only the specified fields
      const userInfo = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.location?.phoneNumber || '',
        phoneCode: user.location?.phoneCode || '',
        activated: user.isActivated || false,
      };

      // Cache the result
      await redisWrapper.keepData(
        { key: cacheKey, value: userInfo },
        cacheTTL
      );

      res.status(200).json({
        error: false,
        errors: [],
        data: userInfo,
        message: "User information retrieved successfully.",
        status: 200,
      });
    
  }
);

/**
 * @name getUsers
 * @description Retrieves a paginated list of users with filtering and sorting
 * @route GET /users
 * @access  Private (Admin only - should add admin check)
 */
export const getUsers = asyncHandler(
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
    const cacheKey = `users:list:${JSON.stringify({ page, limit, sort, select, filters })}`;
    const cacheTTL = 180; // 3 minutes for user lists (shorter than individual profiles)

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
          message: "Users retrieved successfully (cached).",
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

      // Get users from repository
      const result = await userRepository.getUsers(filters as any, options);

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
        message: result.message,
        status: 200,
      });
    
  }
);



/**
 * @name deactivateAccount
 * @description Deactivates the user account
 * @route DELETE /user/deactivate
 * @access  Private
 */
export const deactivateAccount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) return next(new ErrorResponse("Unauthorized", 401, []));

    // Find the user by ID using repository
    const userResult = await userRepository.findById(String(userId), false);
    if (userResult.error || !userResult.data) {
      return next(new ErrorResponse("User not found", 404, []));
    }

    // Deactivate the user account using repository
    const updateResult = await userRepository.updateUser(String(userId), {
      isDeactivated: true,
    } as Partial<IUserDoc>);

    if (updateResult.error) {
      return next(new ErrorResponse(updateResult.message, updateResult.code || 500, []));
    }

    // Invalidate cache for this user
    try {
      await redisWrapper.deleteData(`user:profile:${userId}`);
      // Also invalidate any list caches that might include this user
      // Note: In production, you might want to use pattern matching or maintain a cache key registry
    } catch (cacheError) {
      // Silently fail cache invalidation - don't break the request
      console.error("Cache invalidation failed:", cacheError);
    }

    res.status(200).json({
      error: false,
      errors: [],
      message: "User account deactivated successfully.",
      status: 200,
    });
  }
);


/**
 * @name onboardStep1
 * @description Step 1: Set user type (TALENT or BUSINESS)
 * @route POST /user/onboard/step-1
 * @access Private (Authenticated users only)
 */
export const onboardStep1 = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const data: OnboardStep1DTO = req.body;

    const result = await userService.step1SetUserType(userId, data);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code || 400, []));
    }

    res.status(200).json({
      error: false,
      message: result.message,
      status: 200,
      errors: [],
      data: result.data,
    });
  }
);

/**
 * @name onboardStep2
 * @description Step 2: Set basic user information
 * @route POST /user/onboard/step-2
 * @access Private (Authenticated users only)
 */
export const onboardStep2 = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const data: OnboardStep2DTO = req.body;

    const result = await userService.step2SetBasicInfo(userId, data);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code || 400, []));
    }

    res.status(200).json({
      error: false,
      message: result.message,
      status: 200,
      errors: [],
      data: result.data,
    });
  }
);

/**
 * @name onboardStep3Talent
 * @description Step 3: Set talent-specific information
 * @route POST /user/onboard/step-3-talent
 * @access Private (Authenticated users with TALENT type only)
 */
export const onboardStep3Talent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const data: OnboardStep3TalentDTO = req.body;

    const result = await userService.step3SetTalentInfo(userId, data);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code || 400, []));
    }

    res.status(200).json({
      error: false,
      message: result.message,
      status: 200,
      errors: [],
      data: result.data,
    });
  }
);

/**
 * @name onboardStep3Business
 * @description Step 3: Set business-specific information
 * @route POST /user/onboard/step-3-business
 * @access Private (Authenticated users with BUSINESS type only)
 */
export const onboardStep3Business = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const data: OnboardStep3BusinessDTO = req.body;

    const result = await userService.step3SetBusinessInfo(userId, data);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code || 400, []));
    }

    res.status(200).json({
      error: false,
      message: result.message,
      status: 200,
      errors: [],
      data: result.data,
    });
  }
);

/**
 * @name onboardComplete
 * @description Step 4: Complete onboarding process
 * @route POST /user/onboard/complete
 * @access Private (Authenticated users only)
 */
export const onboardComplete = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const result = await userService.step4CompleteOnboarding(userId);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code || 400, []));
    }

    res.status(200).json({
      error: false,
      message: result.message,
      status: 200,
      errors: [],
      data: result.data,
    });
  }
);

/**
 * @name getOnboardingStatus
 * @description Get current onboarding status and progress
 * @route GET /user/onboard/status
 * @access Private (Authenticated users only)
 */
export const getOnboardingStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return next(new ErrorResponse("Unauthorized", 401, []));
    }

    const result = await userService.getOnboardingStatus(userId);

    if (result.error) {
      return next(new ErrorResponse(result.message, result.code || 400, []));
    }

    res.status(200).json({
      error: false,
      message: result.message,
      status: 200,
      errors: [],
      data: result.data,
    });
  }
);



    // create user
    // get all user account 
    // get user account by id
    // update user account
    // deactivate user account
    // suspend user account
    // delete user account
    // get user preferences
    // update user preferences
    // create user preferences

    // follow a user
    // unfollow a user

    // switch user profile
    // update user roles & permissions.
    // update user account details
    // update user account status
