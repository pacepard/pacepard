import mongoose, { Schema, Model, ObjectId } from "mongoose";
import { IAdminDoc } from "../../utils/interfaces.util";
import { DbModels } from "../../utils/eums.util";

const AdminSchema = new Schema<IAdminDoc>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    userType: { type: String, required: true },

    phoneNumber: { type: String },
    phoneCode: { type: String, default: "+234" },
    country: { type: String },
    countryPhone: { type: String },

    avatar: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String },
    slug: { type: String, unique: true, index: true },

    permissions: {
      manageUsers: { type: Boolean, default: false },
      manageOrganisations: { type: Boolean, default: false },
      manageTalents: { type: Boolean, default: false },
      manageContent: { type: Boolean, default: false },
      viewLogs: { type: Boolean, default: false },
      manageApiKeys: { type: Boolean, default: false },
    },

    apiKeys: [
      {
        key: { type: String, required: true },
        description: { type: String },
        createdAt: { type: Date, default: Date.now },
        lastUsed: { type: Date },
      },
    ],
    ipWhitelist: [{ type: String }],

    actionsTaken: [
      {
        action: { type: String, required: true },
        targetId: { type: String },
        timestamp: { type: Date, default: Date.now },
        description: { type: String },
      },
    ],

    managedUsers: [{ type: Schema.Types.ObjectId, ref: DbModels.USER }],
    managedOrganisations: [{ type: Schema.Types.ObjectId, ref: DbModels.ORGANIZATION }],
    managedTalents: [{ type: Schema.Types.ObjectId, ref: DbModels.TALENT }],

    identification: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },

    user: { type: Schema.Types.ObjectId, ref: DbModels.USER },
    createdBy: { type: Schema.Types.ObjectId, ref: DbModels.USER },
    settings: { type: Schema.Types.ObjectId, ref: DbModels.ADMIN},
  },
  {
    timestamps: true,
    versionKey: "_version",
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id && (ret._id as any).toString ? (ret._id as any).toString() : String(ret._id);
        delete (ret as any).__v;
      },
    },
  }
);

AdminSchema.set("toJSON", { virtuals: true, getters: true });

const Admin: Model<IAdminDoc> = mongoose.model<IAdminDoc>(
  DbModels.ADMIN,
  AdminSchema
);

export default Admin;
