import { ObjectId, Document, Model} from "mongoose";
import { OtpType, PasswordType, UserType, FileType, UploadStatus } from "../../utils/eums.util";
import { Nullable } from "../../utils/interfaces.util";

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
  //_id: ObjectId;
  id: string;
}