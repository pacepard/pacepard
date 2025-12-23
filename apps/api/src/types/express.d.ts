import type { IUserDoc } from '../modules/user/user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: IUserDoc | { id: string };
    }
  }
}

export {};
