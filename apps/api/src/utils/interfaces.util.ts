import { PasswordType, UserType, OtpType, FileType, UploadStatus } from "./eums.util";
import { Model, Document, ObjectId } from "mongoose";

export type Nullable<T> = T | null;
export interface IRoleDoc extends Document {
  name: string;
  description: string;
  slug: string;
  scope?: string;
  scopeId?: string;

  // relationships
  permissions: Array<string>;
  users: Array<ObjectId | any>;

  // timestamps
  createdAt: string;
  updatedAt: string;
  _version: number;
  // _id: ObjectId;
  id: ObjectId | string;
}


export interface IResult<T = any> {
    error: boolean;
    message: string;
    code: number;
    data: any;
    total?: number;
  }

 export interface IUserDoc extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordType: PasswordType; // encrypt this data
  userType: UserType;

  //user: string;
  phoneNumber: string;
  phoneCode: string;
  country: string;
  countryPhone: string;

  avatar: {
    fileName: string;
    fileSize: number;
    fileType: FileType;
    mimetype: string;
    uploadedBy: ObjectId | any;
    uploadStatus: UploadStatus;
    uploadId: string;
    s3Key: string;
    rawFile: string;
  };

  dateOfBirth: Date;
  gender: string;
  location: string;

  Otp: string;
  OtpExpiry: number;
  otpType: OtpType;
  accessToken: string;
  accessTokenExpiry: Date;
  tokenVersion: number;

  isSuper: boolean;
  isAdmin: boolean;
  isOrganisation: boolean;
  isTalent: boolean;
  isUser: boolean;

  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActivated: boolean;
  isDeactivated: boolean;

  lastLogin: string;
  isActive: boolean;
  loginLimit: number;
  isLocked: boolean;
  lockedUntil: Nullable<Date>;
  twoFactorEnabled: boolean;

  // Notification Preferences
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };

  // relationships
  role: ObjectId | any;

  matchPassword: (password: string) => boolean;
  getAuthToken: () => string;

  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  // _id: ObjectId;
  id: ObjectId | string;
}

  export interface ILogin {
  email: string;
  password: string;
  code: string;
}

export interface IResult<T = any> {
  error: boolean;
  message: string;
  code: number;
  data: any;
}

export interface IAdminDoc extends Document {
  firstName: string;
  lastName: string;
  email: string;
  userType: string

  //user: string;
  phoneNumber: string;
  phoneCode: string;
  country: string;
  countryPhone: string;

  avatar: string;
  dateOfBirth: Date;
  gender: string;
  slug: string;

  permissions: {
    manageUsers: boolean;
    manageOrganisations: boolean;
    manageTalents: boolean;
    manageContent: boolean;
    viewLogs: boolean;
    manageApiKeys: boolean;
  };

  // API & Security Management
  apiKeys: Array<{
    key: string;
    description: string;
    createdAt: Date;
    lastUsed: Date;
  }>;
  ipWhitelist: Array<string>;

  // Admin Actions & Moderation
  actionsTaken: Array<{
    action: string;
    targetId: string;
    timestamp: Date;
    description: string;
  }>;
  
  // Relationships managed by the admin
  managedUsers: Array<ObjectId | any>;
  managedOrganisations: Array<ObjectId | any>;
  managedTalents: Array<ObjectId | any>;

  // Security & Verification
  identification: Array<string>;
  isVerified: boolean;
  verifiedAt: Date | null;

  //relationships
  user: ObjectId | any;
  createdBy: ObjectId | any;
  settings: ObjectId | any;

  // time stamps
  createdAt: string;
  updatedAt: string;
  _version: number;
  // _id: ObjectId;
  id: ObjectId | string;
}