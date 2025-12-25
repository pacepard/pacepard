import { Types, Document } from 'mongoose';
import { Nullable } from '../../utils/interfaces.util';
import { IAPIKey, IAPIKeyDoc } from '../apikey/apikey.interface';
import { IRoleDoc } from '../role/role.interface'
import { IPermissionDoc } from '../permission/permission.interface'
import { INotificationDoc } from '../notification/notification.interface';

type ObjectId = Types.ObjectId;

export interface IUserDoc extends Document {
    code: string; // user public ID
    firstName: string;
    lastName: string;
    slug: string;
    email: string;
    password: string; // encrypt this data
    passwordType: PasswordType;
    userType: UserType;

    avatar: {
        fileName: string;
        s3Key: string;
    };

    coverImage: {
        fileName: string;
        s3Key: string;
    };

    image: {
        fileName: string;
        s3Key: string;
    };

    location: ILocation;
    timeZone: string;

    login: {
        last: string;
        method: string;
    };
    onboard: {
        step: number;
        status: string;
    };

    inviteStatus: string;

    apiKey: IAPIKey;
    keys: Array<IAPIKeyDoc | any>;

    Otp: string;
    OtpExpiry: number;
    otpType: OtpType;
    accessToken: string;
    accessTokenExpiry: Date;
    tokenVersion: number;

    isSuper: boolean;
    isAdmin: boolean;
    isBusiness: boolean;
    isTalent: boolean;
    isUser: boolean;

    isActivated: boolean;
    isDeactivated: boolean;
    isSuspended: boolean;
    isActive: boolean;
    loginLimit: number;
    isLocked: boolean;
    lockedUntil: Nullable<Date>;
    twoFactorEnabled: boolean;

    devices: Array<IDevice>;

    // relationships
    roles: Array<IRoleDoc | any>;
    permissions: Array<IPermissionDoc | any>;
    notifications: Array<INotificationDoc | any>;

    matchPassword: (password: string) => boolean;
    getAuthToken: () => string;

    // time stamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}

export enum PasswordType {
    USERGENERATED = 'user-generated',
    SYSTEMGENERATED = 'system-generated',
    TEMPORARY = 'temporary',
    RESET = 'reset',
}

export enum UserType {
    SUPERADMIN = 'super-admin',
    ADMIN = 'admin',
    ORGANISATION = 'organisation',
    TALENT = 'talent',
    MENTOR = 'mentor',
    EVALUATOR = 'evaluator',
    USER = 'user',
}

export enum OtpType {
    REGISTER = 'register',
    LOGIN = 'login',
    VERIFY = 'verify',
    GENERIC = 'generic',
    PASSWORD_RESET = 'password-reset',
    ACTIVATEACCOUNT = 'activate-account',
    CHANGEPASSWORD = 'change-password',
    FORGOTPASSWORD = 'forgot-password',
    MENTOR_INVITE = 'mentor-type',
    TEAM_INVITE = 'team-invite',
}

export interface ILocation {
    phoneCode: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export interface IDevice {

}