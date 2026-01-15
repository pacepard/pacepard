import { IUserDoc } from "../modules/users/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDoc;
    }
  }
}