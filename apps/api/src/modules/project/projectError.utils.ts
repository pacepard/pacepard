// utils/app-error.util.ts
export abstract class AppError extends Error {
  public statusCode: number;
  public errors: string[];
  public data?: any;

  constructor(
    message: string,
    statusCode: number,
    errors: string[] = [],
    data?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors.length ? errors : [message];
    this.data = data ?? {};
    Error.captureStackTrace(this, this.constructor);
  }
}
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, errors: string[] = []) {
    super(message, 400, errors);
  }
}
