import mongoose, { Schema, Model, ObjectId } from "mongoose";
import { IOrganisationDoc } from "../../utils/interfaces.util";
import {
  DbModels,
  PasswordType,
  UserType,
  FileType,
  UploadStatus,
} from "../../utils/eums.util";

const OrganisationSchema = new Schema<IOrganisationDoc>(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, lowercase: true, unique: true, index: true },
    password: { type: String, select: false },
    passwordType: {
      type: String,
      enum: Object.values(PasswordType),
      default: PasswordType.USERGENERATED,
    },
    userType: {
      type: String,
      enum: Object.values(UserType),
      default: UserType.ORGANISATION,
    },

    banner: { type: String },
    logo: { type: String },
    description: { type: String },
    partners: [{ type: String }],

    socialLinks: {
      github: String,
      twitter: String,
      facebook: String,
      instagram: String,
      website: String,
    },

    backgroundImage: {
      fileName: { type: String },
      fileSize: { type: Number },
      fileType: { type: String, enum: Object.values(FileType) },
      mimetype: { type: String },
      uploadedBy: { type: Schema.Types.ObjectId, ref: DbModels.USER },
      uploadStatus: { type: String, enum: Object.values(UploadStatus) },
      uploadId: { type: String },
      s3Key: { type: String },
      rawFile: { type: String },
    },

    // relationships
    users: [{ type: Schema.Types.ObjectId, ref: DbModels.USER }],
    evaluators: [{ type: Schema.Types.ObjectId, ref: DbModels.EVALUATOR }],
    mentors: [{ type: Schema.Types.ObjectId, ref: DbModels.MENTOR }],
    createdBy: { type: Schema.Types.ObjectId, ref: DbModels.USER },
    settings: { type: Schema.Types.ObjectId, ref: DbModels.ORGANIZATION },
    hackathons: [{ type: Schema.Types.ObjectId, ref: DbModels.CAMPAIGN }],
    projects: [{ type: Schema.Types.ObjectId, ref: DbModels.PROJECT }],
    competitions: [{ type: Schema.Types.ObjectId, ref: DbModels.COMPETITION }],
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

OrganisationSchema.set("toJSON", { virtuals: true, getters: true });

const Organisation: Model<IOrganisationDoc> = mongoose.model<IOrganisationDoc>(
  DbModels.ORGANIZATION,
  OrganisationSchema
);

export default Organisation;
