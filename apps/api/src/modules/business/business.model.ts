import mongoose, { Schema, Model, Types } from "mongoose";
import { IBusinessDoc, VerificationType } from "./business.interface";
import { DbModels } from "../../utils/eums.util";

const ObjectId = Types.ObjectId;

/**
 * Embedded Schemas
 */
const SocialSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    username: { type: String },
  },
  { _id: false }
);

const BusinessRegistrationSchema = new Schema(
  {
    RegisteredBusinessName: { type: String },
    registrationNumber: { type: String },
    registrationDate: { type: Date },
    registrationCountry: { type: String },
  },
  { _id: false }
);

const VerificationSchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(VerificationType),
      default: VerificationType.UNVERIFIED,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: DbModels.ADMIN,
    },
    verifiedAt: { type: Date },
    reason: { type: String },
  },
  { _id: false }
);

/**
 * Business Schema
 */
const BusinessSchema = new Schema<IBusinessDoc>(
  {
    code: { type: String, required: true, unique: true, index: true },

    firstName: { type: String },
    lastName: { type: String },
    slug: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, lowercase: true, index: true },

    businessName: { type: String, required: true },
    businessType: { type: String },
    description: { type: String },
    size: { type: String },
    industry: { type: String },
    tags: { type: [String], default: [] },
    website: { type: String },
    socials: { type: [SocialSchema] as any, default: [] },

    verification: { type: VerificationSchema, default: {} },
    registration: { type: BusinessRegistrationSchema },

    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: DbModels.ADMIN,
    },

    isPublic: { type: Boolean, default: false },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: DbModels.USER,
      required: true,
    },

    settings: {
      type: Schema.Types.ObjectId,
      ref: DbModels.SETTINGS,
    },

    /**
     * Relationships
     */
    user: {
      type: Schema.Types.ObjectId,
      ref: DbModels.USER,
    },

    workspaces: [{ type: Schema.Types.ObjectId, ref: DbModels.WORKSPACE }],
    subscription: {
      type: Schema.Types.ObjectId,
      ref: DbModels.SUBSCRIPTION,
    },
    transactions: [{ type: Schema.Types.ObjectId, ref: DbModels.TRANSACTION }],

    discovery: [{ type: Schema.Types.ObjectId, ref: DbModels.DISCOVERY }],
    customDomain: [{ type: Schema.Types.ObjectId, ref: DbModels.DOMAIN }],
    templates: [{ type: Schema.Types.ObjectId, ref: DbModels.TEMPLATE }],

    hackathons: [{ type: Schema.Types.ObjectId, ref: DbModels.HACKATHON }],
    entries: [{ type: Schema.Types.ObjectId, ref: DbModels.ENTRY }],
    submissions: [{ type: Schema.Types.ObjectId, ref: DbModels.SUBMISSION }],

    projects: [{ type: Schema.Types.ObjectId, ref: DbModels.PROJECT }],
    teams: [{ type: Schema.Types.ObjectId, ref: DbModels.TEAM }],
    tasks: [{ type: Schema.Types.ObjectId, ref: DbModels.TASK }],
  },
  {
    timestamps: true,
    versionKey: "_version",
    toJSON: {
      virtuals: true,
      getters: true,
      transform(_doc, ret) {
        ret.id = ret._id;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

/**
 * 🔒 Invariants
 * Business becomes public ONLY when verified
 */
BusinessSchema.pre("save" as any, function (this: mongoose.Document & IBusinessDoc, next: (err?: mongoose.CallbackError) => void) {
  if (this.verification?.status === VerificationType.VERIFIED) {
    this.isPublic = true;
  } else {
    this.isPublic = false;
  }
  next();
});

/**
 * Indexes
 */
BusinessSchema.index({ slug: 1 });
BusinessSchema.index({ industry: 1 });
BusinessSchema.index({ tags: 1 });

const Business: Model<IBusinessDoc> = mongoose.model<IBusinessDoc>(
  DbModels.BUSINESS,
  BusinessSchema
);

export default Business;
