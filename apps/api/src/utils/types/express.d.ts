import type { IUserDoc } from "../utils/interfaces.util";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDoc | { id: string };
    }
  }
}

export {};
