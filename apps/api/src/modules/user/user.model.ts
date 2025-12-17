import mongoose, { Schema, Model } from "mongoose";
import { IUserDoc } from "../../utils/interfaces.util";
import {
  DbModels,
  OtpType,
  PasswordType,
  UserType,
} from "/Users/mac/Documents/start-up/pacepard/apps/api/src/utils/eums.util.ts";
import authService from "../auth/auth.service";

const UserSchema = new Schema<IUserDoc>(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, default: "", select: false },
    passwordType: {
      type: String,
      enum: Object.values(PasswordType),
      default: PasswordType.USERGENERATED,
    },
    userType: {
      type: String,
      enum: Object.values(UserType),
    },
    phoneNumber: { type: String },
    phoneCode: { type: String, default: "+234" },
    country: { type: String },
    countryPhone: { type: String },

    dateOfBirth: { type: Date },
    gender: { type: String },
    location: {
      address: String,
      city: String,
      state: String,
    },

    Otp: { type: String },
    OtpExpiry: {
      type: Number,
    },
    otpType: { type: String, enum: Object.values(OtpType) },
    accessToken: { type: String },
    accessTokenExpiry: { type: Date },
    tokenVersion: { type: Number, default: 0 },

    isSuper: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isTalent: { type: Boolean, default: false },
    isOrganisation: { type: Boolean, default: false },
    isUser: { type: Boolean, default: false },

    isActivated: { type: Boolean, default: false },
    isDeactivated: { type: Boolean, default: false },
    lastLogin: { type: String },
    isActive: { type: Boolean, default: false },

    loginLimit: { type: Number, default: 5 },
    lockedUntil: { type: Date },
    twoFactorEnabled: { type: Boolean, default: false },

    // Notification Preferences
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },

    // Relationships
role: {
  type: Schema.Types.ObjectId,
  ref: DbModels.ROLE,
  index: true,
},
  },
  {
    timestamps: true,
    versionKey: "_version",
    toJSON: {
      virtuals: true,
      getters: true,
      transform(_doc, ret) {
        return {
          ...ret,
          id: ret._id.toString(),
        };
      },
    },
  }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  await authService.encryptUserPassword(this, this.password);
});

const User: Model<IUserDoc> = mongoose.model<IUserDoc>(
  DbModels.USER,
  UserSchema
);

export default User;
