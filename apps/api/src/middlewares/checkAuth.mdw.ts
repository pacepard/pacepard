import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/error.util";
import userRepository from "../modules/user/user.repository";
import { IUserDoc } from "../modules/user/user.interface";

interface AuthRequest extends Request {
  user?: IUserDoc;
}

/**
 * @name Protect
 * @description Middleware to protect routes by verifying JWT token
 * @access Private routes
 */
const Protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new ErrorResponse("Not authorized to access this route", 401, []));
    }

    try {
      // Verify token
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return next(new ErrorResponse("JWT secret is not configured", 500, []));
      }

      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

      // Get user from token
      const userResult = await userRepository.findById(decoded.id);
      if (userResult.error || !userResult.data) {
        return next(new ErrorResponse("User not found", 404, []));
      }

      const user = userResult.data as IUserDoc;

      // Verify token matches user's stored token
      if (user.accessToken !== token) {
        return next(new ErrorResponse("Token is invalid or expired", 401, []));
      }

      // Check if account is deactivated
      if (user.isDeactivated) {
        return next(new ErrorResponse("Account has been deactivated", 403, []));
      }

      // Attach user to request
      req.user = user;
      (req as any).user = { id: user._id, ...user };

      next();
    } catch (error: any) {
      return next(new ErrorResponse("Token is invalid or expired", 401, []));
    }
  } catch (error: any) {
    return next(new ErrorResponse("Authentication failed", 401, []));
  }
};

export default Protect;

